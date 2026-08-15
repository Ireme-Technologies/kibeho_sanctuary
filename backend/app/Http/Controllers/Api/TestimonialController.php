<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = Testimonial::query()->orderBy('sort_order')->orderByDesc('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        if ($request->boolean('featured')) {
            $query->where('featured', true);
        }

        if ($event = $request->query('event')) {
            $query->where('related_event_slug', $event);
        }

        return response()->json(
            $query->get()->map(fn (Testimonial $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = Testimonial::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json($this->transform($query->firstOrFail(), $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = !empty($data['slug']) ? $data['slug'] : Str::slug($data['author_name'].'-'.Str::random(4));
        $item = Testimonial::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $testimonial->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $testimonial->update($data);

        return response()->json($this->transform($testimonial->fresh(), $locale));
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:testimonials,slug,'.($ignoreId ?? 'NULL')],
            'author_name' => ['required', 'string', 'max:255'],
            'author_role' => ['nullable', 'string', 'max:255'],
            'author_location' => ['nullable', 'string', 'max:255'],
            'author_avatar' => ['nullable', 'string', 'max:500'],
            'title' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'featured' => ['boolean'],
            'related_event_slug' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(Testimonial $item, ?string $locale = null): array
    {
        $base = [
                'title' => $item->title,
                'body' => $item->body,
                'author_role' => $item->author_role,
                'author_location' => $item->author_location,
            ];
        $resolved = Locale::resolve($base, $item->translations, ['title', 'body', 'author_role', 'author_location'], $locale);

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'authorName' => $item->author_name,
            'authorRole' => $resolved['author_role'],
            'authorLocation' => $resolved['author_location'],
            'authorAvatar' => $item->author_avatar,
            'title' => $resolved['title'],
            'body' => $resolved['body'],
            'rating' => $item->rating,
            'featured' => $item->featured,
            'relatedEventSlug' => $item->related_event_slug,
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'publishedAt' => optional($item->published_at)->toDateString(),
            'translations' => $item->translations ?? [],
        ];
    }
}
