<?php

namespace Database\Seeders;

use App\Models\Visionary;
use Illuminate\Database\Seeder;

class VisionarySeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/visionaries.json');
        if (! is_file($path)) {
            return;
        }

        $rows = json_decode(file_get_contents($path), true);
        if (! is_array($rows)) {
            return;
        }

        foreach ($rows as $row) {
            $slug = $row['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            Visionary::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $row['name'],
                    'photo' => $row['photo'] ?? null,
                    'period_label' => $row['period_label'] ?? null,
                    'period_start' => $row['period_start'] ?? null,
                    'period_end' => $row['period_end'] ?? null,
                    'summary' => $row['summary'] ?? null,
                    'description' => $row['description'] ?? null,
                    'sort_order' => (int) ($row['sort_order'] ?? 0),
                    'is_approved' => (bool) ($row['is_approved'] ?? true),
                    'is_published' => (bool) ($row['is_published'] ?? true),
                    'translations' => $row['translations'] ?? [],
                ]
            );
        }
    }
}
