<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sacred_places', function (Blueprint $table) {
            $table->text('why_visit')->nullable()->after('description');
            $table->json('key_points')->nullable()->after('why_visit');
            $table->string('category')->nullable()->after('type');
        });

        DB::table('sacred_places')->where('type', 'church')->update([
            'type' => 'main_place',
            'category' => 'church',
        ]);

        Schema::create('visionaries', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('photo')->nullable();
            $table->string('period_label')->nullable();
            $table->string('period_start')->nullable();
            $table->string('period_end')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_approved')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->json('translations')->nullable();
            $table->timestamps();
        });

        Schema::create('mary_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('number')->default(1);
            $table->string('title');
            $table->text('summary')->nullable();
            $table->text('body')->nullable();
            $table->string('date_context')->nullable();
            $table->string('theme')->nullable();
            $table->string('image')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->json('translations')->nullable();
            $table->timestamps();
        });

        Schema::create('official_prayers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('time_label')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->json('translations')->nullable();
            $table->timestamps();
        });

        Schema::create('spiritual_books', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('author')->nullable();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('purchase_url')->nullable();
            $table->string('availability_note')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->json('translations')->nullable();
            $table->timestamps();
        });

        Schema::create('audio_items', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('audio');
            $table->string('audio_url')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('duration')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->json('translations')->nullable();
            $table->timestamps();
        });

        Schema::table('pilgrim_enquiries', function (Blueprint $table) {
            $table->json('mass_dates')->nullable()->after('message');
        });
    }

    public function down(): void
    {
        Schema::table('pilgrim_enquiries', function (Blueprint $table) {
            $table->dropColumn('mass_dates');
        });

        Schema::dropIfExists('audio_items');
        Schema::dropIfExists('spiritual_books');
        Schema::dropIfExists('official_prayers');
        Schema::dropIfExists('mary_messages');
        Schema::dropIfExists('visionaries');

        DB::table('sacred_places')->where('type', 'main_place')->where('category', 'church')->update([
            'type' => 'church',
        ]);

        Schema::table('sacred_places', function (Blueprint $table) {
            $table->dropColumn(['why_visit', 'key_points', 'category']);
        });
    }
};
