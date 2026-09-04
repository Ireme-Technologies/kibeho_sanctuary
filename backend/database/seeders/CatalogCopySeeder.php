<?php

namespace Database\Seeders;

use App\Models\MaryMessage;
use App\Models\OfficialPrayer;
use Illuminate\Database\Seeder;

class CatalogCopySeeder extends Seeder
{
    public function run(): void
    {
        $this->fillMaryMessages();
        $this->fillOfficialPrayer();
    }

    private function fillMaryMessages(): void
    {
        $messages = [
            [
                'number' => 1,
                'title' => 'Convert while there is still time',
                'theme' => 'Conversion',
                'summary' => 'Our Lady called the world to conversion of heart — not later, but now.',
                'body' => '<p>The Mother of the Word asked Kibeho, and through Kibeho the Church, to convert while there is still time. Her message is urgent and merciful: return to God, do not postpone repentance, and live as children who have heard the call.</p>',
            ],
            [
                'number' => 2,
                'title' => 'Pray the Rosary daily',
                'theme' => 'Prayer',
                'summary' => 'Daily prayer of the Rosary remains at the centre of the message of Kibeho.',
                'body' => '<p>Our Lady asked for the Rosary to be prayed faithfully. At Kibeho this prayer is not an ornament of devotion but a path of conversion, peace, and perseverance.</p>',
            ],
            [
                'number' => 3,
                'title' => 'Offer reparation for sins',
                'theme' => 'Reparation',
                'summary' => 'Prayer, sacrifice, and love offered for the conversion of sinners.',
                'body' => '<p>The apparitions invite reparation — a willing offering of prayer and sacrifice so that hearts may return to God and wounds among people may be healed.</p>',
            ],
            [
                'number' => 4,
                'title' => 'Seek reconciliation',
                'theme' => 'Reconciliation',
                'summary' => 'Be reconciled with God and with one another.',
                'body' => '<p>Kibeho is a sanctuary of reconciliation. The Mother of the Word asks forgiveness, peace, and a love that mends what hatred has broken.</p>',
            ],
            [
                'number' => 5,
                'title' => 'Live as children of the Mother of the Word',
                'theme' => 'Discipleship',
                'summary' => 'To hear Mary at Kibeho is to follow her Son more closely.',
                'body' => '<p>Those who come to Kibeho are invited to live as children of the Mother of the Word: humble, prayerful, and faithful to the Gospel in ordinary life.</p>',
            ],
            [
                'number' => 6,
                'title' => 'Repent and return to God',
                'theme' => 'Conversion',
                'summary' => 'Repentance is the first step of the pilgrimage of the heart.',
                'body' => '<p>The call to repent is not accusation but invitation. Return to God, confess, and begin again — this is the first work of a pilgrim at Kibeho.</p>',
            ],
            [
                'number' => 7,
                'title' => 'Pray the Seven Sorrows Rosary',
                'theme' => 'Devotion',
                'summary' => 'The distinctive prayer of Kibeho, asked of Marie Claire and of the whole Church.',
                'body' => '<p>Our Lady asked that the faithful pray the Rosary of the Seven Sorrows — uniting our hearts to her compassion and to the Passion of her Son.</p>',
            ],
            [
                'number' => 8,
                'title' => 'Help the poor',
                'theme' => 'Charity',
                'summary' => 'Love of neighbour is part of the conversion Mary asked for.',
                'body' => '<p>The message of Kibeho is not only interior. Those who hear Our Lady are sent to the poor, the wounded, and the forgotten with practical charity.</p>',
            ],
            [
                'number' => 9,
                'title' => 'Forgive one another',
                'theme' => 'Reconciliation',
                'summary' => 'Forgiveness is the peace Our Lady asked Rwanda — and the world — to choose.',
                'body' => '<p>Forgive one another. This word, spoken on a hillside that would later know great suffering, remains the heart of the Shrine’s pastoral mission.</p>',
            ],
            [
                'number' => 10,
                'title' => 'Be witnesses of hope',
                'theme' => 'Mission',
                'summary' => 'Carry the message of Kibeho into the world with hope, not fear.',
                'body' => '<p>Those who have prayed at Kibeho are sent as witnesses of hope: conversion is possible, peace is possible, and the Mother of the Word still gathers her children.</p>',
            ],
        ];

        foreach ($messages as $index => $row) {
            $item = MaryMessage::query()->firstOrNew(['number' => $row['number']]);
            if (! $item->title) {
                $item->title = $row['title'];
            }
            if (! $item->theme) {
                $item->theme = $row['theme'];
            }
            if (! $item->summary) {
                $item->summary = $row['summary'];
            }
            if (! $item->body) {
                $item->body = $row['body'];
            }
            if (! $item->sort_order) {
                $item->sort_order = $index + 1;
            }
            $item->is_published = $item->exists ? $item->is_published : true;
            $item->save();
        }
    }

    private function fillOfficialPrayer(): void
    {
        if (OfficialPrayer::query()->exists()) {
            return;
        }

        OfficialPrayer::create([
            'title' => 'A prayer to Our Lady of Kibeho',
            'time_label' => null,
            'description' => '<p>Blessed Virgin Mary, Mother of the Word, Mother of all who believe in Him: we thank you for the gift of your apparitions at Kibeho. Obtain for us the grace of conversion, a sincere love of the Cross, and reconciliation with God and with one another. Teach us to pray the Rosary, especially the Rosary of your Seven Sorrows. Mother of the Word, pray for Rwanda, for Africa, and for the whole world. Amen.</p>',
            'sort_order' => 1,
            'is_published' => true,
        ]);
    }
}
