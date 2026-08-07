<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('upcoming_pilgrimages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('meta')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('image')->nullable();
            $table->string('location')->nullable();
            $table->date('starts_on')->nullable();
            $table->date('ends_on')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('registration_open')->default(true);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::table('pilgrim_enquiries', function (Blueprint $table) {
            $table->foreignId('upcoming_pilgrimage_id')
                ->nullable()
                ->after('enquiry_type')
                ->constrained('upcoming_pilgrimages')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pilgrim_enquiries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('upcoming_pilgrimage_id');
        });

        Schema::dropIfExists('upcoming_pilgrimages');
    }
};
