<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Facades\Auth;

class Locale
{
    /** Seed / fallback workspace when settings have no language list yet. */
    public const CODES = ['rw', 'fr', 'en', 'de'];

    public const CODE_PATTERN = '/^[a-z]{2}(?:-[a-z]{2})?$/';

    /**
     * Metadata for known languages (label, native name, flag).
     * Additional languages can still be stored if the admin sends valid metadata.
     *
     * @var array<string, array{label: string, nativeLabel: string, flag: string, htmlLang: string}>
     */
    public const CATALOG = [
        'rw' => ['label' => 'Kinyarwanda', 'nativeLabel' => 'Ikinyarwanda', 'flag' => '🇷🇼', 'htmlLang' => 'rw'],
        'fr' => ['label' => 'Français', 'nativeLabel' => 'Français', 'flag' => '🇫🇷', 'htmlLang' => 'fr'],
        'en' => ['label' => 'English', 'nativeLabel' => 'English', 'flag' => '🇬🇧', 'htmlLang' => 'en'],
        'de' => ['label' => 'Deutsch', 'nativeLabel' => 'Deutsch', 'flag' => '🇩🇪', 'htmlLang' => 'de'],
        'sw' => ['label' => 'Swahili', 'nativeLabel' => 'Kiswahili', 'flag' => '🇹🇿', 'htmlLang' => 'sw'],
        'rn' => ['label' => 'Kirundi', 'nativeLabel' => 'Ikirundi', 'flag' => '🇧🇮', 'htmlLang' => 'rn'],
        'lg' => ['label' => 'Luganda', 'nativeLabel' => 'Luganda', 'flag' => '🇺🇬', 'htmlLang' => 'lg'],
        'es' => ['label' => 'Spanish', 'nativeLabel' => 'Español', 'flag' => '🇪🇸', 'htmlLang' => 'es'],
        'it' => ['label' => 'Italian', 'nativeLabel' => 'Italiano', 'flag' => '🇮🇹', 'htmlLang' => 'it'],
        'pt' => ['label' => 'Portuguese', 'nativeLabel' => 'Português', 'flag' => '🇵🇹', 'htmlLang' => 'pt'],
        'nl' => ['label' => 'Dutch', 'nativeLabel' => 'Nederlands', 'flag' => '🇳🇱', 'htmlLang' => 'nl'],
        'pl' => ['label' => 'Polish', 'nativeLabel' => 'Polski', 'flag' => '🇵🇱', 'htmlLang' => 'pl'],
        'ko' => ['label' => 'Korean', 'nativeLabel' => '한국어', 'flag' => '🇰🇷', 'htmlLang' => 'ko'],
        'zh' => ['label' => 'Chinese', 'nativeLabel' => '中文', 'flag' => '🇨🇳', 'htmlLang' => 'zh'],
        'ar' => ['label' => 'Arabic', 'nativeLabel' => 'العربية', 'flag' => '🇸🇦', 'htmlLang' => 'ar'],
        'cs' => ['label' => 'Czech', 'nativeLabel' => 'Čeština', 'flag' => '🇨🇿', 'htmlLang' => 'cs'],
        'sk' => ['label' => 'Slovak', 'nativeLabel' => 'Slovenčina', 'flag' => '🇸🇰', 'htmlLang' => 'sk'],
        'hu' => ['label' => 'Hungarian', 'nativeLabel' => 'Magyar', 'flag' => '🇭🇺', 'htmlLang' => 'hu'],
        'uk' => ['label' => 'Ukrainian', 'nativeLabel' => 'Українська', 'flag' => '🇺🇦', 'htmlLang' => 'uk'],
        'vi' => ['label' => 'Vietnamese', 'nativeLabel' => 'Tiếng Việt', 'flag' => '🇻🇳', 'htmlLang' => 'vi'],
        'tl' => ['label' => 'Filipino', 'nativeLabel' => 'Filipino', 'flag' => '🇵🇭', 'htmlLang' => 'tl'],
        'ja' => ['label' => 'Japanese', 'nativeLabel' => '日本語', 'flag' => '🇯🇵', 'htmlLang' => 'ja'],
        'hi' => ['label' => 'Hindi', 'nativeLabel' => 'हिन्दी', 'flag' => '🇮🇳', 'htmlLang' => 'hi'],
        'am' => ['label' => 'Amharic', 'nativeLabel' => 'አማርኛ', 'flag' => '🇪🇹', 'htmlLang' => 'am'],
        'la' => ['label' => 'Latin', 'nativeLabel' => 'Latina', 'flag' => '🇻🇦', 'htmlLang' => 'la'],
    ];

