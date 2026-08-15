<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use App\Models\UpcomingPilgrimage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class UpcomingPilgrimageSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'slug' => 'feast-of-the-assumption',
                'title' => 'Feast of the Assumption',
                'meta' => '15 August',
                'short_description' => 'A major Marian gathering of prayer and thanksgiving at the shrine.',
                'description' => '<p>Join pilgrims from across Rwanda and beyond for the Feast of the Assumption at the Shrine of Our Lady of Kibeho — a day of Mass, procession, confession, and thanksgiving.</p><p>Register your group or individual pilgrimage so the pilgrim office can welcome you and share the feast-day schedule.</p>',
                'image' => '/images/sanctuary/hero.jpg',
                'archives' => [
                    [
                        'type' => 'gallery',
                        'year' => 2025,
                        'caption' => 'Pilgrims gathered for the Assumption at Kibeho.',
                        'images' => [
                            '/images/sanctuary/hero.jpg',
                            '/images/sanctuary/church-wide.jpg',
                            '/images/sanctuary/welcome.jpg',
                        ],
                    ],
                    [
                        'type' => 'gallery',
                        'year' => 2024,
                        'caption' => 'Mass, procession, and thanksgiving on 15 August.',
                        'images' => [
                            '/images/sanctuary/mary.jpg',
                            '/images/sanctuary/hills.jpg',
                            '/images/sanctuary/crest.jpg',
                        ],
                    ],
                ],
                'location' => 'Kibeho Sanctuary',
                'starts_on' => '2026-08-15',
                'ends_on' => '2026-08-15',
                'starts_at_time' => '06:00',
                'ends_at_time' => '18:00',
                'is_recurring' => true,
                'recurrence_type' => 'annual',
                'sort_order' => 1,
            ],
            [
                'slug' => 'marian-youth-pilgrimage',
                'title' => 'Marian Youth Pilgrimage',
                'meta' => 'Youth',
                'short_description' => 'Young people journeying together in faith, song, and hope.',
                'description' => '<p>A pilgrimage designed for young Catholics — prayer, catechesis, fellowship, and Marian devotion at Kibeho.</p><p>Parish youth leaders are invited to register groups early for accommodation guidance and program details.</p>',
                'image' => '/images/sanctuary/welcome.jpg',
                'location' => 'Kibeho Sanctuary',
                'starts_on' => '2026-09-12',
                'ends_on' => '2026-09-14',
                'starts_at_time' => '08:00',
                'ends_at_time' => '17:00',
                'is_recurring' => false,
                'recurrence_type' => null,
                'sort_order' => 2,
            ],
            [
                'slug' => 'national-pilgrimage',
                'title' => 'National Pilgrimage',
                'meta' => 'National',
                'short_description' => 'The Church in Rwanda united in prayer at Kibeho.',
                'description' => '<p>Dioceses and movements from across Rwanda gather at Kibeho for a national pilgrimage of prayer, reconciliation, and hope.</p>',
                'image' => '/images/sanctuary/mary.jpg',
                'location' => 'Kibeho Sanctuary',
                'starts_on' => '2026-10-18',
                'ends_on' => '2026-10-19',
                'starts_at_time' => '07:00',
                'ends_at_time' => '16:00',
                'is_recurring' => false,
                'recurrence_type' => null,
                'sort_order' => 3,
            ],
            [
                'slug' => 'international-pilgrimage',
                'title' => 'International Pilgrimage',
                'meta' => 'Worldwide',
                'short_description' => 'Pilgrims from beyond Rwanda welcomed in one communion of faith.',
                'description' => '<p>International pilgrims are warmly welcomed at Kibeho. Register your group to receive guidance on liturgy, lodging, and pastoral accompaniment.</p>',
                'image' => '/images/sanctuary/hills.jpg',
                'location' => 'Kibeho Sanctuary',
                'starts_on' => '2026-11-21',
                'ends_on' => '2026-11-23',
                'starts_at_time' => '09:00',
                'ends_at_time' => '17:00',
                'is_recurring' => false,
                'recurrence_type' => null,
                'sort_order' => 4,
            ],
        ];

        foreach ($items as $item) {
            if (! Schema::hasColumn('upcoming_pilgrimages', 'archives')) {
                unset($item['archives']);
            }
            UpcomingPilgrimage::updateOrCreate(
                ['slug' => $item['slug']],
                array_merge($item, [
                    'event_type' => str_contains($item['slug'], 'feast') ? 'feast' : 'pilgrimage',
                    'registration_open' => true,
                    'is_published' => true,
                ])
            );
        }

        if (Schema::hasColumn('testimonials', 'related_event_slug')) {
            Testimonial::query()
                ->whereIn('slug', ['grace-from-kibeho', 'family-pilgrimage'])
                ->update(['related_event_slug' => 'feast-of-the-assumption']);
        }
    }
}