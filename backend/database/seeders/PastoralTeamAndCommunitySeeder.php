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
                'photo' => '',
                'sort_order' => 1,
            ],
            [
                'slug' => 'chaplain',
                'name' => 'Shrine Chaplain',
                'role' => 'Chaplain',
                'bio' => '<p>Chaplains accompany pilgrims in the sacraments, spiritual guidance, and the prayer life of the shrine — including Mass, confession, and adoration.</p>',
                'photo' => '',
                'sort_order' => 2,
            ],
            [
                'slug' => 'pilgrimage-office',
                'name' => 'Pilgrimage Office',
                'role' => 'Pastoral coordination',
                'bio' => '<p>The Pilgrimage Office helps parishes and groups prepare their visit: liturgy, lodging, and practical arrangements at Kibeho.</p>',
                'photo' => '',
                'sort_order' => 3,
            ],
        ];

        foreach ($team as $member) {
            PastoralTeamMember::updateOrCreate(
                ['slug' => $member['slug']],
                array_merge($member, ['is_published' => true])
            );
        }

        Community::query()->delete();

        $communities = [
            ['slug' => 'pallottins', 'name' => 'Society of the Catholic Apostolate (Pallottins)', 'location' => 'Kibeho'],
            ['slug' => 'pallottine-sisters', 'name' => 'Missionary Sisters of the Catholic Apostolate (Pallottine Sisters)', 'location' => 'Kibeho'],
            ['slug' => 'disciples-of-jesus-eucharist', 'name' => 'Sisters Disciples of Jesus in the Eucharist', 'location' => 'Kibeho'],
            ['slug' => 'abahire-ba-nyina-wa-jambo', 'name' => 'Abahire ba Nyina wa Jambo', 'location' => 'Kibeho'],
            ['slug' => 'benebikira-sisters', 'name' => 'Benebikira Sisters', 'location' => 'Kibeho'],
            ['slug' => 'franciscan-sisters-servants-of-the-cross', 'name' => 'Franciscan Sisters Servants of the Cross', 'location' => 'Kibeho'],
            ['slug' => 'handmaids-of-mary', 'name' => 'Sisters Handmaids of Mary of the Heart of Jesus', 'location' => 'Kibeho'],
            ['slug' => 'annunciation-sisters-heverlee', 'name' => 'Congregation of the Annunciation Sisters of Heverlee', 'location' => 'Kibeho'],
            ['slug' => 'marian-fathers', 'name' => 'Marian Fathers', 'location' => 'Kibeho'],
            ['slug' => 'missionaries-of-the-peace', 'name' => 'The Missionaries of the Peace of Jesus Christ the King', 'location' => 'Kibeho'],
        ];

        foreach ($communities as $index => $community) {
            Community::updateOrCreate(
                ['slug' => $community['slug']],
                [
                    'name' => $community['name'],
                    'location' => $community['location'],
                    'description' => '<p>'.$community['name'].' serve around the Sanctuary of Our Lady of Kibeho, supporting the prayer and hospitality of pilgrims.</p>',
                    'cover_image' => '',
                    'gallery' => [],
                    'sort_order' => $index + 1,
                    'is_published' => true,
                ]
            );
        }
    }
}
