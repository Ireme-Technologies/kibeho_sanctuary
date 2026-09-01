<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaryMessage;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MaryMessageController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = MaryMessage::query()->orderBy('sort_order')->orderBy('number')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (MaryMessage $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, int $maryMessage)
    {
        $locale = Locale::fromRequest($request);
        $query = MaryMessage::query()->where('id', $maryMessage);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json($this->transform($query->firstOrFail(), $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        if (! isset($data['sort_order'])) {
            $data['sort_order'] = (int) MaryMessage::query()->max('sort_order') + 1;
        }
        $item = MaryMessage::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, MaryMessage $maryMessage)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $maryMessage->id);
        $maryMessage->update($data);

        return response()->json($this->transform($maryMessage->fresh(), $locale));
    }

    public function destroy(MaryMessage $maryMessage)
    {
        $maryMessage->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'number' => ['nullable', 'integer', 'min:1', 'max:99'],
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'date_context' => ['nullable', 'string', 'max:255'],
            'theme' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(MaryMessage $item, ?string $locale = null): array
    {
        $resolved = Locale::resolve(
            [
                'title' => $item->title,
                'summary' => $item->summary,
                'body' => $item->body,
                'theme' => $item->theme,
                'date_context' => $item->date_context,
            ],
            $item->translations,
            ['title', 'summary', 'body', 'theme', 'date_context'],
            $locale
        );

        return [
            'id' => $item->id,
            'number' => $item->number,
            'title' => $resolved['title'],
            'summary' => $resolved['summary'],
            'body' => $resolved['body'],
            'dateContext' => $resolved['date_context'],
            'theme' => $resolved['theme'],
            'image' => $item->image,
            'coverImage' => $item->image,
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'translations' => $item->translations ?? [],
        ];
    }
}
