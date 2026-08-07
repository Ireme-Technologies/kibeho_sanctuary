<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'slug' => 'touch-the-rock',
                'title' => 'Touch the Rock',
                'short_description' => 'Pray at the rock of devotion and entrust your intentions to Our Lady of Kibeho.',
                'description' => '<p>Pilgrims come to touch the rock in prayer, bringing personal intentions with faith and humility before God through the intercession of the Blessed Virgin Mary.</p>',
                'image' => '/images/sanctuary/activity-rock.jpg',
                'sort_order' => 1,
            ],
            [
                'slug' => 'light-a-candle',
                'title' => 'Light a Candle',
                'short_description' => 'Offer a candle for family, peace, healing, thanksgiving, or a special intention.',
                'description' => '<p>Lighting a candle represents bringing one’s intentions before God through the intercession of Our Lady of Kibeho.</p><p>Visitors may light candles for families, peace, healing, thanksgiving, and special intentions.</p>',
                'image' => '/images/sanctuary/activity-candle.jpg',
                'sort_order' => 2,
            ],
            [
                'slug' => 'water',
                'title' => 'Drink Water from the Spring',
                'short_description' => 'Visit the spring in prayer and trust in God’s mercy through Our Lady of Kibeho.',
                'description' => '<p>Pilgrims visit the spring while offering prayers of faith and trust in God’s mercy.</p><p>The Church encourages every visitor to understand this as an expression of prayer rather than a guarantee of miraculous healing. Healing comes from God.</p>',
                'image' => '/images/sanctuary/activity-spring.jpg',
                'sort_order' => 3,
            ],
            [
                'slug' => 'holy-mass',
                'title' => 'Take Part in the Mass',
                'short_description' => 'Join the Eucharist at the heart of every pilgrimage to Kibeho.',
                'description' => '<p>Daily Eucharistic celebrations remain at the heart of every pilgrimage. Visitors are encouraged to participate actively through prayer, singing, and reflection.</p>',
                'image' => '/images/sanctuary/hero.jpg',
                'sort_order' => 4,
            ],
            [
                'slug' => 'mass-readings',
                'title' => 'Mass Readings',
                'short_description' => 'Follow the Word of God proclaimed in the liturgy at the shrine.',
                'description' => '<p>Follow the Word of God proclaimed in the liturgy. Readings and reflections for pilgrims can be updated by the sanctuary team.</p>',
                'image' => '/images/sanctuary/welcome.jpg',
                'sort_order' => 5,
            ],
            [
                'slug' => 'worship-meditation',
                'title' => 'Worship & Meditation',
                'short_description' => 'Make space for silent prayer, adoration, and meditation at the shrine.',
                'description' => '<p>Make space for silent prayer, adoration, and meditation during your pilgrimage — listening to God in the stillness of the shrine.</p>',
                'image' => '/images/sanctuary/mary.jpg',
                'sort_order' => 6,
            ],
            [
                'slug' => 'rosary-7-sorrows',
                'title' => 'Rosary of the 7 Sorrows',
                'short_description' => 'Pray the Seven Sorrows Rosary, closely linked to the message of Kibeho.',
                'description' => '<p>Pray the Rosary of the Seven Sorrows of Mary, a devotion closely linked to the message of Our Lady of Kibeho.</p>',
                'image' => '/images/sanctuary/crest.jpg',
                'sort_order' => 7,
            ],
            [
                'slug' => 'rosary',
                'title' => 'Rosary',
                'short_description' => 'Join the communal Rosary or pray quietly along the paths of Kibeho.',
                'description' => '<p>Join the communal Rosary at the shrine, or pray quietly along the paths of Kibeho with Mary, Mother of the Church.</p>',
                'image' => '/images/sanctuary/hills.jpg',
                'sort_order' => 8,
            ],
            [
                'slug' => 'road-to-the-cross',
                'title' => 'Road to the Cross',
                'short_description' => 'Walk the Stations of the Cross in prayerful pilgrimage with Christ.',
                'description' => '<p>Walk the Stations of the Cross in prayerful pilgrimage, uniting your journey with the Passion of Christ.</p>',
                'image' => '/images/sanctuary/hero.jpg',
                'sort_order' => 9,
            ],
        ];

        foreach ($items as $item) {
            Activity::updateOrCreate(
                ['slug' => $item['slug']],
                array_merge($item, [
                    'show_in_menu' => true,
                    'is_published' => true,
                ])
            );
        }
    }
}