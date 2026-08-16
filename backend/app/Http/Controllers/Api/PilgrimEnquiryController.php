<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EnquiryAdminAlert;
use App\Mail\EnquiryReceivedThankYou;
use App\Mail\EnquiryReplyNotification;
use App\Models\PilgrimEnquiry;
use App\Models\PilgrimEnquiryDocument;
use App\Models\PilgrimEnquiryMessage;
use App\Models\Setting;
use App\Models\User;
use App\Services\DocumentOptimizer;
use App\Services\EmailValidator;
use App\Services\WhatsAppUrlBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PilgrimEnquiryController extends Controller
{
    public function store(Request $request, EmailValidator $emails, WhatsAppUrlBuilder $whatsapp)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'enquiry_type' => ['nullable', Rule::in(['visit', 'group', 'prayer', 'donation', 'accommodation', 'pilgrimage', 'general', 'candle', 'mass'])],
            'upcoming_pilgrimage_id' => ['nullable', 'integer', 'exists:upcoming_pilgrimages,id'],
            'channel' => ['required', Rule::in(['email', 'whatsapp'])],
        ]);

        if ($data['channel'] === 'email') {
            if (empty($data['email'])) {
                return response()->json(['message' => 'Email is required for email enquiries.', 'errors' => ['email' => ['Email is required.']]], 422);
            }
            $emails->assertDeliverable($data['email']);
        }

        $userId = null;
        if (! empty($data['email'])) {
            $existing = User::query()->where('email', $data['email'])->where('role', 'client')->first();
            if ($existing) {
                $userId = $existing->id;
            }
        }

        $enquiry = PilgrimEnquiry::create([
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? '',
            'subject' => $data['subject'] ?? null,
            'message' => $data['message'],
            'enquiry_type' => $data['enquiry_type'] ?? 'general',
            'upcoming_pilgrimage_id' => $data['upcoming_pilgrimage_id'] ?? null,
            'channel' => $data['channel'],
            'status' => 'new',
            'user_id' => $userId,
            'is_read' => false,
        ]);

        PilgrimEnquiryMessage::create([
            'pilgrim_enquiry_id' => $enquiry->id,
            'user_id' => $userId,
            'author_type' => 'client',
            'body' => $data['message'],
        ]);

        $whatsappUrl = null;
        if ($data['channel'] === 'whatsapp') {
            $whatsappUrl = $whatsapp->build($whatsapp->enquiryPrefill($data));
        }

        if ($data['channel'] === 'email' && ! empty($data['email'])) {
            try {
                Mail::to($data['email'])->send(new EnquiryReceivedThankYou($enquiry));
            } catch (\Throwable) {
                // Persist enquiry even if mail fails; admin can still follow up.
            }
        }

        $this->notifyAdmin($enquiry);

        return response()->json([
            'message' => $data['channel'] === 'whatsapp'
                ? 'Enquiry saved. Continue in WhatsApp to send your message.'
                : 'Thanks for reaching out! We sent a confirmation email and will get back to you soon.',
            'id' => $enquiry->id,
            'whatsapp_url' => $whatsappUrl,
        ], 201);
    }

    public function stats()
    {
        $total = PilgrimEnquiry::query()->count();
        $email = PilgrimEnquiry::query()->where('channel', 'email')->count();
        $whatsapp = PilgrimEnquiry::query()->where('channel', 'whatsapp')->count();
        $unread = PilgrimEnquiry::query()->where('is_read', false)->count();
        $inProgress = PilgrimEnquiry::query()->where('status', 'in_progress')->count();

        return response()->json([
            'total' => $total,
            'email' => $email,
            'whatsapp' => $whatsapp,
            'unread' => $unread,
            'in_progress' => $inProgress,
        ]);
    }

    public function index(Request $request)
    {
        $query = PilgrimEnquiry::query()->orderByDesc('created_at');

        if ($request->filled('channel')) {
            $query->where('channel', $request->string('channel'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('enquiry_type')) {
            $query->where('enquiry_type', $request->string('enquiry_type'));
        }

        return response()->json($query->limit(200)->get());
    }

    public function show(PilgrimEnquiry $pilgrimEnquiry)
    {
        if (! $pilgrimEnquiry->is_read) {
            $pilgrimEnquiry->update(['is_read' => true]);
        }

        return response()->json($pilgrimEnquiry->load(['messages.user', 'documents', 'user']));
    }

    public function update(Request $request, PilgrimEnquiry $pilgrimEnquiry)
    {
        $data = $request->validate([
            'status' => ['sometimes', Rule::in(['new', 'in_progress', 'pending_client', 'closed'])],
            'is_read' => ['sometimes', 'boolean'],
            'enquiry_type' => ['sometimes', Rule::in(['visit', 'group', 'prayer', 'donation', 'accommodation', 'pilgrimage', 'general', 'candle', 'mass'])],
        ]);

        $pilgrimEnquiry->update($data);

        return response()->json($pilgrimEnquiry->fresh()->load(['messages.user', 'documents']));
    }

    public function destroy(PilgrimEnquiry $pilgrimEnquiry)
    {
        foreach ($pilgrimEnquiry->documents as $doc) {
            Storage::disk('public')->delete($doc->path);
        }
        $pilgrimEnquiry->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    public function reply(Request $request, PilgrimEnquiry $pilgrimEnquiry, WhatsAppUrlBuilder $whatsapp)
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:10000'],
            'notify_email' => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();
        $reply = PilgrimEnquiryMessage::create([
            'pilgrim_enquiry_id' => $pilgrimEnquiry->id,
            'user_id' => $user?->id,
            'author_type' => 'admin',
            'body' => $data['body'],
        ]);

        if ($pilgrimEnquiry->status === 'new') {
            $pilgrimEnquiry->update(['status' => 'in_progress', 'is_read' => true]);
        } else {
            $pilgrimEnquiry->update(['is_read' => true]);
        }

        $notify = $data['notify_email'] ?? ($pilgrimEnquiry->channel === 'email');
        if ($notify && $pilgrimEnquiry->email) {
            try {
                Mail::to($pilgrimEnquiry->email)->send(new EnquiryReplyNotification($pilgrimEnquiry, $reply));
            } catch (\Throwable) {
            }
        }

        $whatsappUrl = null;
        if ($pilgrimEnquiry->channel === 'whatsapp' && $pilgrimEnquiry->phone) {
            $whatsappUrl = $whatsapp->build($data['body'], $pilgrimEnquiry->phone);
        }

        return response()->json([
            'message' => $reply->load('user'),
            'enquiry' => $pilgrimEnquiry->fresh()->load(['messages.user', 'documents']),
            'whatsapp_url' => $whatsappUrl,
        ]);
    }

    public function uploadDocument(Request $request, PilgrimEnquiry $pilgrimEnquiry, DocumentOptimizer $optimizer)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:15360', 'mimes:jpg,jpeg,png,gif,webp,pdf'],
            'note' => ['nullable', 'string', 'max:2000'],
        ]);

        $user = $request->user();
        $isAdmin = $user && $user->isSuperAdmin();
        $uploadedBy = $isAdmin ? 'admin' : 'client';

        if (! $isAdmin) {
            if (! $this->clientOwns($request, $pilgrimEnquiry)) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
        }

        $adminHasResponded = $pilgrimEnquiry->messages()->where('author_type', 'admin')->exists();
        if (! $adminHasResponded && ! $isAdmin) {
            return response()->json([
                'message' => 'Documents can be shared after the admin sends the first response.',
            ], 422);
        }

        $processed = $optimizer->process($request->file('file'));
        $name = Str::slug(pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = ($name ?: 'document').'-'.Str::random(8).'.'.$processed['extension'];
        $path = 'pilgrim-enquiries/'.$pilgrimEnquiry->id.'/'.$filename;
        Storage::disk('public')->put($path, $processed['contents']);

        $message = null;
        if ($request->filled('note')) {
            $message = PilgrimEnquiryMessage::create([
                'pilgrim_enquiry_id' => $pilgrimEnquiry->id,
                'user_id' => $user?->id,
                'author_type' => $uploadedBy === 'admin' ? 'admin' : 'client',
                'body' => $request->string('note'),
            ]);
        } else {
            $message = PilgrimEnquiryMessage::create([
                'pilgrim_enquiry_id' => $pilgrimEnquiry->id,
                'user_id' => $user?->id,
                'author_type' => $uploadedBy === 'admin' ? 'admin' : 'client',
                'body' => ($uploadedBy === 'admin' ? 'Admin' : 'Client').' uploaded a document: '.$request->file('file')->getClientOriginalName(),
            ]);
        }

        $document = PilgrimEnquiryDocument::create([
            'pilgrim_enquiry_id' => $pilgrimEnquiry->id,
            'pilgrim_enquiry_message_id' => $message->id,
            'uploaded_by' => $uploadedBy,
            'path' => $path,
            'url' => '/storage/'.ltrim($path, '/'),
            'original_name' => $request->file('file')->getClientOriginalName(),
            'mime_type' => $processed['mime'],
            'size' => $processed['size'],
        ]);

        if ($uploadedBy === 'admin') {
            $pilgrimEnquiry->update(['status' => 'pending_client']);
        } elseif ($pilgrimEnquiry->status === 'pending_client') {
            $pilgrimEnquiry->update(['status' => 'in_progress']);
        }

        return response()->json([
            'document' => $document,
            'enquiry' => $pilgrimEnquiry->fresh()->load(['messages.user', 'documents']),
            'optimized' => $processed['optimized'],
        ], 201);
    }

    public function clientIndex(Request $request)
    {
        PilgrimEnquiry::query()
            ->whereNull('user_id')
            ->where('email', $request->user()->email)
            ->update(['user_id' => $request->user()->id]);

        return response()->json(
            PilgrimEnquiry::query()
                ->where('user_id', $request->user()->id)
                ->orderByDesc('created_at')
                ->get()
        );
    }

    public function clientShow(Request $request, PilgrimEnquiry $pilgrimEnquiry)
    {
        if (! $this->clientOwns($request, $pilgrimEnquiry)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($pilgrimEnquiry->load(['messages.user', 'documents']));
    }

    public function clientReply(Request $request, PilgrimEnquiry $pilgrimEnquiry)
    {
        if (! $this->clientOwns($request, $pilgrimEnquiry)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'body' => ['required', 'string', 'max:10000'],
        ]);

        PilgrimEnquiryMessage::create([
            'pilgrim_enquiry_id' => $pilgrimEnquiry->id,
            'user_id' => $request->user()->id,
            'author_type' => 'client',
            'body' => $data['body'],
        ]);

        $pilgrimEnquiry->update([
            'user_id' => $pilgrimEnquiry->user_id ?: $request->user()->id,
            'status' => 'in_progress',
            'is_read' => false,
        ]);

        return response()->json($pilgrimEnquiry->fresh()->load(['messages.user', 'documents']));
    }

    public function clientStore(Request $request, EmailValidator $emails)
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'max:50'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'enquiry_type' => ['nullable', Rule::in(['visit', 'group', 'prayer', 'donation', 'accommodation', 'pilgrimage', 'general', 'candle', 'mass'])],
            'channel' => ['required', Rule::in(['email', 'whatsapp'])],
        ]);

        $user = $request->user();
        if ($data['channel'] === 'email') {
            $emails->assertDeliverable($user->email);
        }

        $enquiry = PilgrimEnquiry::create([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $data['phone'],
            'subject' => $data['subject'] ?? null,
            'message' => $data['message'],
            'enquiry_type' => $data['enquiry_type'] ?? 'general',
            'channel' => $data['channel'],
            'status' => 'new',
            'user_id' => $user->id,
            'is_read' => false,
        ]);

        PilgrimEnquiryMessage::create([
            'pilgrim_enquiry_id' => $enquiry->id,
            'user_id' => $user->id,
            'author_type' => 'client',
            'body' => $data['message'],
        ]);

        $this->notifyAdmin($enquiry);

        return response()->json($enquiry->load(['messages.user', 'documents']), 201);
    }

    private function clientOwns(Request $request, PilgrimEnquiry $pilgrimEnquiry): bool
    {
        $user = $request->user();
        if (! $user || ! $user->isClient()) {
            return false;
        }

        if ((int) $pilgrimEnquiry->user_id === (int) $user->id) {
            return true;
        }

        if ($pilgrimEnquiry->email && strcasecmp($pilgrimEnquiry->email, $user->email) === 0) {
            if (! $pilgrimEnquiry->user_id) {
                $pilgrimEnquiry->update(['user_id' => $user->id]);
            }

            return true;
        }

        return false;
    }

    private function notifyAdmin(PilgrimEnquiry $enquiry): void
    {
        $company = Setting::query()->where('key', 'company')->value('value') ?: [];
        if (is_string($company)) {
            $company = json_decode($company, true) ?: [];
        }
        $notify = $company['notifyEmail'] ?? $company['email'] ?? null;
        if (! $notify) {
            return;
        }

        try {
            Mail::to($notify)->send(new EnquiryAdminAlert($enquiry));
        } catch (\Throwable) {
        }
    }
}
