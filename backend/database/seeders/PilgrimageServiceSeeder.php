<?php

namespace Database\Seeders;

use App\Models\PilgrimageService;
use Illuminate\Database\Seeder;

class PilgrimageServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'slug' => 'holy-mass',
                'title' => 'Holy Mass',
                'description' => 'Join daily and feast-day celebrations of the Eucharist at the heart of Kibeho Sanctuary — the source and summit of our pilgrimage life.',
                'image' => '/images/services/architectural-design.JPG',
                'detail_image' => '/images/services/architectural-design-detail.jpg',
                'icon_key' => 'architecture',
                'highlights' => [
                    'Daily Mass in the shrine chapel',
                    'Sunday and feast-day liturgies with pilgrim congregations',
                    'Masses in Kinyarwanda, French, and English when scheduled',
                    'Special Masses for groups and pilgrimages',
                    'Opportunity for intentions and thanksgiving',
                ],
                'sort_order' => 1,
            ],
            [
                'slug' => 'confession',
                'title' => 'Confession',
                'description' => 'Receive the sacrament of Reconciliation with priests available throughout the day — a grace Our Lady of Kibeho urged every pilgrim to seek.',
                'image' => '/images/services/structural-engineering.JPG',
                'detail_image' => '/images/services/structural-engineering-detail.jpg',
                'icon_key' => 'structure',
                'highlights' => [
                    'Confession available before and after Mass',
                    'Extended hours during pilgrimage seasons',
                    'Priests fluent in Kinyarwanda, French, and English',
                    'Private reconciliation rooms in the shrine area',
                    'Spiritual counsel for those seeking deeper healing',
                ],
                'sort_order' => 2,
            ],
            [
                'slug' => 'adoration',
                'title' => 'Adoration',
                'description' => 'Spend time in silent prayer before the Blessed Sacrament — a quiet refuge for pilgrims seeking peace and deeper union with Christ.',
                'image' => '/images/services/mep-engineering.JPG',
                'detail_image' => '/images/services/mep-engineering-detail.jpg',
                'icon_key' => 'mep',
                'highlights' => [
                    'Eucharistic adoration in the chapel',
                    'Scheduled holy hours and all-night vigils on feast days',
                    'Quiet prayer spaces for individual devotion',
                    'Guided adoration for pilgrimage groups',
                    'Exposition before and after major liturgies',
                ],
                'sort_order' => 3,
            ],
            [
                'slug' => 'rosary',
                'title' => 'Rosary',
                'description' => 'Pray the Rosary together in the spirit of Our Lady of Kibeho — meditating on the mysteries of Christ\'s life through Mary\'s intercession.',
                'image' => '/images/services/project-management.JPG',
                'detail_image' => '/images/services/project-management-detail.jpg',
                'icon_key' => 'management',
                'highlights' => [
                    'Communal Rosary before daily Mass',
                    'Rosary processions on pilgrimage days',
                    'Seven Sorrows Rosary devotion unique to Kibeho',
                    'Rosary guides available in multiple languages',
                    'Children\'s and family Rosary sessions when scheduled',
                ],
                'sort_order' => 4,
            ],
            [
                'slug' => 'retreats',
                'title' => 'Retreats',
                'description' => 'Deeper spiritual renewal through guided retreats — from day visits to multi-day programs of prayer, reflection, and community.',
                'image' => '/images/services/construction-management.jpg',
                'detail_image' => '/images/services/construction-management-detail.jpg',
                'icon_key' => 'construction',
                'highlights' => [
                    'Day retreats for individuals and small groups',
                    'Multi-day parish and diocesan pilgrimage programs',
                    'Themed retreats on reconciliation and Marian devotion',
                    'Accommodation coordination with guest houses',
                    'Retreat schedules tailored to group needs',
                ],
                'sort_order' => 5,
            ],
            [
                'slug' => 'spiritual-guidance',
                'title' => 'Spiritual Guidance',
                'description' => 'Meet with a priest or spiritual director for personal counsel — helping pilgrims discern God\'s will and integrate their Kibeho experience.',
                'image' => '/images/services/interior-design.jpg',
                'detail_image' => '/images/services/interior-design-detail.jpg',
                'icon_key' => 'interior',
                'highlights' => [
                    'One-on-one meetings with available priests',
                    'Guidance on the messages of Our Lady of Kibeho',
                    'Support for those seeking healing and forgiveness',
                    'Direction for ongoing prayer life after pilgrimage',
                    'Appointments arranged through the sanctuary office',
                ],
                'sort_order' => 6,
            ],
        ];

        foreach ($services as $service) {
            PilgrimageService::updateOrCreate(
                ['slug' => $service['slug']],
                array_merge($service, ['is_published' => true, 'image' => '', 'detail_image' => ''])
            );
        }
    }
}
