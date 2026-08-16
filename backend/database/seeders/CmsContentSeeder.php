<?php

namespace Database\Seeders;

use App\Models\MassSchedule;
use App\Models\SacredPlace;
use App\Models\ShrineProject;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class CmsContentSeeder extends Seeder
{
    public function run(): void
    {
        MassSchedule::query()->delete();
        MassSchedule::insert([
            [
                'day_label' => 'Sunday',
                'title' => 'Holy Mass',
                'time_label' => '06:00 – 07:00',
                'starts_at_time' => '06:00',
                'ends_at_time' => '07:00',
                'is_recurring' => true,
                'recurrence_type' => 'weekly',
                'language' => 'Kinyarwanda',
                'location' => 'Main Shrine',
                'notes' => null,
                'sort_order' => 0,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_label' => 'Sunday',
                'title' => 'Holy Mass',
                'time_label' => '10:00 – 11:30',
                'starts_at_time' => '10:00',
                'ends_at_time' => '11:30',
                'is_recurring' => true,
                'recurrence_type' => 'weekly',
                'language' => 'Kinyarwanda',
                'location' => 'Main Shrine',
                'notes' => 'Principal Sunday Mass for pilgrims.',
                'sort_order' => 1,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_label' => 'Monday – Saturday',
                'title' => 'Morning Mass',
                'time_label' => '07:00 – 07:45',
                'starts_at_time' => '07:00',
                'ends_at_time' => '07:45',
                'is_recurring' => true,
                'recurrence_type' => 'weekly',
                'language' => 'Kinyarwanda',
                'location' => 'Shrine Chapel',
                'notes' => null,
                'sort_order' => 2,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'day_label' => 'Feast Days',
                'title' => 'Pilgrimage Mass',
                'time_label' => '09:00 – 11:00',
                'starts_at_time' => '09:00',
                'ends_at_time' => '11:00',
                'is_recurring' => true,
                'recurrence_type' => 'annual',
                'language' => 'Multi-language',
                'location' => 'Main Shrine',
                'notes' => 'Special schedule during major Marian feasts.',
                'sort_order' => 3,
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        Testimonial::query()->delete();
        Testimonial::create([
            'slug' => 'grace-from-kibeho',
            'author_name' => 'Marie Claire',
            'author_role' => 'Pilgrim',
            'author_location' => 'Kigali, Rwanda',
            'title' => 'A place of deep peace',
            'body' => '<p>Coming to Kibeho renewed my prayer life. The message of conversion and compassion is lived here with humility and joy.</p>',
            'rating' => 5,
            'featured' => true,
            'related_event_slug' => 'feast-of-the-assumption',
            'sort_order' => 1,
            'is_published' => true,
            'published_at' => now()->toDateString(),
        ]);
        Testimonial::create([
            'slug' => 'family-pilgrimage',
            'author_name' => 'Jean Baptiste',
            'author_role' => 'Parish group leader',
            'author_location' => 'Butare, Rwanda',
            'title' => 'Our parish found hope',
            'body' => '<p>Our parish pilgrimage was carefully welcomed. Confession, Mass, and quiet prayer at the apparition sites touched every heart.</p>',
            'rating' => 5,
            'featured' => true,
            'related_event_slug' => 'feast-of-the-assumption',
            'sort_order' => 2,
            'is_published' => true,
            'published_at' => now()->toDateString(),
        ]);

        ShrineProject::query()->delete();
        ShrineProject::create([
            'slug' => 'master-plan-phase-one',
            'title' => 'Shrine Master Plan — Phase One',
            'status' => 'In progress',
            'phase' => 'Phase 1',
            'short_description' => 'Infrastructure and hospitality improvements to welcome more pilgrims with dignity.',
            'description' => '<p>Phase One focuses on pilgrim pathways, sanitation, and essential hospitality spaces around the Shrine.</p>',
            'cover_image' => '',
            'gallery' => [],
            'funding_goal' => 'Seeking partners',
            'funding_raised' => null,
            'featured' => true,
            'sort_order' => 1,
            'is_published' => true,
        ]);
        ShrineProject::create([
            'slug' => 'pilgrim-welcome-centre',
            'title' => 'Pilgrim Welcome Centre',
            'status' => 'Planning',
            'phase' => 'Phase 2',
            'short_description' => 'A dedicated centre for orientation, information, and pastoral accompaniment.',
            'description' => '<p>The Welcome Centre will help pilgrims prepare spiritually and practically for their visit.</p>',
            'cover_image' => '',
            'gallery' => [],
            'funding_goal' => null,
            'funding_raised' => null,
            'featured' => false,
            'sort_order' => 2,
            'is_published' => true,
        ]);

        SacredPlace::query()->delete();
        $places = [
            [
                'slug' => 'our-lady-of-sorrows',
                'type' => 'church',
                'name' => 'Church of Our Lady of Sorrows',
                'short_description' => 'The church dedicated to the Mother of Sorrows at the Sanctuary.',
                'description' => '<p>The church of Our Lady of Sorrows is the principal place of liturgical celebration at the Sanctuary of Our Lady of Kibeho.</p>',
                'sort_order' => 1,
            ],
            [
                'slug' => 'chapel-of-the-apparitions',
                'type' => 'church',
                'name' => 'Chapel of the Apparitions',
                'short_description' => 'The former dormitory, transformed into the Chapel of the Apparitions.',
                'description' => '<p>From 28 November 1981 to May 1982 the apparitions took place in the dormitory, later transformed into the Chapel of the Apparitions.</p>',
                'sort_order' => 2,
            ],
            [
                'slug' => 'chapel-of-adoration',
                'type' => 'church',
                'name' => 'Chapel of Adoration of the Blessed Sacrament',
                'short_description' => 'A chapel for silent prayer before the Blessed Sacrament.',
                'description' => '<p>The chapel of adoration of the Holy Sacrament is a place of silent prayer for pilgrims and the local community.</p>',
                'sort_order' => 3,
            ],
            [
                'slug' => 'place-of-the-apparitions',
                'type' => 'apparition_site',
                'name' => 'The place of the apparitions',
                'short_description' => 'The site remembered for the apparitions of the Mother of the Word.',
                'description' => '<p>Pilgrims come here to pray and to remember the apparitions recognised by the Church in 2001.</p>',
                'sort_order' => 1,
            ],
            [
                'slug' => 'esplanade-of-the-apparitions',
                'type' => 'apparition_site',
                'name' => 'The esplanade of the apparitions',
                'short_description' => 'The open esplanade where public apparitions were held outdoors.',
                'description' => '<p>From 31 May 1982 many apparitions were held outside the dormitory; a long part of them took place at the podium from 15 August 1982.</p>',
                'sort_order' => 2,
            ],
            [
                'slug' => 'source-of-mary',
                'type' => 'apparition_site',
                'name' => 'The source of Mary',
                'short_description' => 'The Holy Spring — a sign of grace for pilgrims who come in faith.',
                'description' => '<p>Pilgrims come to the source of Mary in faith, a call to interior purification and trust.</p>',
                'sort_order' => 3,
            ],
        ];

        foreach ($places as $place) {
            SacredPlace::create(array_merge($place, [
                'cover_image' => '',
                'gallery' => [],
                'location' => 'Kibeho Sanctuary',
                'is_published' => true,
            ]));
        }
    }
}
