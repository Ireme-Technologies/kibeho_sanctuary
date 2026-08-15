<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = Activity::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (Activity $activity) => $this->transform($activity, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = Activity::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        $activity = $query->firstOrFail();

        return response()->json($this->transform($activity, $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = !empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        $activity = Activity::create($data);

        return response()->json($this->transform($activity, $locale), 201);
    }

    public function update(Request $request, Activity $activity)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $activity->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $activity->update($data);

        return response()->json($this->transform($activity->fresh(), $locale));
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:activities,slug,'.($ignoreId ?? 'NULL')],
            'title' => ['required', 'string', 'max:255'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer'],
            'show_in_menu' => ['boolean'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(Activity $activity, ?string $locale = null): array
    {
        $base = [
                'title' => $activity->title,
                'short_description' => $activity->short_description,
                'description' => $activity->description,
            ];
        $resolved = Locale::resolve($base, $activity->translations, ['title', 'short_description', 'description'], $locale);

        return [
            'id' => $activity->id,
            'slug' => $activity->slug,
            'title' => $resolved['title'],
            'shortDescription' => Locale::cardExcerpt($resolved),
            'description' => $resolved['description'],
            'image' => $activity->image,
            'path' => '/activities/'.$activity->slug,
            'sortOrder' => $activity->sort_order,
            'showInMenu' => $activity->show_in_menu,
            'isPublished' => $activity->is_published,
            'translations' => $activity->translations ?? [],
        ];
    }
}
