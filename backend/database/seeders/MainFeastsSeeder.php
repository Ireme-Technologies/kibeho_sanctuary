<?php

namespace Database\Seeders;

use App\Models\UpcomingPilgrimage;
use Illuminate\Database\Seeder;

class MainFeastsSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->feasts() as $feast) {
            $existing = UpcomingPilgrimage::query()->where('slug', $feast['slug'])->first();

            if (! $existing) {
                UpcomingPilgrimage::query()->create(array_merge($this->base($feast), [
                    'slug' => $feast['slug'],
                    'description' => $feast['description'],
                    'short_description' => $feast['short_description'],
                    'archives' => [],
                ]));
                continue;
            }

            $payload = [];
            if ($this->isPlaceholder($existing->description)) {
                $payload['description'] = $feast['description'];
            }
            if ($this->isPlaceholderShort($existing->short_description, $existing->title, $existing->meta)) {
                $payload['short_description'] = $feast['short_description'];
            }
            if ($payload) {
                $existing->fill($payload)->save();
            }
        }
    }

    private function base(array $feast): array
    {
        return [
            'event_type' => 'feast',
            'title' => $feast['title'],
            'meta' => $feast['meta'],
            'location' => 'Kibeho Sanctuary',
            'starts_on' => $feast['starts_on'],
            'ends_on' => $feast['starts_on'],
            'is_recurring' => true,
            'recurrence_type' => 'annual',
            'sort_order' => $feast['sort_order'],
            'registration_open' => true,
            'is_published' => true,
        ];
    }

    private function isPlaceholder(?string $html): bool
    {
        $text = trim(preg_replace('/\s+/', ' ', strip_tags((string) $html)) ?? '');
        if ($text === '') {
            return true;
        }

        return str_contains($text, 'Register so the Pilgrimage Office can welcome you and share');
    }

    private function isPlaceholderShort(?string $short, ?string $title, ?string $meta): bool
    {
        $text = trim((string) $short);
        if ($text === '') {
            return true;
        }

        return $text === trim($title.' — '.$meta.'.');
    }

    private function feasts(): array
    {
        return [
            [
                'slug' => 'mother-of-god',
                'title' => 'Mother of God',
                'meta' => '1 January',
                'starts_on' => '2026-01-01',
                'sort_order' => 11,
                'short_description' => 'The year opens at Kibeho with Mary, Mother of God — Mother of the Word.',
                'description' => '<p>On 1 January the Shrine keeps the Solemnity of Mary, Mother of God. At Kibeho she made herself known as <em>Nyina wa Jambo</em>, the Mother of the Word.</p><p>Pilgrims are welcome for the feast. Register your group so the Pilgrimage Office can prepare for you.</p>',
            ],
            [
                'slug' => 'apparition-nathalie-mukamazimpaka',
                'title' => 'Apparition to Nathalie Mukamazimpaka',
                'meta' => '12 January',
                'starts_on' => '2026-01-12',
                'sort_order' => 12,
                'short_description' => 'The shrine remembers the apparitions to Nathalie Mukamazimpaka, which began on 12 January 1982.',
                'description' => '<p>On 12 January 1982 the Blessed Virgin Mary appeared to Nathalie Mukamazimpaka, a student at Kibeho, in the dormitory. Her apparitions continued until 3 December 1983.</p><p>Through Nathalie, Our Lady called the Church to prayer, to penance, and to offering suffering for the conversion of sinners. Each year the shrine keeps this day in her memory.</p>',
            ],
            [
                'slug' => 'apparition-marie-claire-mukangango',
                'title' => 'Apparition to Marie Claire Mukangango',
                'meta' => '2 March',
                'starts_on' => '2026-03-02',
                'sort_order' => 13,
                'short_description' => 'The shrine remembers the apparitions to Marie Claire Mukangango, which began on 2 March 1982, and the Rosary of the Seven Sorrows.',
                'description' => '<p>On 2 March 1982 the Blessed Virgin Mary appeared to Marie Claire Mukangango. Her apparitions continued until 15 September 1982.</p><p>Our Lady asked that the Rosary of the Seven Sorrows be prayed. The shrine keeps 2 March as the day those apparitions began, and the devotion is still prayed on the hill.</p>',
            ],
            [
                'slug' => 'annunciation',
                'title' => 'Annunciation',
                'meta' => '25 March',
                'starts_on' => '2026-03-25',
                'sort_order' => 14,
                'short_description' => 'The Annunciation is kept at Kibeho as Mary’s yes to become the Mother of the Word.',
                'description' => '<p>On 25 March the Church celebrates the Annunciation, when Mary accepted to become the Mother of the Word. That is the name she gave at Kibeho: <em>Nyina wa Jambo</em>.</p><p>Pilgrims are welcome for the feast. Register so the Pilgrimage Office knows you are coming.</p>',
            ],
            [
                'slug' => 'inauguration-of-kibeho-shrine',
                'title' => 'Inauguration of Kibeho Shrine, Lady of Sorrows',
                'meta' => '31 May',
                'starts_on' => '2026-05-31',
                'sort_order' => 15,
                'short_description' => 'The shrine marks the inauguration of the Shrine of Our Lady of Sorrows on 31 May.',
                'description' => '<p>On 31 May the Shrine of Our Lady of Kibeho keeps the inauguration of the shrine under the title of Our Lady of Sorrows.</p><p>Pilgrims gather for the feast-day prayer. Register your group with the Pilgrimage Office.</p>',
            ],
            [
                'slug' => 'recognition-of-the-kibeho-apparitions',
                'title' => 'Official declaration of the recognition of the Kibeho apparitions',
                'meta' => '29 June',
                'starts_on' => '2026-06-29',
                'sort_order' => 16,
                'short_description' => 'The Church’s recognition of the Kibeho apparitions, declared on 29 June 2001.',
                'description' => '<p>On 29 June 2001 Bishop Augustin Misago of Gikongoro declared the authenticity of the apparitions of Our Lady at Kibeho to Alphonsine Mumureke, Nathalie Mukamazimpaka, and Marie Claire Mukangango.</p><p>The shrine keeps this day as the official recognition of the apparitions. Register if you will be at Kibeho for the celebration.</p>',
            ],
            [
                'slug' => 'feast-of-the-assumption',
                'title' => 'Assumption (Universal pilgrimage)',
                'meta' => '15 August',
                'starts_on' => '2026-08-15',
                'sort_order' => 17,
                'short_description' => 'Pilgrims from Rwanda and beyond gather on 15 August for the Assumption, a universal pilgrimage at Kibeho.',
                'description' => '<p>Each year on 15 August, pilgrims from Rwanda and beyond gather at the Shrine of Our Lady of Kibeho for the Feast of the Assumption. It is kept as a universal pilgrimage.</p><p>The day is marked by Holy Mass, procession, confession, and thanksgiving. Register your group so the Pilgrimage Office can welcome you and share the feast-day schedule.</p>',
            ],
            [
                'slug' => 'our-lady-of-sorrows',
                'title' => 'Our Lady of Sorrows',
                'meta' => '15 September',
                'starts_on' => '2026-09-15',
                'sort_order' => 18,
                'short_description' => 'Our Lady of Sorrows, the title of the shrine, is kept on 15 September.',
                'description' => '<p>On 15 September the Church celebrates Our Lady of Sorrows, the title of the Shrine of Kibeho. Marie Claire Mukangango’s recognised apparitions also closed on 15 September 1982.</p><p>The day belongs to the sorrowful Mother and to the Rosary of the Seven Sorrows prayed at the shrine. Register so the Pilgrimage Office can welcome your group.</p>',
            ],
            [
                'slug' => 'our-lady-of-the-rosary',
                'title' => 'Our Lady of the Rosary',
                'meta' => '7 October',
                'starts_on' => '2026-10-07',
                'sort_order' => 19,
                'short_description' => 'Our Lady of the Rosary is kept at Kibeho on 7 October, in the prayer she asked for on this hill.',
                'description' => '<p>On 7 October the shrine celebrates Our Lady of the Rosary. At Kibeho, Our Lady asked the faithful to pray the Rosary, and especially the Rosary of the Seven Sorrows.</p><p>Register if you will join the feast, so the Pilgrimage Office can prepare for your group.</p>',
            ],
            [
                'slug' => 'our-lady-of-kibeho',
                'title' => 'Our Lady of Kibeho (Universal pilgrimage)',
                'meta' => '28 November',
                'starts_on' => '2026-11-28',
                'sort_order' => 20,
                'short_description' => 'Our Lady of Kibeho is kept on 28 November, the day she first appeared to Alphonsine Mumureke in 1981.',
                'description' => '<p>On 28 November 1981 the Virgin Mary first appeared to Alphonsine Mumureke in the dining hall of the school at Kibeho. She presented herself as <em>Nyina wa Jambo</em> — the Mother of the Word. Alphonsine’s apparitions continued until 28 November 1989.</p><p>The shrine keeps 28 November as the feast of Our Lady of Kibeho and as a universal pilgrimage. Register your group so the Pilgrimage Office can welcome you.</p>',
            ],
        ];
    }
}
