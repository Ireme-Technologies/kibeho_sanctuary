<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mass_schedules', function (Blueprint $table) {
            if (! Schema::hasColumn('mass_schedules', 'starts_at_time')) {
                $table->time('starts_at_time')->nullable()->after('time_label');
            }
            if (! Schema::hasColumn('mass_schedules', 'ends_at_time')) {
                $table->time('ends_at_time')->nullable()->after('starts_at_time');
            }
            if (! Schema::hasColumn('mass_schedules', 'is_recurring')) {
                $table->boolean('is_recurring')->default(true)->after('ends_at_time');
            }
            if (! Schema::hasColumn('mass_schedules', 'recurrence_type')) {
                $table->string('recurrence_type', 20)->nullable()->after('is_recurring');
            }
        });

        Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
            if (! Schema::hasColumn('upcoming_pilgrimages', 'recurrence_type')) {
                $table->string('recurrence_type', 20)->nullable()->after('is_recurring');
            }
        });

        // Existing recurring pilgrimages default to annual (e.g. feast days).
        if (Schema::hasColumn('upcoming_pilgrimages', 'recurrence_type')) {
            DB::table('upcoming_pilgrimages')
                ->where('is_recurring', true)
                ->whereNull('recurrence_type')
                ->update(['recurrence_type' => 'annual']);
        }
    }

    public function down(): void
    {
        Schema::table('mass_schedules', function (Blueprint $table) {
            $cols = collect(['starts_at_time', 'ends_at_time', 'is_recurring', 'recurrence_type'])
                ->filter(fn ($col) => Schema::hasColumn('mass_schedules', $col))
                ->all();
            if ($cols) {
                $table->dropColumn($cols);
            }
        });

        Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
            if (Schema::hasColumn('upcoming_pilgrimages', 'recurrence_type')) {
                $table->dropColumn('recurrence_type');
            }
        });
    }
};
