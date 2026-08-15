<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PilgrimageService;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PilgrimageServiceController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = PilgrimageService::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (PilgrimageService $service) => $this->transform($service, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = PilgrimageService::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        $service = $query->firstOrFail();

        return response()->json($this->transform($service, $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = !empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        $service = PilgrimageService::create($data);

        return response()->json($this->transform($service, $locale), 201);
    }

    public function update(Request $request, PilgrimageService $pilgrimageService)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $pilgrimageService->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $pilgrimageService->update($data);

        return response()->json($this->transform($pilgrimageService->fresh(), $locale));
    }

    public function destroy(PilgrimageService $pilgrimageService)
    {
        $pilgrimageService->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:pilgrimage_services,slug,'.($ignoreId ?? 'NULL')],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'detail_image' => ['nullable', 'string', 'max:500'],
            'icon_key' => ['nullable', 'string', 'max:100'],
            'highlights' => ['nullable', 'array'],
            'highlights.*' => ['string'],
            'deliverables' => ['nullable', 'array'],
            'deliverables.*' => ['string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);

        if (! isset($data['highlights']) && isset($data['deliverables'])) {
            $data['highlights'] = $data['deliverables'];
        }
        unset($data['deliverables']);

        return $data;
    }

    private function transform(PilgrimageService $service, ?string $locale = null): array
    {
        $base = [
                'title' => $service->title,
                'description' => $service->description,
                'highlights' => $service->highlights ?? [],
            ];
        $resolved = Locale::resolve($base, $service->translations, ['title', 'description', 'highlights'], $locale);
        $highlights = $resolved['highlights'] ?? [];

        return [
            'id' => $service->id,
            'slug' => $service->slug,
            'title' => $resolved['title'],
            'description' => $resolved['description'],
            'image' => $service->image,
            'detailImage' => $service->detail_image,
            'iconKey' => $service->icon_key,
            'link' => '/pilgrimage/'.$service->slug,
            'highlights' => $highlights,
            'deliverables' => $highlights,
            'sortOrder' => $service->sort_order,
            'isPublished' => $service->is_published,
            'translations' => $service->translations ?? [],
        ];
    }
}
