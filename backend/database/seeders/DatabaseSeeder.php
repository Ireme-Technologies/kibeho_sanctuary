<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SettingsSeeder::class,
            PilgrimageServiceSeeder::class,
            FacilitySeeder::class,
            NewsPostSeeder::class,
            ActivitySeeder::class,
            UpcomingPilgrimageSeeder::class,
            VideoSeeder::class,
            CmsContentSeeder::class,
            PageSectionSeeder::class,
            PastoralTeamAndCommunitySeeder::class,
            EnsureOurLadyNavSeeder::class,
            RestructureContentSeeder::class,
            VisionarySeeder::class,
            TravelRouteSeeder::class,
        ]);
    }
}
