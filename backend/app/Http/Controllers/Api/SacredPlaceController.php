<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SacredPlace;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SacredPlaceController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = SacredPlace::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return response()->json(
            $query->get()->map(fn (SacredPlace $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = SacredPlace::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json($this->transform($query->firstOrFail(), $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = ! empty($data['slug']) ? $data['slug'] : Str::slug($data['name']);
        $item = SacredPlace::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, SacredPlace $sacredPlace)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $sacredPlace->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $sacredPlace->update($data);

        return response()->json($this->transform($sacredPlace->fresh(), $locale));
    }

    public function destroy(SacredPlace $sacredPlace)
    {
        $sacredPlace->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:sacred_places,slug,'.($ignoreId ?? 'NULL')],
            'type' => ['required', Rule::in(['apparition_site', 'main_place'])],
            'category' => ['nullable', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:255'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'why_visit' => ['nullable', 'string'],
            'key_points' => ['nullable', 'array'],
            'key_points.*' => ['string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string'],
            'location' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function pathFor(SacredPlace $item): string
    {
        if ($item->type === 'apparition_site') {
            return '/shrine/apparition-sites/'.$item->slug;
        }

        return '/shrine/places/'.$item->slug;
    }

    private function transform(SacredPlace $item, ?string $locale = null): array
    {
        $base = [
            'name' => $item->name,
            'short_description' => $item->short_description,
            'description' => $item->description,
            'why_visit' => $item->why_visit,
            'location' => $item->location,
        ];
        $resolved = Locale::resolve(
            $base,
            $item->translations,
            ['name', 'short_description', 'description', 'why_visit', 'location'],
            $locale
        );

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'type' => $item->type,
            'category' => $item->category,
            'name' => $resolved['name'],
            'title' => $resolved['name'],
            'shortDescription' => Locale::cardExcerpt($resolved),
            'description' => $resolved['description'],
            'whyVisit' => $resolved['why_visit'],
            'keyPoints' => $item->key_points ?? [],
            'coverImage' => $item->cover_image,
            'gallery' => $item->gallery ?? [],
            'location' => $resolved['location'],
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'path' => $this->pathFor($item),
            'translations' => $item->translations ?? [],
        ];
    }
}
