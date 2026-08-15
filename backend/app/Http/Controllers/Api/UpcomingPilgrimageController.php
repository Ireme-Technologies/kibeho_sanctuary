<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UpcomingPilgrimage;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpcomingPilgrimageController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = UpcomingPilgrimage::query()->orderBy('sort_order')->orderBy('starts_on')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        if ($type = $request->query('event_type')) {
            $query->where('event_type', $type);
        }

        return response()->json(
            $query->get()->map(fn (UpcomingPilgrimage $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = UpcomingPilgrimage::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        $item = $query->firstOrFail();

        return response()->json($this->transform($item, $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = ! empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        $item = UpcomingPilgrimage::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, UpcomingPilgrimage $upcomingPilgrimage)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $upcomingPilgrimage->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $upcomingPilgrimage->update($data);

        return response()->json($this->transform($upcomingPilgrimage->fresh(), $locale));
    }

    public function updateArchives(Request $request, UpcomingPilgrimage $upcomingPilgrimage)
    {
        $locale = Locale::fromRequest($request);

        if (! Schema::hasColumn('upcoming_pilgrimages', 'archives')) {
            return response()->json(['message' => 'Run database migrations to enable event updates.'], 503);
        }

        $this->coerceArchiveYears($request);
        $data = $request->validate([
            'archives' => ['nullable', 'array'],
            'archives.*.type' => ['nullable', 'string', Rule::in(['gallery', 'news'])],
            'archives.*.year' => ['nullable', 'integer', 'min:1900', 'max:2200'],
            'archives.*.caption' => ['nullable', 'string', 'max:500'],
            'archives.*.slug' => ['nullable', 'string', 'max:255'],
            'archives.*.images' => ['nullable', 'array'],
            'archives.*.images.*' => ['nullable', 'string', 'max:500'],
        ]);

        $upcomingPilgrimage->update([
            'archives' => $this->normalizeArchives($data['archives'] ?? []),
        ]);

        return response()->json($this->transform($upcomingPilgrimage->fresh(), $locale));
    }

    public function destroy(UpcomingPilgrimage $upcomingPilgrimage)
    {
        $upcomingPilgrimage->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function coerceArchiveYears(Request $request): void
    {
        $archives = $request->input('archives');
        if (! is_array($archives)) {
            return;
        }

        $request->merge([
            'archives' => array_map(function ($row) {
                if (! is_array($row)) {
                    return $row;
                }
                if (($row['year'] ?? null) === '') {
                    $row['year'] = null;
                }

                return $row;
            }, $archives),
        ]);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        if ($request->exists('archives')) {
            $this->coerceArchiveYears($request);
        }

        $data = $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:upcoming_pilgrimages,slug,'.($ignoreId ?? 'NULL')],
            'event_type' => ['nullable', 'string', 'max:50'],
            'title' => ['required', 'string', 'max:255'],
            'meta' => ['nullable', 'string', 'max:255'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'archives' => ['nullable', 'array'],
            'archives.*.type' => ['nullable', 'string', Rule::in(['gallery', 'news'])],
            'archives.*.year' => ['nullable', 'integer', 'min:1900', 'max:2200'],
            'archives.*.caption' => ['nullable', 'string', 'max:500'],
            'archives.*.slug' => ['nullable', 'string', 'max:255'],
            'archives.*.images' => ['nullable', 'array'],
            'archives.*.images.*' => ['nullable', 'string', 'max:500'],
            'location' => ['nullable', 'string', 'max:255'],
            'starts_on' => ['nullable', 'date'],
            'ends_on' => ['nullable', 'date', 'after_or_equal:starts_on'],
            'starts_at_time' => ['nullable', 'date_format:H:i'],
            'ends_at_time' => ['nullable', 'date_format:H:i'],
            'is_recurring' => ['boolean'],
            'recurrence_type' => ['nullable', 'string', Rule::in(['weekly', 'monthly', 'annual'])],
            'sort_order' => ['nullable', 'integer'],
            'registration_open' => ['boolean'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);

        $type = $data['recurrence_type'] ?? null;
        if ($type === '') {
            $type = null;
        }
        $data['recurrence_type'] = $type;
        $data['is_recurring'] = ! empty($type);

        if (! $request->exists('archives') || ! Schema::hasColumn('upcoming_pilgrimages', 'archives')) {
            unset($data['archives']);
        } else {
            $data['archives'] = $this->normalizeArchives($data['archives'] ?? []);
        }

        return $data;
    }

    private function normalizeArchives(array $rows): array
    {
        $out = [];
        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }
            $kind = ($row['type'] ?? 'gallery') === 'news' ? 'news' : 'gallery';
            $year = isset($row['year']) && $row['year'] !== '' && $row['year'] !== null
                ? (int) $row['year']
                : null;
            $caption = trim((string) ($row['caption'] ?? ''));

            if ($kind === 'news') {
                $slug = trim((string) ($row['slug'] ?? ''));
                if ($slug === '') {
                    continue;
                }
                $out[] = [
                    'type' => 'news',
                    'year' => $year,
                    'slug' => $slug,
                    'caption' => $caption,
                ];
                continue;
            }

            $images = array_values(array_filter(
                array_map(fn ($img) => is_string($img) ? $img : '', $row['images'] ?? [])
            ));
            if (! $images) {
                continue;
            }
            $out[] = [
                'type' => 'gallery',
                'year' => $year,
                'caption' => $caption,
                'images' => $images,
            ];
        }

        return $out;
    }

    private function transform(UpcomingPilgrimage $item, ?string $locale = null): array
    {
        $base = [
                'title' => $item->title,
                'meta' => $item->meta,
                'short_description' => $item->short_description,
                'description' => $item->description,
                'location' => $item->location,
            ];
        $resolved = Locale::resolve($base, $item->translations, ['title', 'meta', 'short_description', 'description', 'location'], $locale);

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'eventType' => $item->event_type ?: 'pilgrimage',
            'title' => $resolved['title'],
            'meta' => $resolved['meta'],
            'shortDescription' => Locale::cardExcerpt($resolved),
            'description' => $resolved['description'],
            'image' => $item->image,
            'archives' => Schema::hasColumn('upcoming_pilgrimages', 'archives')
                ? ($item->archives ?? [])
                : [],
            'location' => $resolved['location'],
            'startsOn' => optional($item->starts_on)->toDateString(),
            'endsOn' => optional($item->ends_on)->toDateString(),
            'startsAtTime' => $item->starts_at_time ? substr((string) $item->starts_at_time, 0, 5) : null,
            'endsAtTime' => $item->ends_at_time ? substr((string) $item->ends_at_time, 0, 5) : null,
            'isRecurring' => (bool) $item->is_recurring,
            'recurrenceType' => $item->recurrence_type,
            'path' => '/pilgrimages/'.$item->slug,
            'sortOrder' => $item->sort_order,
            'registrationOpen' => $item->registration_open,
            'isPublished' => $item->is_published,
            'translations' => $item->translations ?? [],
        ];
    }
}
