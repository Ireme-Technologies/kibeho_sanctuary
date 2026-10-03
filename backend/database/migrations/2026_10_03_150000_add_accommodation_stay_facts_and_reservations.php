<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facilities', function (Blueprint $table) {
            $table->unsignedSmallInteger('room_count')->nullable()->after('capacity');
            $table->string('distance_from_kibeho', 80)->nullable()->after('room_count');
            $table->unsignedInteger('price_from')->nullable()->after('distance_from_kibeho');
            $table->json('meeting_rooms')->nullable()->after('amenities');
            $table->json('review_links')->nullable()->after('meeting_rooms');
        });

        Schema::create('accommodation_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility_id')->nullable()->constrained('facilities')->nullOnDelete();
            $table->string('accommodation_name');
            $table->date('check_in');
            $table->date('check_out');
            $table->unsignedSmallInteger('guests');
            $table->unsignedSmallInteger('rooms');
            $table->json('guest_names');
            $table->string('country', 120);
            $table->string('trip_reason')->nullable();
            $table->string('organization')->nullable();
            $table->text('additional_request')->nullable();
            $table->string('whatsapp_number', 50);
            $table->timestamps();

            $table->index(['facility_id', 'check_in']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accommodation_reservations');

        Schema::table('facilities', function (Blueprint $table) {
            $table->dropColumn([
                'room_count',
                'distance_from_kibeho',
                'price_from',
                'meeting_rooms',
                'review_links',
            ]);
        });
    }
};
