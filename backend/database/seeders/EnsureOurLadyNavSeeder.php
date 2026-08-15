<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class EnsureOurLadyNavSeeder extends Seeder
{
    public function run(): void
    {
        $setting = Setting::query()->where('key', 'navigation')->first();
        if (! $setting) {
            return;
        }

        $nav = $setting->value;
        if (! is_array($nav) || ! isset($nav['primaryNav']) || ! is_array($nav['primaryNav'])) {
            return;
        }

        $extras = [
            ['label' => 'Pastoral Team', 'path' => '/our-lady/pastoral-team'],
            ['label' => 'Communities', 'path' => '/our-lady/communities'],
        ];

        $changed = false;
        foreach ($nav['primaryNav'] as &$item) {
            $path = rtrim((string) ($item['path'] ?? ''), '/') ?: '/';
            $label = strtolower((string) ($item['label'] ?? ''));
            $isOurLady = $path === '/' || $path === '/our-lady' || str_contains($label, 'our lady');
            if (! $isOurLady) {
                continue;
            }

            $children = is_array($item['children'] ?? null) ? $item['children'] : [];
            $missing = [];
            foreach ($extras as $extra) {
                $exists = false;
                foreach ($children as $child) {
                    $childPath = rtrim((string) ($child['path'] ?? ''), '/') ?: '/';
                    if ($childPath === $extra['path']) {
                        $exists = true;
                        break;
                    }
                }
                if (! $exists) {
                    $missing[] = $extra;
                }
            }
            if (! $missing) {
                continue;
            }

            $faqIndex = null;
            foreach ($children as $index => $child) {
                $childPath = rtrim((string) ($child['path'] ?? ''), '/') ?: '/';
                $childLabel = strtolower((string) ($child['label'] ?? ''));
                if ($childPath === '/our-lady/faq' || $childPath === '/faq' || $childLabel === 'faq') {
                    $faqIndex = $index;
                    break;
                }
            }

            $item['children'] = $faqIndex === null
                ? array_merge($children, $missing)
                : array_merge(array_slice($children, 0, $faqIndex), $missing, array_slice($children, $faqIndex));
            $changed = true;
        }
        unset($item);

        if ($changed) {
            $setting->value = $nav;
            $setting->save();
        }
    }
}
