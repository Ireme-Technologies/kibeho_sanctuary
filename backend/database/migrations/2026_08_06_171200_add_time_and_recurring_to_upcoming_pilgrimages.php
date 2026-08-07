<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
            if (! Schema::hasColumn('upcoming_pilgrimages', 'starts_at_time')) {
                $table->time('starts_at_time')->nullable()->after('ends_on');
            }
            if (! Schema::hasColumn('upcoming_pilgrimages', 'ends_at_time')) {
                $table->time('ends_at_time')->nullable()->after('starts_at_time');
            }
            if (! Schema::hasColumn('upcoming_pilgrimages', 'is_recurring')) {
                $table->boolean('is_recurring')->default(false)->after('ends_at_time');
            }
        });
    }

    public function down(): void
    {
        Schema::table('upcoming_pilgrimages', function (Blueprint $table) {
            $cols = collect(['starts_at_time', 'ends_at_time', 'is_recurring'])
                ->filter(fn ($col) => Schema::hasColumn('upcoming_pilgrimages', $col))
                ->all();
            if ($cols) {
                $table->dropColumn($cols);
            }
        });
    }
};