    /** @var array<string, mixed>|null */
    private static ?array $pack = null;

    public static function forgetCache(): void
    {
        self::$pack = null;
    }

    /**
     * Normalised i18n settings: default, workspace languages, public languages, strings.
     *
     * @return array{
     *   defaultLocale: string,
     *   enabledLocales: array<int, string>,
     *   publicLocales: array<int, string>,
     *   languages: array<int, array<string, mixed>>,
     *   strings: array<string, mixed>
     * }
     */
    public static function pack(?array $raw = null): array
    {
        $useCache = $raw === null;
        if ($useCache && self::$pack !== null) {
            return self::$pack;
        }

        if ($raw === null) {
            $stored = Setting::query()->where('key', 'i18n')->value('value');
            if (is_string($stored)) {
                $stored = json_decode($stored, true);
            }
            $raw = is_array($stored) ? $stored : [];
        }

        $strings = is_array($raw['strings'] ?? null) ? $raw['strings'] : [];
        $strings = self::mergeSeededStrings($strings);
        $default = self::sanitizeCode($raw['defaultLocale'] ?? 'en') ?: 'en';

        $languages = self::hydrateLanguages($raw, $default);
        $codes = array_values(array_map(fn ($lang) => $lang['code'], $languages));
        if (! in_array($default, $codes, true)) {
            $languages[] = self::languageFromCode($default, true);
            $codes[] = $default;
        }

        foreach ($languages as &$lang) {
            if ($lang['code'] === $default) {
                $lang['public'] = true;
            }
        }
        unset($lang);

        $public = array_values(array_map(
            fn ($lang) => $lang['code'],
            array_filter($languages, fn ($lang) => ! empty($lang['public']))
        ));
        if (! in_array($default, $public, true)) {
            $public[] = $default;
        }

        $pack = [
            'defaultLocale' => $default,
            'enabledLocales' => $codes,
            'publicLocales' => array_values(array_unique($public)),
            'languages' => array_values($languages),
            'strings' => $strings,
        ];

        if ($useCache) {
            self::$pack = $pack;
        }

        return $pack;
    }

    public static function default(): string
    {
        return self::pack()['defaultLocale'];
    }

    /**
     * All languages added in CMS (including drafts).
     *
     * @return array<int, string>
     */
    public static function codes(): array
    {
        $codes = self::pack()['enabledLocales'];

        return $codes ?: self::CODES;
    }

    /**
     * Languages shown on the public site.
     *
     * @return array<int, string>
     */
    public static function publicCodes(): array
    {
        $codes = self::pack()['publicLocales'];

        return $codes ?: [self::default()];
    }

    public static function isValidCode(?string $locale): bool
    {
        $code = strtolower(trim((string) $locale));

        return (bool) preg_match(self::CODE_PATTERN, $code);
    }

    public static function sanitizeCode(?string $locale): ?string
    {
        $code = strtolower(trim((string) $locale));

        return self::isValidCode($code) ? $code : null;
    }

    public static function normalize(?string $locale): string
    {
        $code = self::sanitizeCode($locale);
        if ($code && in_array($code, self::codes(), true)) {
            return $code;
        }

        return self::default();
    }

