<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShrineProject;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ShrineProjectController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = ShrineProject::query()->orderBy('sort_order')->orderByDesc('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        if ($request->boolean('featured')) {
            $query->where('featured', true);
        }

        return response()->json(
            $query->get()->map(fn (ShrineProject $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = ShrineProject::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json($this->transform($query->firstOrFail(), $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = !empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        $item = ShrineProject::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, ShrineProject $shrineProject)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $shrineProject->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $shrineProject->update($data);

        return response()->json($this->transform($shrineProject->fresh(), $locale));
    }

    public function destroy(ShrineProject $shrineProject)
    {
        $shrineProject->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:shrine_projects,slug,'.($ignoreId ?? 'NULL')],
            'title' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:100'],
            'phase' => ['nullable', 'string', 'max:100'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string'],
            'funding_goal' => ['nullable', 'string', 'max:100'],
            'funding_raised' => ['nullable', 'string', 'max:100'],
            'featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(ShrineProject $item, ?string $locale = null): array
    {
        $base = [
                'title' => $item->title,
                'short_description' => $item->short_description,
                'description' => $item->description,
                'status' => $item->status,
                'phase' => $item->phase,
            ];
        $resolved = Locale::resolve($base, $item->translations, ['title', 'short_description', 'description', 'status', 'phase'], $locale);

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'title' => $resolved['title'],
            'status' => $resolved['status'],
            'phase' => $resolved['phase'],
            'shortDescription' => Locale::cardExcerpt($resolved),
            'description' => $resolved['description'],
            'coverImage' => $item->cover_image,
            'gallery' => $item->gallery ?? [],
            'fundingGoal' => $item->funding_goal,
            'fundingRaised' => $item->funding_raised,
            'featured' => $item->featured,
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'path' => '/support/projects/'.$item->slug,
            'translations' => $item->translations ?? [],
        ];
    }
}
