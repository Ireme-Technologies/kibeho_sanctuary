<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('sacred_places') && ! Schema::hasColumn('sacred_places', 'link_path')) {
            Schema::table('sacred_places', function (Blueprint $table) {
                $table->string('link_path')->nullable()->after('location');
            });
        }

        if (! Schema::hasTable('sacred_places')) {
            return;
        }

        $now = now();
        $inserted = false;

        foreach ($this->highlights() as $place) {
            $exists = DB::table('sacred_places')->where('slug', $place['slug'])->exists();
            if ($exists) {
                continue;
            }

            DB::table('sacred_places')->insert(array_merge($place, [
                'gallery' => json_encode([]),
                'key_points' => json_encode([]),
                'created_at' => $now,
                'updated_at' => $now,
            ]));
            $inserted = true;
        }

        if ($inserted) {
            DB::table('sacred_places')
                ->where('type', 'main_place')
                ->whereNotIn('slug', array_column($this->highlights(), 'slug'))
                ->where('sort_order', '<', 100)
                ->update(['sort_order' => DB::raw('sort_order + 100')]);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('sacred_places') && Schema::hasColumn('sacred_places', 'link_path')) {
            Schema::table('sacred_places', function (Blueprint $table) {
                $table->dropColumn('link_path');
            });
        }
    }

    /**
     * Homepage “Main Places of the Shrine” cards, stored as editable main places.
     *
     * @return array<int, array<string, mixed>>
     */
    private function highlights(): array
    {
        $shared = [
            'type' => 'main_place',
            'cover_image' => '',
            'location' => 'Shrine of Our Lady of Kibeho',
            'is_published' => true,
            'link_path' => null,
        ];

        return [
            array_merge($shared, [
                'slug' => 'chapel-of-the-seven-sorrows',
                'category' => 'Chapel',
                'name' => 'The Chapel of the Seven Sorrows',
                'short_description' => 'The principal church of the Sanctuary — dedicated to Our Lady of Sorrows.',
                'description' => '<p>The principal church of the Sanctuary — dedicated to Our Lady of Sorrows.</p>',
                'sort_order' => 1,
            ]),
            array_merge($shared, [
                'slug' => 'apparition-sites',
                'category' => 'Sites',
                'name' => 'Apparition Sites',
                'short_description' => 'Visit the places remembered for the apparitions of the Mother of the Word.',
                'description' => '<p>Visit the places remembered for the apparitions of the Mother of the Word.</p>',
                'link_path' => '/shrine/apparition-sites',
                'sort_order' => 2,
            ]),
            array_merge($shared, [
                'slug' => 'way-to-the-cross',
                'category' => 'Path',
                'name' => 'Way to the Cross',
                'short_description' => 'Pray the Stations with Christ, walking with Our Lady of Sorrows.',
                'description' => '<p>Pray the Stations with Christ, walking with Our Lady of Sorrows.</p>',
                'sort_order' => 3,
            ]),
            array_merge($shared, [
                'slug' => 'way-of-rosary',
                'category' => 'Path',
                'name' => 'Way of Rosary',
                'short_description' => 'A prayerful path through the mysteries of the Rosary on the shrine grounds.',
                'description' => '<p>A prayerful path through the mysteries of the Rosary on the shrine grounds.</p>',
                'sort_order' => 4,
            ]),
            array_merge($shared, [
                'slug' => 'way-of-seven-sorrows',
                'category' => 'Path',
                'name' => 'Way of Seven Sorrows',
                'short_description' => 'Walk the devotion Our Lady taught at Kibeho — the Rosary of the Seven Sorrows.',
                'description' => '<p>Walk the devotion Our Lady taught at Kibeho — the Rosary of the Seven Sorrows.</p>',
                'sort_order' => 5,
            ]),
            array_merge($shared, [
                'slug' => 'holy-spring',
                'category' => 'Spring',
                'name' => 'Holy Spring',
                'short_description' => 'Come to the spring in faith — a sign of God’s grace and a call to interior trust.',
                'description' => '<p>Come to the spring in faith — a sign of God’s grace and a call to interior trust.</p>',
                'sort_order' => 6,
            ]),
        ];
    }
};
