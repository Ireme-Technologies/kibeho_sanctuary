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
            'short_description' => 'Pathways, sanitation, and hospitality so pilgrims can be received with dignity.',
            'description' => '<p>Phase One begins the Master Plan: the first works that let Kibeho welcome those who come to pray.</p>',
            'problem' => '<p>Unlike older pilgrimage sites, Kibeho is still being formed. On feast days, thousands arrive on paths and facilities that cannot yet receive them with the dignity the Mother of the Word deserves.</p>',
            'solution' => '<p>Phase One focuses on pilgrim pathways, sanitation, and essential hospitality spaces around the Shrine — the first stones of a lasting welcome.</p>',
            'impact_local' => '<p>Neighbours and Rwandan pilgrims gain safer paths, cleaner facilities, and work that serves the Sanctuary they already love.</p>',
            'impact_church' => '<p>Liturgy, confession, and pastoral care can unfold without the strain of crowding, so the Church in Kibeho can pray as a family.</p>',
            'impact_global' => '<p>Pilgrims from every nation can arrive and find a place prepared — a sign that Kibeho belongs to the whole Church.</p>',
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
            'short_description' => 'A house of orientation, information, and pastoral accompaniment at the gate of the Shrine.',
            'description' => '<p>A Welcome Centre where pilgrims can prepare spiritually and practically before they enter the holy ground.</p>',
            'problem' => '<p>Many arrive tired, unsure where to go, and without a quiet first word of welcome. Orientation is scattered; first-time pilgrims can miss the heart of the visit.</p>',
            'solution' => '<p>A dedicated centre for orientation, information, and pastoral accompaniment — a threshold between the road and the places of prayer.</p>',
            'impact_local' => '<p>Local teams can greet visitors with order and kindness, and young people of the region can serve as hosts.</p>',
            'impact_church' => '<p>Every pilgrim can be pointed toward Mass, confession, and the message of Our Lady before they walk the ways of the Shrine.</p>',
            'impact_global' => '<p>Guests from abroad receive a clear, peaceful beginning to their pilgrimage, in their own language where possible.</p>',
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
                'location' => 'Shrine of Our Lady of Kibeho',
                'is_published' => true,
            ]));
        }
    }
}
