<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MassSchedule;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class MassScheduleController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = MassSchedule::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (MassSchedule $item) => $this->transform($item, $locale))
        );
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $item = MassSchedule::create($this->validated($request));

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, MassSchedule $massSchedule)
    {
        $locale = Locale::fromRequest($request);
        $massSchedule->update($this->validated($request));

        return response()->json($this->transform($massSchedule->fresh(), $locale));
    }

    public function destroy(MassSchedule $massSchedule)
    {
        $massSchedule->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'day_label' => ['required', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:255'],
            'time_label' => ['nullable', 'string', 'max:100'],
            'starts_at_time' => ['nullable', 'date_format:H:i'],
            'ends_at_time' => ['nullable', 'date_format:H:i'],
            'is_recurring' => ['boolean'],
            'recurrence_type' => ['nullable', 'string', Rule::in(['weekly', 'monthly', 'annual'])],
            'language' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);

        return $this->withRecurrence($data);
    }

    private function withRecurrence(array $data): array
    {
        $type = $data['recurrence_type'] ?? null;
        if ($type === '') {
            $type = null;
        }
        $data['recurrence_type'] = $type;
        $data['is_recurring'] = ! empty($type);

        // Keep a readable time_label for older displays / exports.
        $start = isset($data['starts_at_time']) ? substr((string) $data['starts_at_time'], 0, 5) : null;
        $end = isset($data['ends_at_time']) ? substr((string) $data['ends_at_time'], 0, 5) : null;
        if ($start || $end) {
            $data['time_label'] = trim(($start ?: '').($start && $end ? ' – ' : '').($end ?: ''));
        }

        return $data;
    }

    private function transform(MassSchedule $item, ?string $locale = null): array
    {
        $base = [
                'day_label' => $item->day_label,
                'title' => $item->title,
                'notes' => $item->notes,
            ];
        $resolved = Locale::resolve($base, $item->translations, ['day_label', 'title', 'notes'], $locale);

        return [
            'id' => $item->id,
            'dayLabel' => $resolved['day_label'],
            'title' => $resolved['title'],
            'timeLabel' => $item->time_label,
            'startsAtTime' => $item->starts_at_time ? substr((string) $item->starts_at_time, 0, 5) : null,
            'endsAtTime' => $item->ends_at_time ? substr((string) $item->ends_at_time, 0, 5) : null,
            'isRecurring' => (bool) $item->is_recurring,
            'recurrenceType' => $item->recurrence_type,
            'language' => $item->language,
            'location' => $item->location,
            'notes' => $resolved['notes'],
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'translations' => $item->translations ?? [],
        ];
    }
}
