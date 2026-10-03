<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = Facility::query();

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        if ($request->boolean('featured')) {
            $query->where('featured', true);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($request->boolean('lodging')) {
            $query->whereIn('category', ['Hotel', 'Guest House', 'Apartment', 'Hospitality']);
            // Oldest first unless staff set a custom sort order.
            $query->orderBy('sort_order')->orderBy('id');
        } else {
            $query->orderBy('sort_order')->orderByDesc('id');
        }

        return response()->json(
            $query->get()->map(fn (Facility $facility) => $this->transform($facility, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = Facility::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        $facility = $query->firstOrFail();

        return response()->json($this->transform($facility, $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = ! empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        if (! isset($data['sort_order'])) {
            $lodging = ['Hotel', 'Guest House', 'Apartment', 'Hospitality'];
            $query = Facility::query();
            if (in_array($data['category'] ?? '', $lodging, true)) {
                $query->whereIn('category', $lodging);
            }
            $data['sort_order'] = (int) $query->max('sort_order') + 1;
        }
        $facility = Facility::create($data);

        return response()->json($this->transform($facility, $locale), 201);
    }

    public function update(Request $request, Facility $facility)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $facility->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $facility->update($data);

        return response()->json($this->transform($facility->fresh(), $locale));
    }

    public function destroy(Facility $facility)
    {
        $facility->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:facilities,slug,'.($ignoreId ?? 'NULL')],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'year' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
            'managed_by' => ['nullable', 'string', 'max:255'],
            'client' => ['nullable', 'string', 'max:255'],
            'capacity' => ['nullable', 'string', 'max:100'],
            'room_count' => ['nullable', 'integer', 'min:0', 'max:5000'],
            'distance_from_kibeho' => ['nullable', 'string', 'max:80'],
            'price_from' => ['nullable', 'integer', 'min:0'],
            'area' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:100'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'booking_url' => ['nullable', 'string', 'max:500'],
            'featured' => ['boolean'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'featured_image' => ['nullable', 'string', 'max:500'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:80'],
            'meeting_rooms' => ['nullable', 'array'],
            'meeting_rooms.*.name' => ['nullable', 'string', 'max:120'],
            'meeting_rooms.*.capacity' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'review_links' => ['nullable', 'array'],
            'review_links.*.platform' => ['nullable', 'string', 'max:40'],
            'review_links.*.label' => ['nullable', 'string', 'max:80'],
            'review_links.*.url' => ['nullable', 'string', 'max:500'],
            'related_programs' => ['nullable', 'array'],
            'related_programs.*' => ['string'],
            'services' => ['nullable', 'array'],
            'services.*' => ['string'],
            'specs' => ['nullable', 'array'],
            'website_url' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);

        if (! isset($data['managed_by']) && isset($data['client'])) {
            $data['managed_by'] = $data['client'];
        }
        if (! isset($data['capacity']) && isset($data['area'])) {
            $data['capacity'] = $data['area'];
        }
        if (! isset($data['related_programs']) && isset($data['services'])) {
            $data['related_programs'] = $data['services'];
        }
        unset($data['client'], $data['area'], $data['services']);

        if (array_key_exists('room_count', $data) && (int) $data['room_count'] === 0) {
            $data['room_count'] = null;
        }
        if (array_key_exists('price_from', $data) && (int) $data['price_from'] === 0) {
            $data['price_from'] = null;
        }
        if (array_key_exists('distance_from_kibeho', $data)) {
            $distance = trim((string) $data['distance_from_kibeho']);
            $data['distance_from_kibeho'] = $distance === '' ? null : $distance;
        }
        if (array_key_exists('meeting_rooms', $data)) {
            $data['meeting_rooms'] = $this->cleanMeetingRooms($data['meeting_rooms']);
        }
        if (array_key_exists('review_links', $data)) {
            $data['review_links'] = $this->cleanReviewLinks($data['review_links']);
        }

        return $data;
    }

    private function cleanMeetingRooms(array $rows): array
    {
        return collect($rows)
            ->map(function ($row) {
                $name = trim((string) ($row['name'] ?? ''));
                $capacity = isset($row['capacity']) && $row['capacity'] !== '' && $row['capacity'] !== null
                    ? (int) $row['capacity']
                    : null;
                if ($name === '' && ! $capacity) {
                    return null;
                }

                return [
                    'name' => $name,
                    'capacity' => $capacity ?: null,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    private function cleanReviewLinks(array $rows): array
    {
        return collect($rows)
            ->map(function ($row) {
                $url = trim((string) ($row['url'] ?? ''));
                if ($url === '') {
                    return null;
                }
                $platform = strtolower(trim((string) ($row['platform'] ?? 'other')));
                if (! in_array($platform, ['google', 'tripadvisor', 'other'], true)) {
                    $platform = 'other';
                }
                $label = trim((string) ($row['label'] ?? ''));

                return [
                    'platform' => $platform,
                    'label' => $label,
                    'url' => $url,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    private function transform(Facility $facility, ?string $locale = null): array
    {
        $base = [
                'title' => $facility->title,
                'short_description' => $facility->short_description,
                'description' => $facility->description,
                'category' => $facility->category,
                'location' => $facility->location,
                'managed_by' => $facility->managed_by,
                'status' => $facility->status,
            ];
        $resolved = Locale::resolve($base, $facility->translations, ['title', 'short_description', 'description', 'category', 'location', 'managed_by', 'status'], $locale);

        return [
            'id' => $facility->id,
            'slug' => $facility->slug,
            'title' => $resolved['title'],
            'category' => $resolved['category'],
            'year' => $facility->year,
            'location' => $resolved['location'],
            'managedBy' => $resolved['managed_by'],
            'client' => $resolved['managed_by'],
            'capacity' => $facility->capacity,
            'area' => $facility->capacity,
            'roomCount' => $facility->room_count,
            'distanceFromKibeho' => $facility->distance_from_kibeho,
            'priceFrom' => $facility->price_from,
            'status' => $resolved['status'],
            'rating' => $facility->rating,
            'bookingUrl' => $facility->booking_url,
            'featured' => $facility->featured,
            'shortDescription' => Locale::cardExcerpt($resolved),
            'description' => $resolved['description'],
            'coverImage' => $facility->cover_image,
            'featuredImage' => $facility->featured_image,
            'gallery' => $facility->gallery ?? [],
            'amenities' => $facility->amenities ?? [],
            'meetingRooms' => $facility->meeting_rooms ?? [],
            'reviewLinks' => $facility->review_links ?? [],
            'relatedPrograms' => $facility->related_programs ?? [],
            'services' => $facility->related_programs ?? [],
            'specs' => $facility->specs ?? [],
            'websiteUrl' => $facility->website_url,
            'phone' => $facility->phone,
            'whatsapp' => $facility->whatsapp,
            'email' => $facility->email,
            'sortOrder' => $facility->sort_order,
            'isPublished' => $facility->is_published,
            'path' => '/pilgrimage/accommodation/'.$facility->slug,
            'translations' => $facility->translations ?? [],
        ];
    }
}
