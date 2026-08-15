<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facilities', function (Blueprint $table) {
            $table->json('amenities')->nullable()->after('gallery');
            $table->string('website_url', 500)->nullable()->after('booking_url');
            $table->string('phone', 50)->nullable()->after('website_url');
            $table->string('whatsapp', 50)->nullable()->after('phone');
            $table->string('email', 255)->nullable()->after('whatsapp');
        });
    }

    public function down(): void
    {
        Schema::table('facilities', function (Blueprint $table) {
            $table->dropColumn(['amenities', 'website_url', 'phone', 'whatsapp', 'email']);
        });
    }
};
