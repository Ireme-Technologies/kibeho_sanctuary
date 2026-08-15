<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('upcoming_pilgrimages') && ! Schema::hasColumn('upcoming_pilgrimages', 'archives')) {
            Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
                $table->json('archives')->nullable()->after('image');
            });
        }

        if (Schema::hasTable('news_posts') && ! Schema::hasColumn('news_posts', 'related_event_slug')) {
            Schema::table('news_posts', function (Blueprint $table) {
                $table->string('related_event_slug', 255)->nullable()->after('tags');
            });
        }

        if (Schema::hasTable('testimonials') && ! Schema::hasColumn('testimonials', 'related_event_slug')) {
            Schema::table('testimonials', function (Blueprint $table) {
                $table->string('related_event_slug', 255)->nullable()->after('featured');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('upcoming_pilgrimages') && Schema::hasColumn('upcoming_pilgrimages', 'archives')) {
            Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
                $table->dropColumn('archives');
            });
        }
        if (Schema::hasTable('news_posts') && Schema::hasColumn('news_posts', 'related_event_slug')) {
            Schema::table('news_posts', function (Blueprint $table) {
                $table->dropColumn('related_event_slug');
            });
        }
        if (Schema::hasTable('testimonials') && Schema::hasColumn('testimonials', 'related_event_slug')) {
            Schema::table('testimonials', function (Blueprint $table) {
                $table->dropColumn('related_event_slug');
            });
        }
    }
};
