<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'news_posts',
            'upcoming_pilgrimages',
            'mass_schedules',
            'activities',
            'pilgrimage_services',
            'facilities',
            'sacred_places',
            'shrine_projects',
            'testimonials',
            'videos',
            'page_sections',
        ];

        foreach ($tables as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            Schema::table($table, function (Blueprint $blueprint) use ($table) {
                if (! Schema::hasColumn($table, 'translations')) {
                    $blueprint->json('translations')->nullable()->after('id');
                }
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'news_posts',
            'upcoming_pilgrimages',
            'mass_schedules',
            'activities',
            'pilgrimage_services',
            'facilities',
            'sacred_places',
            'shrine_projects',
            'testimonials',
            'videos',
            'page_sections',
        ];

        foreach ($tables as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            if (Schema::hasColumn($table, 'translations')) {
                Schema::table($table, function (Blueprint $blueprint) {
                    $blueprint->dropColumn('translations');
                });
            }
        }
    }
};
