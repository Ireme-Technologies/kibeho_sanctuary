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
            'cover_image' => '/images/sanctuary/hills.jpg',
            'gallery' => ['/images/sanctuary/welcome.jpg', '/images/sanctuary/church-wide.jpg'],
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
            'cover_image' => '/images/sanctuary/welcome.jpg',
            'gallery' => [],
            'funding_goal' => null,
            'funding_raised' => null,
            'featured' => false,
            'sort_order' => 2,
            'is_published' => true,
        ]);

        SacredPlace::query()->delete();
        SacredPlace::create([
            'slug' => 'main-shrine-church',
            'type' => 'church',
            'name' => 'Main Shrine Church',
            'short_description' => 'The principal church of the Shrine of Our Lady of Kibeho.',
            'description' => '<p>The Main Shrine Church gathers pilgrims for Mass, adoration, and Marian celebrations throughout the year.</p>',
            'cover_image' => '/images/sanctuary/church.jpg',
            'gallery' => ['/images/sanctuary/church.jpg', '/images/sanctuary/church-wide.jpg'],
            'location' => 'Kibeho Sanctuary',
            'sort_order' => 1,
            'is_published' => true,
        ]);
        SacredPlace::create([
            'slug' => 'shrine-chapel',
            'type' => 'church',
            'name' => 'Shrine Chapel',
            'short_description' => 'A quieter chapel for weekday Mass and personal prayer.',
            'description' => '<p>The chapel supports daily liturgy and smaller pilgrim groups.</p>',
            'cover_image' => '/images/sanctuary/church-wide.jpg',
            'gallery' => ['/images/sanctuary/church-wide.jpg'],
            'location' => 'Kibeho Sanctuary',
            'sort_order' => 2,
            'is_published' => true,
        ]);
        SacredPlace::create([
            'slug' => 'apparition-hill',
            'type' => 'apparition_site',
            'name' => 'Apparition Hill',
            'short_description' => 'A sacred place of remembrance linked to the Marian apparitions.',
            'description' => '<p>Pilgrims come here to pray the Rosary, reflect on the message of Kibeho, and entrust their intentions to Our Lady.</p>',
            'cover_image' => '/images/sanctuary/hills.jpg',
            'gallery' => ['/images/sanctuary/hills.jpg', '/images/sanctuary/mary.jpg'],
            'location' => 'Kibeho',
            'sort_order' => 1,
            'is_published' => true,
        ]);
        SacredPlace::create([
            'slug' => 'outdoor-prayer-spaces',
            'type' => 'apparition_site',
            'name' => 'Outdoor Prayer Spaces',
            'short_description' => 'Open-air spaces for group prayer and quiet contemplation.',
            'description' => '<p>These outdoor areas welcome large pilgrim groups for processions, teaching, and communal prayer.</p>',
            'cover_image' => '/images/sanctuary/welcome.jpg',
            'gallery' => ['/images/sanctuary/welcome.jpg', '/images/sanctuary/activity-spring.jpg'],
            'location' => 'Kibeho Sanctuary grounds',
            'sort_order' => 2,
            'is_published' => true,
        ]);
    }
}
