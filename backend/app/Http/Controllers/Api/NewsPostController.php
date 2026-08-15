<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsPost;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class NewsPostController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = NewsPost::query()->orderByDesc('published_at')->orderByDesc('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($event = $request->query('event')) {
            $query->where('related_event_slug', $event);
        }

        return response()->json(
            $query->get()->map(fn (NewsPost $post) => $this->transform($post, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = NewsPost::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        $post = $query->firstOrFail();

        return response()->json($this->transform($post, $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = !empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        $post = NewsPost::create($data);

        return response()->json($this->transform($post, $locale), 201);
    }

    public function update(Request $request, NewsPost $newsPost)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $newsPost->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $newsPost->update($data);

        return response()->json($this->transform($newsPost->fresh(), $locale));
    }

    public function destroy(NewsPost $newsPost)
    {
        $newsPost->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:news_posts,slug,'.($ignoreId ?? 'NULL')],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'related_event_slug' => ['nullable', 'string', 'max:255'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'author_avatar' => ['nullable', 'string', 'max:500'],
            'author_role' => ['nullable', 'string', 'max:255'],
            'author_bio' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(NewsPost $post, ?string $locale = null): array
    {
        $base = [
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'body' => $post->body,
                'category' => $post->category,
            ];
        $resolved = Locale::resolve($base, $post->translations, ['title', 'excerpt', 'body', 'category'], $locale);

        return [
            'id' => $post->id,
            'slug' => $post->slug,
            'title' => $resolved['title'],
            'excerpt' => $resolved['excerpt'],
            'body' => $resolved['body'],
            'category' => $resolved['category'],
            'tags' => $post->tags ?? [],
            'relatedEventSlug' => $post->related_event_slug,
            'author' => [
                'name' => $post->author_name,
                'avatar' => $post->author_avatar,
                'role' => $post->author_role,
                'bio' => $post->author_bio,
            ],
            'coverImage' => $post->cover_image,
            'publishedAt' => optional($post->published_at)->toDateString(),
            'isPublished' => $post->is_published,
            'comments' => [],
            'translations' => $post->translations ?? [],
        ];
    }
}
