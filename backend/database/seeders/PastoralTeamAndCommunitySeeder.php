<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\PastoralTeamMember;
use Illuminate\Database\Seeder;

class PastoralTeamAndCommunitySeeder extends Seeder
{
    public function run(): void
    {
        $team = [
            [
                'slug' => 'rector',
                'name' => 'Rector of the Shrine',
                'role' => 'Rector',
                'bio' => '<p>The Rector oversees the pastoral life of the Shrine of Our Lady of Kibeho, welcoming pilgrims and coordinating liturgy, hospitality, and the shrine’s day-to-day mission.</p>',
                'photo' => '/images/sanctuary/welcome.jpg',
                'sort_order' => 1,
            ],
            [
                'slug' => 'chaplain',
                'name' => 'Shrine Chaplain',
                'role' => 'Chaplain',
                'bio' => '<p>Chaplains accompany pilgrims in the sacraments, spiritual guidance, and the prayer life of the shrine — including Mass, confession, and adoration.</p>',
                'photo' => '/images/sanctuary/church.jpg',
                'sort_order' => 2,
            ],
            [
                'slug' => 'pilgrimage-office',
                'name' => 'Pilgrimage Office',
                'role' => 'Pastoral coordination',
                'bio' => '<p>The Pilgrimage Office helps parishes and groups prepare their visit: liturgy, lodging, and practical arrangements at Kibeho.</p>',
                'photo' => '/images/sanctuary/hills.jpg',
                'sort_order' => 3,
            ],
        ];

        foreach ($team as $member) {
            PastoralTeamMember::updateOrCreate(
                ['slug' => $member['slug']],
                array_merge($member, ['is_published' => true])
            );
        }

        $communities = [
            [
                'slug' => 'kibeho-parish',
                'name' => 'Kibeho Parish',
                'location' => 'Kibeho, Nyaruguru',
                'description' => '<p>The parish community of Kibeho lives around the shrine, sharing daily liturgy with pilgrims and remaining a living witness of the message of Our Lady of Kibeho.</p>',
                'cover_image' => '/images/sanctuary/church.jpg',
                'gallery' => ['/images/sanctuary/church.jpg', '/images/sanctuary/welcome.jpg'],
                'sort_order' => 1,
            ],
            [
                'slug' => 'nyaruguru-hills',
                'name' => 'Communities of the Nyaruguru hills',
                'location' => 'Nyaruguru District',
                'description' => '<p>Villages and families of the surrounding hills welcome pilgrims with hospitality rooted in faith. Many visitors come to know Kibeho through the people who live here year-round.</p>',
                'cover_image' => '/images/sanctuary/hills.jpg',
                'gallery' => ['/images/sanctuary/hills.jpg', '/images/sanctuary/hero.jpg'],
                'sort_order' => 2,
            ],
            [
                'slug' => 'religious-communities',
                'name' => 'Religious communities near the Shrine',
                'location' => 'Kibeho and nearby convents',
                'description' => '<p>Religious sisters, brothers, and communities serving near the shrine support catechesis, hospitality, and prayer with pilgrims from Rwanda and abroad.</p>',
                'cover_image' => '/images/sanctuary/welcome.jpg',
                'gallery' => ['/images/sanctuary/welcome.jpg'],
                'sort_order' => 3,
            ],
        ];

        foreach ($communities as $community) {
            Community::updateOrCreate(
                ['slug' => $community['slug']],
                array_merge($community, ['is_published' => true])
            );
        }
    }
}
