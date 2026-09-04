<?php

namespace Database\Seeders;

use App\Models\TravelRoute;
use Illuminate\Database\Seeder;

class TravelRouteSeeder extends Seeder
{
    public function run(): void
    {
        $routes = [
            [
                'origin' => 'Kigali',
                'title' => 'Kigali – Huye – Matyazo – Kibeho',
                'description' => '<p>From Kigali, take the road south to Huye (Butare), continue to Matyazo, then on to Kibeho in Nyaruguru District. International pilgrims usually fly into Kigali International Airport and continue by road (about three hours).</p>',
                'sort_order' => 1,
            ],
            [
                'origin' => 'Rusizi',
                'title' => 'Rusizi – Huye – Matyazo – Kibeho',
                'description' => '<p>From Rusizi in the west, travel via Huye and Matyazo to reach the Shrine at Kibeho.</p>',
                'sort_order' => 2,
            ],
            [
                'origin' => 'Akanyaru',
                'title' => 'Akanyaru – Cahinda – Kibeho',
                'description' => '<p>From the Akanyaru border area, the usual approach is through Cahinda and on to Kibeho.</p>',
                'sort_order' => 3,
            ],
        ];

        foreach ($routes as $route) {
            TravelRoute::updateOrCreate(
                ['title' => $route['title']],
                [...$route, 'is_published' => true]
            );
        }
    }
}
