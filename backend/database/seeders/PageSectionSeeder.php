<?php

namespace Database\Seeders;

use App\Models\PageSection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PageSectionSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            'headers.default' => [
                'label' => 'Default page header',
                'content' => [
                    'backgroundImage' => '/images/sanctuary/hero.jpg',
                ],
            ],
            'home.hero' => [
                'label' => 'Home Hero',
                'content' => [
                    'mode' => 'cover',
                    'heading' => 'Shrine of Our Lady of Kibeho',
                    'caption' => 'The first Marian apparition site in Africa recognised by the Catholic Church — a place of conversion, prayer, and reconciliation.',
                    'coverImage' => '',
                    'slides' => [],
                    'ctas' => [
                        'primary' => ['label' => 'Discover the Message', 'link' => '/our-lady'],
                        'secondary' => ['label' => 'Plan Your Pilgrimage', 'link' => '/pilgrimage/plan'],
                    ],
                ],
            ],
            'home.welcome' => [
                'label' => 'Home Welcome',
                'content' => [
                    'eyebrow' => 'Our Lady of Kibeho',
                    'heading' => 'Recognised. Welcoming. A place of conversion.',
                    'text' => 'The Shrine of Our Lady of Kibeho is the first — and to date the only — Marian apparition site in Africa officially recognised by the Catholic Church. Pilgrims from every nation are welcome.',
                    'image' => '',
                    'cta' => ['label' => 'Discover the Message', 'path' => '/our-lady'],
                ],
            ],
            'home.activities' => [
                'label' => 'Home — At the Shrine',
                'content' => [
                    'heading' => 'At the Shrine',
                    'subline' => 'Walk the churches, apparition sites, Holy Spring, and Way of the Cross — and join the daily prayer of Kibeho.',
                    'primaryCta' => ['label' => 'Explore the Shrine', 'path' => '/shrine'],
                    'secondaryCta' => ['label' => 'Mass Schedule', 'path' => '/shrine/mass-schedule'],
                ],
            ],
            'home.upcomingPilgrimages' => [
                'label' => 'Home pilgrimage events',
                'content' => [
                    'items' => [
                        ['id' => 1, 'title' => 'Feast of the Assumption', 'text' => 'A major Marian gathering of prayer and thanksgiving at the shrine.', 'meta' => '15 August'],
                        ['id' => 2, 'title' => 'Marian Youth Pilgrimage', 'text' => 'Young people journeying together in faith, song, and hope.', 'meta' => 'Youth'],
                        ['id' => 3, 'title' => 'National Pilgrimage', 'text' => 'The Church in Rwanda united in prayer at Kibeho.', 'meta' => 'National'],
                        ['id' => 4, 'title' => 'International Pilgrimage', 'text' => 'Pilgrims from beyond Rwanda welcomed in one communion of faith.', 'meta' => 'Worldwide'],
                    ],
                ],
            ],
            'home.todaySchedule' => [
                'label' => 'Home Today Schedule',
                'content' => [
                    'items' => [
                        ['id' => 1, 'title' => 'Daily Mass', 'time' => 'See Mass Times'],
                        ['id' => 2, 'title' => 'Confessions', 'time' => 'As announced'],
                        ['id' => 3, 'title' => 'Rosary', 'time' => 'After Mass / evening'],
                        ['id' => 4, 'title' => 'Adoration', 'time' => 'Selected days'],
                    ],
                ],
            ],
            'home.whyVisit' => [
                'label' => 'Home Why Kibeho',
                'content' => [
                    'eyebrow' => 'Why Kibeho?',
                    'heading' => 'Why make a pilgrimage here?',
                    'items' => [
                        ['id' => 'message', 'title' => 'The Message', 'text' => 'Discover the call of Our Lady of Kibeho to conversion, prayer, and reconciliation.'],
                        ['id' => 'recognised', 'title' => 'Church Recognition', 'text' => 'The only Marian apparition site in Africa officially recognised by the Catholic Church.'],
                        ['id' => 'liturgy', 'title' => 'Liturgical Life', 'text' => 'Join Mass, Adoration, and the prayer life of the Shrine.'],
                        ['id' => 'pilgrimage', 'title' => 'A Living Pilgrimage', 'text' => 'Come alone or with your parish — prepare your journey with the Pilgrimage Office.'],
                    ],
                    'cta' => ['primary' => ['label' => 'Read more', 'path' => '/pilgrimage/why-kibeho']],
                ],
            ],
            'home.quickLinks' => [
                'label' => 'Home — Quick links',
                'content' => [
                    'links' => [
                        ['id' => 'message', 'icon' => 'info', 'label' => 'The Message', 'text' => 'Apparitions & recognition', 'path' => '/our-lady'],
                        ['id' => 'plan', 'icon' => 'users', 'label' => 'Pilgrimage', 'text' => 'Plan your visit', 'path' => '/pilgrimage/plan'],
                        ['id' => 'pray', 'icon' => 'calendar', 'label' => 'Spirituality', 'text' => 'Pray with the Shrine', 'path' => '/spirituality'],
                        ['id' => 'donate', 'icon' => 'heart', 'label' => 'Support', 'text' => 'Master Plan & gifts', 'path' => '/support'],
                    ],
                ],
            ],
            'home.partners' => [
                'label' => 'Home — Partners',
                'content' => [
                    'eyebrow' => 'Partners',
                    'heading' => 'Walking together in faith',
                    'items' => [
                        ['id' => 1, 'label' => 'Diocese of Gikongoro'],
                        ['id' => 2, 'label' => 'Caritas'],
                        ['id' => 3, 'label' => 'Radio Maria'],
                        ['id' => 4, 'label' => 'Local Parishes'],
                        ['id' => 5, 'label' => 'Friends of Kibeho'],
                    ],
                ],
            ],
            'home.supportProjects' => [
                'label' => 'Home — Support projects',
                'content' => [
                    'eyebrow' => 'Support the Shrine',
                    'heading' => 'Kibeho is still being built',
                    'subtext' => 'Unlike older pilgrimage sites, the Shrine still needs pathways, welcome, and care. These works need friends.',
                ],
            ],
        ];

        $pagesPath = database_path('data/sanctuary_pages.json');
        if (is_file($pagesPath)) {
            $pages = json_decode(file_get_contents($pagesPath), true) ?: [];
            foreach ($pages as $key => $content) {
                $sections[$key] = [
                    'label' => Str::headline(str_replace(['.', '_', '-'], ' ', $key)),
                    'content' => $content,
                ];
            }
        }

        foreach ($sections as $key => $payload) {
            PageSection::updateOrCreate(
                ['key' => $key],
                [
                    'label' => $payload['label'],
                    'content' => $payload['content'],
                ]
            );
        }
    }
}
