<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = Community::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (Community $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = Community::query()->where('slug', $slug);

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
        if (! isset($data['sort_order'])) {
            $data['sort_order'] = (int) Community::query()->max('sort_order') + 1;
        }
        $item = Community::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, Community $community)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $community->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $community->update($data);

        return response()->json($this->transform($community->fresh(), $locale));
    }

    public function destroy(Community $community)
    {
        $community->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:communities,slug,'.($ignoreId ?? 'NULL')],
            'name' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(Community $item, ?string $locale = null): array
    {
        $resolved = Locale::resolve(
            [
                'name' => $item->name,
                'location' => $item->location,
                'description' => $item->description,
            ],
            $item->translations,
            ['name', 'location', 'description'],
            $locale
        );

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'name' => $resolved['name'],
            'title' => $resolved['name'],
            'location' => $resolved['location'],
            'description' => $resolved['description'],
            'coverImage' => $item->cover_image,
            'gallery' => is_array($item->gallery) ? $item->gallery : [],
            'path' => '/our-lady/communities/'.$item->slug,
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'translations' => $item->translations ?? [],
        ];
    }
}
