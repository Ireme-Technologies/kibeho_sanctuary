<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OfficialPrayer;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OfficialPrayerController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = OfficialPrayer::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (OfficialPrayer $item) => $this->transform($item, $locale))
        );
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        if (! isset($data['sort_order'])) {
            $data['sort_order'] = (int) OfficialPrayer::query()->max('sort_order') + 1;
        }
        $item = OfficialPrayer::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, OfficialPrayer $officialPrayer)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $officialPrayer->id);
        $officialPrayer->update($data);

        return response()->json($this->transform($officialPrayer->fresh(), $locale));
    }

    public function destroy(OfficialPrayer $officialPrayer)
    {
        $officialPrayer->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'time_label' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(OfficialPrayer $item, ?string $locale = null): array
    {
        $resolved = Locale::resolve(
            [
                'title' => $item->title,
                'time_label' => $item->time_label,
                'description' => $item->description,
            ],
            $item->translations,
            ['title', 'time_label', 'description'],
            $locale
        );

        return [
            'id' => $item->id,
            'title' => $resolved['title'],
            'timeLabel' => $resolved['time_label'],
            'description' => $resolved['description'],
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'translations' => $item->translations ?? [],
        ];
    }
}
