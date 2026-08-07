<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mass_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('day_label'); // Sunday, Monday–Saturday, Feast Days
            $table->string('title');
            $table->string('time_label')->nullable(); // 10:00 AM
            $table->string('language')->nullable();
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('author_name');
            $table->string('author_role')->nullable();
            $table->string('author_location')->nullable();
            $table->string('author_avatar')->nullable();
            $table->string('title')->nullable();
            $table->text('body');
            $table->unsignedTinyInteger('rating')->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->date('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('shrine_projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('status')->nullable(); // Planning, In progress, Completed
            $table->string('phase')->nullable();
            $table->string('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('funding_goal')->nullable();
            $table->string('funding_raised')->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('sacred_places', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('type'); // church | apparition_site
            $table->string('name');
            $table->string('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('location')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        if (Schema::hasTable('upcoming_pilgrimages') && ! Schema::hasColumn('upcoming_pilgrimages', 'event_type')) {
            Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
                $table->string('event_type')->default('pilgrimage')->after('slug'); // pilgrimage | feast | retreat | calendar
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('sacred_places');
        Schema::dropIfExists('shrine_projects');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('mass_schedules');

        if (Schema::hasTable('upcoming_pilgrimages') && Schema::hasColumn('upcoming_pilgrimages', 'event_type')) {
            Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
                $table->dropColumn('event_type');
            });
        }
    }
};
