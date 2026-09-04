<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TravelRoute;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TravelRouteController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = TravelRoute::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (TravelRoute $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, TravelRoute $travelRoute)
    {
        $locale = Locale::fromRequest($request);

        if (! Auth::guard('web')->user() && ! $travelRoute->is_published) {
            abort(404);
        }

        return response()->json($this->transform($travelRoute, $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        if (! isset($data['sort_order'])) {
            $data['sort_order'] = (int) TravelRoute::query()->max('sort_order') + 1;
        }
        $item = TravelRoute::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, TravelRoute $travelRoute)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $travelRoute->update($data);

        return response()->json($this->transform($travelRoute->fresh(), $locale));
    }

    public function destroy(TravelRoute $travelRoute)
    {
        $travelRoute->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'origin' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(TravelRoute $item, ?string $locale = null): array
    {
        $resolved = Locale::resolve(
            [
                'origin' => $item->origin,
                'title' => $item->title,
                'description' => $item->description,
            ],
            $item->translations,
            ['origin', 'title', 'description'],
            $locale
        );

        return [
            'id' => $item->id,
            'origin' => $resolved['origin'],
            'title' => $resolved['title'],
            'description' => $resolved['description'],
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'translations' => $item->translations ?? [],
        ];
    }
}
