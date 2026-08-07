<?php

namespace App\Support;

use App\Models\Setting;

class Locale
{
    public const CODES = ['rw', 'fr', 'en', 'de'];

    public static function default(): string
    {
        $i18n = Setting::query()->where('key', 'i18n')->value('value');
        if (is_string($i18n)) {
            $i18n = json_decode($i18n, true);
        }
        $code = is_array($i18n) ? ($i18n['defaultLocale'] ?? 'en') : 'en';

        return in_array($code, self::CODES, true) ? $code : 'en';
    }

    public static function normalize(?string $locale): string
    {
        $code = strtolower(trim((string) $locale));
        if (in_array($code, self::CODES, true)) {
            return $code;
        }

        return self::default();
    }

    public static function fromRequest($request): string
    {
        return self::normalize($request?->query('locale'));
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

    private static function filled(mixed $value): bool
    {
        return $value !== null && $value !== '';
    }
}
