<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visionary;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class VisionaryController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = Visionary::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (Visionary $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = Visionary::query()->where('slug', $slug);

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
            $data['sort_order'] = (int) Visionary::query()->max('sort_order') + 1;
        }
        $item = Visionary::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, Visionary $visionary)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $visionary->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $visionary->update($data);

        return response()->json($this->transform($visionary->fresh(), $locale));
    }

    public function destroy(Visionary $visionary)
    {
        $visionary->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:visionaries,slug,'.($ignoreId ?? 'NULL')],
            'name' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:500'],
            'period_label' => ['nullable', 'string', 'max:255'],
            'period_start' => ['nullable', 'string', 'max:100'],
            'period_end' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_approved' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(Visionary $item, ?string $locale = null): array
    {
        $resolved = Locale::resolve(
            [
                'name' => $item->name,
                'description' => $item->description,
                'period_label' => $item->period_label,
            ],
            $item->translations,
            ['name', 'description', 'period_label'],
            $locale
        );

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'name' => $resolved['name'],
            'title' => $resolved['name'],
            'photo' => $item->photo,
            'coverImage' => $item->photo,
            'periodLabel' => $resolved['period_label'],
            'periodStart' => $item->period_start,
            'periodEnd' => $item->period_end,
            'description' => $resolved['description'],
            'isApproved' => $item->is_approved,
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'path' => '/shrine/visionaries#'.$item->slug,
            'translations' => $item->translations ?? [],
        ];
    }
}
