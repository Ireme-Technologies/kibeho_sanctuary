<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('media')) {
            return;
        }

        Schema::table('media', function (Blueprint $blueprint) {
            if (! Schema::hasColumn('media', 'translations')) {
                $blueprint->json('translations')->nullable()->after('alt');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('media')) {
            return;
        }

        if (Schema::hasColumn('media', 'translations')) {
            Schema::table('media', function (Blueprint $blueprint) {
                $blueprint->dropColumn('translations');
            });
        }
    }
};
