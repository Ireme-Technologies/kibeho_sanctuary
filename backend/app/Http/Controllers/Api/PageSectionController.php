<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use App\Support\Locale;
use Illuminate\Http\Request;

class PageSectionController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);

        $sections = PageSection::query()
            ->orderBy('key')
            ->get()
            ->mapWithKeys(fn (PageSection $section) => [
                $section->key => $this->transform($section, $locale),
            ]);

        return response()->json($sections);
    }

    public function show(Request $request, string $key)
    {
        $locale = Locale::fromRequest($request);
        $section = PageSection::query()->where('key', $key)->firstOrFail();

        return response()->json($this->transform($section, $locale));
    }

    public function update(Request $request, string $key)
    {
        $locale = Locale::fromRequest($request);
        $data = $request->validate([
            'label' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'array'],
            'translations' => ['nullable', 'array'],
        ]);

        $attrs = [
            'label' => $data['label'] ?? ucwords(str_replace(['.', '-', '_'], ' ', $key)),
            'content' => $data['content'],
        ];
        if (array_key_exists('translations', $data)) {
            $attrs['translations'] = $data['translations'];
        }

        $section = PageSection::updateOrCreate(['key' => $key], $attrs);

        return response()->json($this->transform($section->fresh(), $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $request->validate([
            'key' => ['required', 'string', 'max:255', 'unique:page_sections,key'],
            'label' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'array'],
            'translations' => ['nullable', 'array'],
        ]);

        $section = PageSection::create($data);

        return response()->json($this->transform($section, $locale), 201);
    }

    public function destroy(string $key)
    {
        PageSection::query()->where('key', $key)->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function transform(PageSection $section, ?string $locale = null): array
    {
        $base = ['label' => $section->label];
        $resolved = Locale::resolve($base, $section->translations, ['label'], $locale);

        return [
            'key' => $section->key,
            'label' => $resolved['label'],
            'content' => $this->resolveContent($section->content ?? [], $section->translations, $locale),
            'translations' => $section->translations ?? [],
        ];
    }

    /**
     * Merge locale-specific content overlay onto base content.
     *
     * @param  array<string, mixed>  $base
     * @param  array<string, mixed>|null  $translations
     * @return array<string, mixed>
     */
    private function resolveContent(array $base, ?array $translations, ?string $locale): array
    {
        $requested = Locale::normalize($locale);
        $default = Locale::default();
        $bag = is_array($translations) ? $translations : [];

        $overlay = null;
        foreach ([$requested, $default, 'en'] as $code) {
            $candidate = $bag[$code]['content'] ?? null;
            if (is_array($candidate) && $candidate !== []) {
                $overlay = $candidate;
                if ($code === $requested) {
                    break;
                }
            }
        }

        if (! is_array($overlay)) {
            return $base;
        }

        $merged = array_replace_recursive($base, $overlay);

        // List structures must replace, not merge by index, so a language can
        // have its own page layout (blocks / quick links) without leaking extras.
        foreach (['blocks', 'links'] as $listKey) {
            if (array_key_exists($listKey, $overlay) && is_array($overlay[$listKey])) {
                $merged[$listKey] = $overlay[$listKey];
            }
        }

        return $merged;
    }
}
