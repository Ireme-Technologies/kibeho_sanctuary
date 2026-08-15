<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = Video::query()->orderBy('sort_order')->orderByDesc('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (Video $video) => $this->transform($video, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = Video::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        $video = $query->firstOrFail();

        return response()->json($this->transform($video, $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = !empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        $data = $this->withYoutubeMeta($data);
        $video = Video::create($data);

        return response()->json($this->transform($video, $locale), 201);
    }

    public function update(Request $request, Video $video)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $video->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $data = $this->withYoutubeMeta($data);
        $video->update($data);

        return response()->json($this->transform($video->fresh(), $locale));
    }

    public function destroy(Video $video)
    {
        $video->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:videos,id'],
        ]);

        foreach ($data['order'] as $index => $id) {
            Video::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['message' => 'Reordered.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:videos,slug,'.($ignoreId ?? 'NULL')],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'youtube_url' => ['required', 'string', 'max:500'],
            'thumbnail_url' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function withYoutubeMeta(array $data): array
    {
        $id = $this->extractYoutubeId($data['youtube_url'] ?? '');
        $data['youtube_id'] = $id ?: null;
        if (empty($data['thumbnail_url']) && $id) {
            $data['thumbnail_url'] = "https://img.youtube.com/vi/{$id}/hqdefault.jpg";
        }

        return $data;
    }

    private function extractYoutubeId(?string $input): ?string
    {
        $raw = trim((string) $input);
        if ($raw === '') {
            return null;
        }
        if (preg_match('/^[\w-]{11}$/', $raw)) {
            return $raw;
        }
        if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/', $raw, $m)) {
            return $m[1];
        }

        return null;
    }

    private function transform(Video $video, ?string $locale = null): array
    {
        $base = [
                'title' => $video->title,
                'description' => $video->description,
            ];
        $resolved = Locale::resolve($base, $video->translations, ['title', 'description'], $locale);

        $id = $video->youtube_id;
        $thumb = $video->thumbnail_url
            ?: ($id ? "https://img.youtube.com/vi/{$id}/hqdefault.jpg" : null);

        return [
            'id' => $video->id,
            'slug' => $video->slug,
            'title' => $resolved['title'],
            'description' => $resolved['description'],
            'youtubeUrl' => $video->youtube_url,
            'youtubeId' => $id,
            'thumbnailUrl' => $thumb,
            'watchUrl' => $id ? "https://www.youtube.com/watch?v={$id}" : $video->youtube_url,
            'embedUrl' => $id ? "https://www.youtube.com/embed/{$id}" : null,
            'sortOrder' => $video->sort_order,
            'isPublished' => $video->is_published,
            'publishedAt' => optional($video->published_at)->toDateString(),
            'translations' => $video->translations ?? [],
        ];
    }
}