    /**
     * Resolve the request locale. Guests only receive public languages;
     * signed-in staff may preview a draft via ?locale=.
     */
    public static function fromRequest($request): string
    {
        $code = self::sanitizeCode($request?->query('locale'));
        if (! $code || ! in_array($code, self::codes(), true)) {
            return self::default();
        }
        if (in_array($code, self::publicCodes(), true)) {
            return $code;
        }
        if (Auth::guard('web')->check()) {
            return $code;
        }

        return self::default();
    }

    /**
     * Catalog entries not yet in the workspace, for the admin “Add language” list.
     *
     * @return array<int, array<string, string>>
     */
    public static function addableCatalog(?array $used = null): array
    {
        $used = $used ?? self::codes();
        $out = [];
        foreach (self::CATALOG as $code => $meta) {
            if (in_array($code, $used, true)) {
                continue;
            }
            $out[] = array_merge(['code' => $code], $meta);
        }

        return $out;
    }

    /**
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>|null
     */
    public static function sanitizeLanguage(array $row, bool $publicDefault = false): ?array
    {
        $code = self::sanitizeCode($row['code'] ?? null);
        if (! $code) {
            return null;
        }
        $catalog = self::CATALOG[$code] ?? [];

        $label = trim((string) ($row['label'] ?? ''));
        $native = trim((string) ($row['nativeLabel'] ?? ''));
        $flag = trim((string) ($row['flag'] ?? ''));
        $htmlLang = trim((string) ($row['htmlLang'] ?? ''));

        return [
            'code' => $code,
            'label' => $label !== '' ? $label : ($catalog['label'] ?? strtoupper($code)),
            'nativeLabel' => $native !== '' ? $native : ($catalog['nativeLabel'] ?? ($label !== '' ? $label : strtoupper($code))),
            'flag' => $flag !== '' ? $flag : ($catalog['flag'] ?? '🌐'),
            'htmlLang' => $htmlLang !== '' ? $htmlLang : ($catalog['htmlLang'] ?? $code),
            'public' => array_key_exists('public', $row) ? (bool) $row['public'] : $publicDefault,
        ];
    }

    /**
     * Resolve locale-aware fields from base columns + translations JSON.
     * Order: requested pack → base columns → default pack → en pack → base again.
     *
     * @param  array<string, mixed>  $base
     * @param  array<string, mixed>|null  $translations
     * @param  array<int, string>  $fields
     * @return array<string, mixed>
     */
    public static function resolve(
        array $base,
        ?array $translations,
        array $fields,
        ?string $locale = null
    ): array {
        $requested = self::normalize($locale);
        $default = self::default();
        $bag = is_array($translations) ? $translations : [];

        $resolved = [];
        foreach ($fields as $field) {
            $candidates = [];

            if (self::filled($bag[$requested][$field] ?? null)) {
                $candidates[] = $bag[$requested][$field];
            }
            if (self::filled($base[$field] ?? null)) {
                $candidates[] = $base[$field];
            }
            if ($default !== $requested && self::filled($bag[$default][$field] ?? null)) {
                $candidates[] = $bag[$default][$field];
            }
            if ($requested !== 'en' && $default !== 'en' && self::filled($bag['en'][$field] ?? null)) {
                $candidates[] = $bag['en'][$field];
            }

            $resolved[$field] = $candidates[0] ?? ($base[$field] ?? null);
        }

        return $resolved;
    }

    /**
     * @param  array<string, array<string, string>>  $strings
     * @return array<string, string>
     */
    public static function flattenStrings(array $strings, ?string $locale = null): array
    {
        $requested = self::normalize($locale);
        $default = self::default();
        $out = [];

        foreach ($strings as $key => $values) {
            if (! is_array($values)) {
                $out[$key] = (string) $values;
                continue;
            }
            $out[$key] = self::filled($values[$requested] ?? null)
                ? $values[$requested]
                : (self::filled($values[$default] ?? null)
                    ? $values[$default]
                    : (self::filled($values['en'] ?? null)
                        ? $values['en']
                        : (string) (reset($values) ?: $key)));
        }

        return $out;
    }

