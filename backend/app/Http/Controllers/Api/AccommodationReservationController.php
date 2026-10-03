<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccommodationReservation;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AccommodationReservationController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'facility_id' => ['nullable', 'integer', 'exists:facilities,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'page' => ['nullable', 'integer', 'min:1'],
            'all' => ['nullable', 'boolean'],
        ]);

        $query = AccommodationReservation::query()->orderByDesc('check_in')->orderByDesc('id');

        if (! empty($filters['facility_id'])) {
            $query->where('facility_id', $filters['facility_id']);
        }
        if (! empty($filters['date_from'])) {
            $query->whereDate('check_out', '>=', $filters['date_from']);
        }
        if (! empty($filters['date_to'])) {
            $query->whereDate('check_in', '<=', $filters['date_to']);
        }

        $grandTotal = AccommodationReservation::query()->count();

        if ($request->boolean('all')) {
            $rows = $query->get();

            return response()->json([
                'data' => $rows->map(fn (AccommodationReservation $row) => $this->transform($row))->values(),
                'total' => $rows->count(),
                'grand_total' => $grandTotal,
                'page' => 1,
                'per_page' => $rows->count(),
                'last_page' => 1,
            ]);
        }

        $page = $query->paginate(15)->withQueryString();

        return response()->json([
            'data' => collect($page->items())->map(fn (AccommodationReservation $row) => $this->transform($row))->values(),
            'total' => $page->total(),
            'grand_total' => $grandTotal,
            'page' => $page->currentPage(),
            'per_page' => $page->perPage(),
            'last_page' => $page->lastPage(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug' => ['required', 'string', 'max:255'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests' => ['required', 'integer', 'min:1', 'max:500'],
            'guest_names' => ['required', 'array', 'min:1'],
            'guest_names.*' => ['required', 'string', 'max:120'],
            'country' => ['required', 'string', 'max:120'],
            'trip_reason' => ['nullable', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'additional_request' => ['nullable', 'string', 'max:5000'],
        ]);

        $facility = Facility::query()
            ->where('slug', $data['slug'])
            ->where('is_published', true)
            ->first();

        if (! $facility) {
            throw ValidationException::withMessages([
                'slug' => 'This accommodation is not available for booking.',
            ]);
        }

        $whatsapp = trim((string) $facility->whatsapp);
        if ($whatsapp === '') {
            throw ValidationException::withMessages([
                'whatsapp' => 'This stay does not accept WhatsApp reservations.',
            ]);
        }

        $names = collect($data['guest_names'])
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->values();

        if ($names->count() !== (int) $data['guests']) {
            throw ValidationException::withMessages([
                'guest_names' => 'Enter a name for every guest.',
            ]);
        }

        $rooms = (int) ceil(((int) $data['guests']) / 2);
        if ($facility->room_count && $rooms > (int) $facility->room_count) {
            $maxGuests = (int) $facility->room_count * 2;
            throw ValidationException::withMessages([
                'guests' => "This stay has {$facility->room_count} rooms and can host {$maxGuests} guests.",
            ]);
        }

        $reservation = AccommodationReservation::create([
            'facility_id' => $facility->id,
            'accommodation_name' => $facility->title,
            'check_in' => $data['check_in'],
            'check_out' => $data['check_out'],
            'guests' => (int) $data['guests'],
            'rooms' => $rooms,
            'guest_names' => $names->all(),
            'country' => trim($data['country']),
            'trip_reason' => trim((string) ($data['trip_reason'] ?? '')) ?: null,
            'organization' => trim((string) ($data['organization'] ?? '')) ?: null,
            'additional_request' => trim((string) ($data['additional_request'] ?? '')) ?: null,
            'whatsapp_number' => $whatsapp,
        ]);

        return response()->json($this->transform($reservation), 201);
    }

    private function transform(AccommodationReservation $reservation): array
    {
        return [
            'id' => $reservation->id,
            'facilityId' => $reservation->facility_id,
            'accommodationName' => $reservation->accommodation_name,
            'checkIn' => optional($reservation->check_in)->toDateString(),
            'checkOut' => optional($reservation->check_out)->toDateString(),
            'guests' => $reservation->guests,
            'rooms' => $reservation->rooms,
            'guestNames' => $reservation->guest_names ?? [],
            'country' => $reservation->country,
            'tripReason' => $reservation->trip_reason,
            'organization' => $reservation->organization,
            'additionalRequest' => $reservation->additional_request,
            'whatsappNumber' => $reservation->whatsapp_number,
            'createdAt' => optional($reservation->created_at)->toDateTimeString(),
        ];
    }
}
