<?php

namespace Database\Seeders;

use App\Models\UpcomingPilgrimage;
use Illuminate\Database\Seeder;

class MainFeastsSeeder extends Seeder
{
    public function run(): void
    {
        $feasts = [
            ['slug' => 'mother-of-god', 'title' => 'Mother of God', 'meta' => '1 January', 'starts_on' => '2026-01-01', 'sort_order' => 11],
            ['slug' => 'apparition-nathalie-mukamazimpaka', 'title' => 'Apparition to Nathalie Mukamazimpaka', 'meta' => '12 January', 'starts_on' => '2026-01-12', 'sort_order' => 12],
            ['slug' => 'apparition-marie-claire-mukangango', 'title' => 'Apparition to Marie Claire Mukangango', 'meta' => '2 March', 'starts_on' => '2026-03-02', 'sort_order' => 13],
            ['slug' => 'annunciation', 'title' => 'Annunciation', 'meta' => '25 March', 'starts_on' => '2026-03-25', 'sort_order' => 14],
            ['slug' => 'inauguration-of-kibeho-shrine', 'title' => 'Inauguration of Kibeho Shrine, Lady of Sorrows', 'meta' => '31 May', 'starts_on' => '2026-05-31', 'sort_order' => 15],
            ['slug' => 'recognition-of-the-kibeho-apparitions', 'title' => 'Official declaration of the recognition of the Kibeho apparitions', 'meta' => '29 June', 'starts_on' => '2026-06-29', 'sort_order' => 16],
            ['slug' => 'feast-of-the-assumption', 'title' => 'Assumption (Universal pilgrimage)', 'meta' => '15 August', 'starts_on' => '2026-08-15', 'sort_order' => 17],
            ['slug' => 'our-lady-of-sorrows', 'title' => 'Our Lady of Sorrows', 'meta' => '15 September', 'starts_on' => '2026-09-15', 'sort_order' => 18],
            ['slug' => 'our-lady-of-the-rosary', 'title' => 'Our Lady of the Rosary', 'meta' => '7 October', 'starts_on' => '2026-10-07', 'sort_order' => 19],
            ['slug' => 'our-lady-of-kibeho', 'title' => 'Our Lady of Kibeho (Universal pilgrimage)', 'meta' => '28 November', 'starts_on' => '2026-11-28', 'sort_order' => 20],
        ];

        foreach ($feasts as $feast) {
            $existing = UpcomingPilgrimage::query()->where('slug', $feast['slug'])->first();
            $description = '<p>'.$feast['title'].' is celebrated each year at the Shrine of Our Lady of Kibeho. Register so the Pilgrimage Office can welcome you and share the day’s programme.</p>';
            $payload = [
                'event_type' => 'feast',
                'title' => $feast['title'],
                'meta' => $feast['meta'],
                'short_description' => $feast['title'].' — '.$feast['meta'].'.',
                'location' => 'Kibeho Sanctuary',
                'starts_on' => $feast['starts_on'],
                'ends_on' => $feast['starts_on'],
                'starts_at_time' => '07:00',
                'ends_at_time' => '17:00',
                'is_recurring' => true,
                'recurrence_type' => 'annual',
                'sort_order' => $feast['sort_order'],
                'registration_open' => true,
                'is_published' => true,
            ];

            if ($existing) {
                if (! $existing->description) {
                    $payload['description'] = $description;
                }
                $existing->fill($payload)->save();
                continue;
            }

            UpcomingPilgrimage::query()->create(array_merge($payload, [
                'slug' => $feast['slug'],
                'description' => $description,
                'archives' => [],
            ]));
        }
    }
}
