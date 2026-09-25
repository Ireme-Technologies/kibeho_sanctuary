<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
            if (! Schema::hasColumn('upcoming_pilgrimages', 'is_charged')) {
                $table->boolean('is_charged')->default(false)->after('registration_open');
            }
        });
    }

    public function down(): void
    {
        Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
            if (Schema::hasColumn('upcoming_pilgrimages', 'is_charged')) {
                $table->dropColumn('is_charged');
            }
        });
    }
};
