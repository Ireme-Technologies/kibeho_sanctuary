<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioItem;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AudioItemController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = AudioItem::query()->orderBy('sort_order')->orderByDesc('published_at')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        return response()->json(
            $query->get()->map(fn (AudioItem $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = AudioItem::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json($this->transform($query->firstOrFail(), $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = ! empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        if (! isset($data['sort_order'])) {
            $data['sort_order'] = (int) AudioItem::query()->max('sort_order') + 1;
        }
        $item = AudioItem::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, AudioItem $audioItem)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $audioItem->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $audioItem->update($data);

        return response()->json($this->transform($audioItem->fresh(), $locale));
    }

    public function destroy(AudioItem $audioItem)
    {
        $audioItem->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:audio_items,slug,'.($ignoreId ?? 'NULL')],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', Rule::in(['audio', 'documentary', 'broadcast'])],
            'audio_url' => ['nullable', 'string', 'max:500'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'duration' => ['nullable', 'string', 'max:50'],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(AudioItem $item, ?string $locale = null): array
    {
        $resolved = Locale::resolve(
            [
                'title' => $item->title,
                'description' => $item->description,
            ],
            $item->translations,
            ['title', 'description'],
            $locale
        );

        $pathBase = match ($item->type) {
            'documentary' => '/news/documentaries/',
            'broadcast' => '/news/broadcast/',
            default => '/news/audio/',
        };

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'title' => $resolved['title'],
            'description' => $resolved['description'],
            'type' => $item->type,
            'audioUrl' => $item->audio_url,
            'coverImage' => $item->cover_image,
            'duration' => $item->duration,
            'publishedAt' => $item->published_at?->toIso8601String(),
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'path' => $pathBase.$item->slug,
            'translations' => $item->translations ?? [],
        ];
    }
}
