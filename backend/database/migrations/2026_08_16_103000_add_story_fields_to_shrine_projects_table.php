<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shrine_projects', function (Blueprint $table) {
            $table->longText('problem')->nullable()->after('description');
            $table->longText('solution')->nullable()->after('problem');
            $table->longText('impact_local')->nullable()->after('solution');
            $table->longText('impact_global')->nullable()->after('impact_local');
            $table->longText('impact_church')->nullable()->after('impact_global');
        });

        $stories = [
            'master-plan-phase-one' => [
                'problem' => '<p>Unlike older pilgrimage sites, Kibeho is still being formed. On feast days, thousands arrive on paths and facilities that cannot yet receive them with the dignity the Mother of the Word deserves.</p>',
                'solution' => '<p>Phase One focuses on pilgrim pathways, sanitation, and essential hospitality spaces around the Shrine — the first stones of a lasting welcome.</p>',
                'impact_local' => '<p>Neighbours and Rwandan pilgrims gain safer paths, cleaner facilities, and work that serves the Sanctuary they already love.</p>',
                'impact_church' => '<p>Liturgy, confession, and pastoral care can unfold without the strain of crowding, so the Church in Kibeho can pray as a family.</p>',
                'impact_global' => '<p>Pilgrims from every nation can arrive and find a place prepared — a sign that Kibeho belongs to the whole Church.</p>',
            ],
            'pilgrim-welcome-centre' => [
                'problem' => '<p>Many arrive tired, unsure where to go, and without a quiet first word of welcome. Orientation is scattered; first-time pilgrims can miss the heart of the visit.</p>',
                'solution' => '<p>A dedicated centre for orientation, information, and pastoral accompaniment — a threshold between the road and the places of prayer.</p>',
                'impact_local' => '<p>Local teams can greet visitors with order and kindness, and young people of the region can serve as hosts.</p>',
                'impact_church' => '<p>Every pilgrim can be pointed toward Mass, confession, and the message of Our Lady before they walk the ways of the Shrine.</p>',
                'impact_global' => '<p>Guests from abroad receive a clear, peaceful beginning to their pilgrimage, in their own language where possible.</p>',
            ],
        ];

        foreach ($stories as $slug => $fields) {
            DB::table('shrine_projects')
                ->where('slug', $slug)
                ->where(function ($query) {
                    $query->whereNull('problem')->orWhere('problem', '');
                })
                ->update($fields);
        }
    }

    public function down(): void
    {
        Schema::table('shrine_projects', function (Blueprint $table) {
            $table->dropColumn(['problem', 'solution', 'impact_local', 'impact_global', 'impact_church']);
        });
    }
};