    public static function excerpt(?string $html, int $max = 160): string
    {
        $text = html_entity_decode(strip_tags((string) $html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = trim(preg_replace('/\s+/u', ' ', $text) ?? '');
        if ($text === '') {
            return '';
        }
        if (mb_strlen($text) <= $max) {
            return $text;
        }
        $cut = mb_substr($text, 0, $max);
        $trimmed = preg_replace('/\s+\S*$/u', '', $cut);
        if (! is_string($trimmed) || $trimmed === '') {
            $trimmed = $cut;
        }

        return rtrim($trimmed, '.,;: ').'…';
    }

    /**
     * Card/list summary: first characters of the description, with stored short text as fallback.
     *
     * @param  array<string, mixed>  $resolved
     */
    public static function cardExcerpt(array $resolved, int $max = 160): string
    {
        $fromDescription = self::excerpt($resolved['description'] ?? null, $max);
        if ($fromDescription !== '') {
            return $fromDescription;
        }

        return self::excerpt($resolved['short_description'] ?? null, $max);
    }

    /**
     * @param  array<string, mixed>  $raw
     * @return array<int, array<string, mixed>>
     */
    private static function hydrateLanguages(array $raw, string $default): array
    {
        $seen = [];
        $languages = [];

        if (is_array($raw['languages'] ?? null) && $raw['languages']) {
            foreach ($raw['languages'] as $row) {
                if (! is_array($row)) {
                    continue;
                }
                $lang = self::sanitizeLanguage($row);
                if (! $lang || isset($seen[$lang['code']])) {
                    continue;
                }
                $seen[$lang['code']] = true;
                $languages[] = $lang;
            }
        }

        if (! $languages) {
            $enabled = is_array($raw['enabledLocales'] ?? null) && $raw['enabledLocales']
                ? $raw['enabledLocales']
                : self::CODES;
            $publicHint = is_array($raw['publicLocales'] ?? null) ? $raw['publicLocales'] : $enabled;
            foreach ($enabled as $code) {
                $clean = self::sanitizeCode(is_string($code) ? $code : null);
                if (! $clean || isset($seen[$clean])) {
                    continue;
                }
                $seen[$clean] = true;
                $isPublic = in_array($clean, $publicHint, true) || $clean === $default;
                $languages[] = self::languageFromCode($clean, $isPublic);
            }
        }

        if (! $languages) {
            foreach (self::CODES as $code) {
                $languages[] = self::languageFromCode($code, true);
            }
        }

        return $languages;
    }

    /**
     * @return array<string, mixed>
     */
    private static function languageFromCode(string $code, bool $public): array
    {
        $catalog = self::CATALOG[$code] ?? [
            'label' => strtoupper($code),
            'nativeLabel' => strtoupper($code),
            'flag' => '🌐',
            'htmlLang' => $code,
        ];

        return array_merge(['code' => $code], $catalog, ['public' => $public]);
    }

    /**
     * Add newly seeded UI keys without overwriting staff translations.
     *
     * @param  array<string, mixed>  $strings
     * @return array<string, mixed>
     */
    private static function mergeSeededStrings(array $strings): array
    {
        if (! class_exists(\Database\Seeders\I18nSeederData::class)) {
            return $strings;
        }

        static $seed = null;
        if ($seed === null) {
            $payload = \Database\Seeders\I18nSeederData::payload();
            $seed = is_array($payload['strings'] ?? null) ? $payload['strings'] : [];
        }

        foreach ($seed as $key => $row) {
            if (! is_string($key) || ! is_array($row)) {
                continue;
            }
            if (! isset($strings[$key]) || ! is_array($strings[$key])) {
                $strings[$key] = $row;
            }
        }

        return $strings;
    }

    private static function filled(mixed $value): bool
    {
        return $value !== null && $value !== '';
    }
}
