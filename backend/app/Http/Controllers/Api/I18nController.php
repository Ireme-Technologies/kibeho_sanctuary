<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class I18nController extends Controller
{
    public function show(Request $request)
    {
        $i18n = Locale::pack();
        $locale = Locale::fromRequest($request);

        return response()->json($this->payload($i18n, $locale));
    }

    public function update(Request $request)
    {
        $codeRule = ['string', Rule::regex(Locale::CODE_PATTERN)];
        $data = $request->validate([
            'defaultLocale' => array_merge(['nullable'], $codeRule),
            'enabledLocales' => ['nullable', 'array'],
            'enabledLocales.*' => $codeRule,
            'publicLocales' => ['nullable', 'array'],
            'publicLocales.*' => $codeRule,
            'languages' => ['nullable', 'array'],
            'languages.*.code' => array_merge(['required'], $codeRule),
            'languages.*.label' => ['nullable', 'string', 'max:80'],
            'languages.*.nativeLabel' => ['nullable', 'string', 'max:80'],
            'languages.*.flag' => ['nullable', 'string', 'max:16'],
            'languages.*.htmlLang' => ['nullable', 'string', 'max:16'],
            'languages.*.public' => ['nullable', 'boolean'],
            'strings' => ['nullable', 'array'],
        ]);

        $current = Locale::pack($this->raw());

        if (array_key_exists('defaultLocale', $data) && $data['defaultLocale']) {
            $current['defaultLocale'] = Locale::sanitizeCode($data['defaultLocale']) ?: $current['defaultLocale'];
        }

        if (array_key_exists('languages', $data) && is_array($data['languages']) && $data['languages']) {
            $current['languages'] = $data['languages'];
        } elseif (array_key_exists('enabledLocales', $data) && is_array($data['enabledLocales']) && $data['enabledLocales']) {
            $current = $this->applyEnabledList($current, $data['enabledLocales'], $data['publicLocales'] ?? null);
        } elseif (array_key_exists('publicLocales', $data) && is_array($data['publicLocales'])) {
            $current['languages'] = array_map(function ($lang) use ($data, $current) {
                $code = $lang['code'];
                $lang['public'] = $code === $current['defaultLocale']
                    || in_array($code, $data['publicLocales'], true);

                return $lang;
            }, $current['languages']);
        }

        if (array_key_exists('strings', $data) && is_array($data['strings'])) {
            $current['strings'] = $data['strings'];
        }

        $current = Locale::pack($current);
        Locale::forgetCache();
        Setting::updateOrCreate(['key' => 'i18n'], ['value' => $current]);
        Locale::forgetCache();

        return $this->show($request);
    }

    /**
     * @param  array<string, mixed>  $i18n
     * @return array<string, mixed>
     */
    private function payload(array $i18n, string $locale): array
    {
        return [
            'defaultLocale' => $i18n['defaultLocale'],
            'enabledLocales' => $i18n['enabledLocales'],
            'publicLocales' => $i18n['publicLocales'],
            'languages' => $i18n['languages'],
            'catalog' => Locale::addableCatalog($i18n['enabledLocales']),
            'locale' => $locale,
            'strings' => Locale::flattenStrings($i18n['strings'], $locale),
            'dictionary' => $i18n['strings'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function raw(): array
    {
        $raw = Setting::query()->where('key', 'i18n')->value('value');
        if (is_string($raw)) {
            $raw = json_decode($raw, true);
        }

        return is_array($raw) ? $raw : [];
    }

    /**
     * Legacy clients send enabledLocales without a languages array.
     *
     * @param  array<string, mixed>  $current
     * @param  array<int, string>  $enabled
     * @param  array<int, string>|null  $public
     * @return array<string, mixed>
     */
    private function applyEnabledList(array $current, array $enabled, ?array $public): array
    {
        $byCode = [];
        foreach ($current['languages'] as $lang) {
            $byCode[$lang['code']] = $lang;
        }

        $next = [];
        foreach ($enabled as $code) {
            $clean = Locale::sanitizeCode(is_string($code) ? $code : null);
            if (! $clean) {
                continue;
            }
            if (isset($byCode[$clean])) {
                $lang = $byCode[$clean];
            } else {
                $lang = Locale::sanitizeLanguage(['code' => $clean], false);
            }
            if (! $lang) {
                continue;
            }
            if (is_array($public)) {
                $lang['public'] = $clean === $current['defaultLocale'] || in_array($clean, $public, true);
            }
            $next[] = $lang;
        }

        $current['languages'] = $next;

        return $current;
    }
}
