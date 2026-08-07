<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\Locale;
use Illuminate\Http\Request;

class I18nController extends Controller
{
    public function show(Request $request)
    {
        $i18n = $this->i18n();
        $locale = Locale::normalize($request->query('locale'));

        return response()->json([
            'defaultLocale' => $i18n['defaultLocale'],
            'enabledLocales' => $i18n['enabledLocales'],
            'locale' => $locale,
            'strings' => Locale::flattenStrings($i18n['strings'], $locale),
            'dictionary' => $i18n['strings'],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'defaultLocale' => ['nullable', 'string', 'in:rw,fr,en,de'],
            'enabledLocales' => ['nullable', 'array'],
            'enabledLocales.*' => ['string', 'in:rw,fr,en,de'],
            'strings' => ['nullable', 'array'],
        ]);

        $current = $this->i18n();

        if (array_key_exists('defaultLocale', $data) && $data['defaultLocale']) {
            $current['defaultLocale'] = $data['defaultLocale'];
        }
        if (array_key_exists('enabledLocales', $data) && is_array($data['enabledLocales']) && $data['enabledLocales']) {
            $current['enabledLocales'] = array_values(array_unique($data['enabledLocales']));
        }
        if (array_key_exists('strings', $data) && is_array($data['strings'])) {
            $current['strings'] = $data['strings'];
        }

        Setting::updateOrCreate(['key' => 'i18n'], ['value' => $current]);

        return $this->show($request);
    }

    private function i18n(): array
    {
        $raw = Setting::query()->where('key', 'i18n')->value('value');
        if (is_string($raw)) {
            $raw = json_decode($raw, true);
        }
        if (! is_array($raw)) {
            $raw = [];
        }

        return [
            'defaultLocale' => Locale::normalize($raw['defaultLocale'] ?? 'en'),
            'enabledLocales' => array_values(array_filter(
                $raw['enabledLocales'] ?? Locale::CODES,
                fn ($code) => in_array($code, Locale::CODES, true)
            )) ?: Locale::CODES,
            'strings' => is_array($raw['strings'] ?? null) ? $raw['strings'] : [],
        ];
    }
}
