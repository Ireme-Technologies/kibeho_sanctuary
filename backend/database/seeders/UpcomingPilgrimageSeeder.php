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
                'short_description' => 'Mass, procession, confession, and thanksgiving on 15 August — a major Marian gathering at Kibeho.',
                'description' => '<p>Each year on 15 August, pilgrims from Rwanda and beyond gather at the Shrine of Our Lady of Kibeho for the Feast of the Assumption.</p><p>The day is marked by Holy Mass, procession, confession, and thanksgiving. Register your group or your own pilgrimage so the Pilgrimage Office can welcome you and share the feast-day schedule.</p>',
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
                'short_description' => 'Young people in prayer, catechesis, song, and Marian devotion at Kibeho.',
                'description' => '<p>The Marian Youth Pilgrimage gathers young Catholics for prayer, catechesis, fellowship, and devotion to Our Lady of Kibeho.</p><p>Parish youth leaders are invited to register groups early for programme details and guidance on accommodation.</p>',
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
                'short_description' => 'Dioceses and movements of Rwanda gathered in one prayer of reconciliation and hope.',
                'description' => '<p>The National Pilgrimage brings dioceses, parishes, and movements from across Rwanda to Kibeho for a common time of prayer, reconciliation, and hope.</p><p>Register your delegation with the Pilgrimage Office so liturgy and lodging can be prepared.</p>',
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
                'short_description' => 'Pilgrims from beyond Rwanda welcomed into the prayer of Kibeho.',
                'description' => '<p>International pilgrims are received at the Shrine as one family in faith. Register your group to receive guidance on liturgy, lodging, and pastoral accompaniment.</p><p>The Pilgrimage Office will help you prepare a reverent and fruitful stay.</p>',
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
            } else {
                $item['archives'] = [];
            }
            $payload = array_merge($item, [
                'event_type' => str_contains($item['slug'], 'feast') ? 'feast' : 'pilgrimage',
                'registration_open' => true,
                'is_published' => true,
                'image' => '',
            ]);
            if (Schema::hasColumn('upcoming_pilgrimages', 'archives')) {
                $payload['archives'] = [];
            } else {
                unset($payload['archives']);
            }
            UpcomingPilgrimage::updateOrCreate(
                ['slug' => $item['slug']],
                $payload
            );
        }

        if (Schema::hasColumn('testimonials', 'related_event_slug')) {
            Testimonial::query()
                ->whereIn('slug', ['grace-from-kibeho', 'family-pilgrimage'])
                ->update(['related_event_slug' => 'feast-of-the-assumption']);
        }
    }
}