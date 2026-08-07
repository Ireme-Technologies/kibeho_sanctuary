<?php

namespace Database\Seeders;

use App\Models\NewsPost;
use Illuminate\Database\Seeder;

class NewsPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'slug' => 'preparing-for-your-first-pilgrimage-to-kibeho',
                'title' => 'Preparing for Your First Pilgrimage to Kibeho',
                'excerpt' => 'What to bring, what to expect, and how to open your heart before arriving at this sacred place in Nyaruguru.',
                'category' => 'News',
                'tags' => ['Pilgrimage', 'Our Lady of Kibeho'],
                'author_name' => 'Shrine Communications',
                'author_avatar' => '/images/blog/authors/team.jpg',
                'author_role' => 'Shrine Communications',
                'author_bio' => 'News and updates from the pastoral team serving pilgrims at the Shrine of Our Lady of Kibeho.',
                'published_at' => '2026-05-15',
                'cover_image' => '/images/sanctuary/hero.jpg',
                'body' => '<p>A pilgrimage to Kibeho is more than a journey through Rwanda\'s southern hills — it is an invitation to prayer, conversion, and reconciliation. Whether you come alone or with a parish group, a little preparation helps you receive the grace of this holy place.</p><figure><img src="/images/blog/signs-structural-reinforcement/inline-1.png" alt="Pilgrims at Kibeho" /><figcaption>Pilgrims walking toward the shrine at Kibeho.</figcaption></figure><ul><li>Pack modest clothing suitable for church and outdoor prayer</li><li>Bring a Rosary and any devotional books you find helpful</li><li>Arrange accommodation in advance during feast days</li><li>Plan to attend at least one daily Mass and confession</li><li>Allow time for silent prayer at the apparition sites</li></ul><h2>Arriving with an Open Heart</h2><p>Our Lady of Kibeho asked for prayer, fasting, and conversion of heart. Come ready to listen — not only during liturgies, but in the quiet moments walking the paths where the apparitions took place.</p><blockquote><p>Pray, pray, pray — and convert your hearts.</p><cite>Our Lady of Kibeho</cite></blockquote>',
            ],
            [
                'slug' => 'feast-of-our-lady-of-kibeho-2026-schedule',
                'title' => 'Feast of Our Lady of Kibeho — 2026 Schedule',
                'excerpt' => 'Join us for the annual feast day celebrations with special Masses, processions, and all-night adoration.',
                'category' => 'Events',
                'tags' => ['Events', 'Feast Days', 'Holy Mass'],
                'author_name' => 'Shrine Communications',
                'author_avatar' => '/images/blog/authors/team.jpg',
                'author_role' => 'Shrine Communications',
                'author_bio' => 'News and updates from the pastoral team serving pilgrims at the Shrine of Our Lady of Kibeho.',
                'published_at' => '2026-04-22',
                'cover_image' => '/images/sanctuary/welcome.jpg',
                'body' => '<p>Each year, pilgrims from across Rwanda and beyond gather at Kibeho Sanctuary to celebrate the feast of Our Lady of Kibeho. The 2026 program includes solemn Masses, a candlelight procession, confessions throughout the day, and Eucharistic adoration through the night.</p><h2>Highlights of the Feast Day</h2><p>The main solemn Mass begins at 10:00 AM in the shrine chapel, followed by a procession to the apparition hill. Guest houses and dining services operate on extended hours to welcome all pilgrims.</p>',
            ],
            [
                'slug' => 'meaning-of-the-seven-sorrows-rosary-at-kibeho',
                'title' => 'The Seven Sorrows Rosary at Kibeho',
                'excerpt' => 'Discover the devotion Our Lady taught the visionaries — and why it remains central to prayer at the sanctuary today.',
                'category' => 'Faith & Devotion',
                'tags' => ['Our Lady of Kibeho', 'Reconciliation'],
                'author_name' => 'Fr. Emmanuel Niyonsaba',
                'author_avatar' => '/images/blog/authors/diane-uwimana.jpg',
                'author_role' => 'Parish Priest',
                'author_bio' => 'Reflections on pilgrimage, Marian devotion, and the message of Our Lady of Kibeho.',
                'published_at' => '2026-03-10',
                'cover_image' => '/images/sanctuary/mary.jpg',
                'body' => '<p>Among the messages given at Kibeho, Our Lady introduced a devotion to her Seven Sorrows — inviting the faithful to meditate on her suffering alongside Christ\'s passion. This Rosary is prayed daily at the sanctuary and offered as a path toward compassion and forgiveness.</p><ul><li>Seven decades, each honoring a sorrow of the Blessed Virgin</li><li>Prayed communally before daily Mass at the shrine</li><li>Guides available in Kinyarwanda, French, and English</li><li>A devotion especially recommended during Lent</li></ul><p>Pilgrims often find that praying the Seven Sorrows Rosary opens the heart to the reconciliation Our Lady urgently requested for Rwanda and for the world.</p>',
            ],
            [
                'slug' => 'new-guest-house-wings-open-for-pilgrims',
                'title' => 'New Guest House Wings Open for Pilgrims',
                'excerpt' => 'Expanded accommodation now welcomes more retreat groups and international pilgrims during peak seasons.',
                'category' => 'News',
                'tags' => ['Sanctuary News', 'Pilgrimage'],
                'author_name' => 'Shrine Communications',
                'author_avatar' => '/images/blog/authors/team.jpg',
                'author_role' => 'Shrine Communications',
                'author_bio' => 'News and updates from the pastoral team serving pilgrims at the Shrine of Our Lady of Kibeho.',
                'published_at' => '2026-02-18',
                'cover_image' => '/images/sanctuary/hills.jpg',
                'body' => '<p>Kibeho Sanctuary has completed renovations on two guest house wings, adding capacity for parish groups and diocesan pilgrimages during feast days and retreat seasons.</p><p>Groups are encouraged to book early through the sanctuary office. Simple, clean rooms with shared facilities keep pilgrims close to the chapel and apparition sites.</p>',
            ],
            [
                'slug' => 'youth-retreat-weekend-at-kibeho-sanctuary',
                'title' => 'Youth Retreat Weekend at Kibeho Sanctuary',
                'excerpt' => 'A weekend of prayer, catechesis, and fellowship for young Catholics — registration now open.',
                'category' => 'Events',
                'tags' => ['Retreats', 'Events'],
                'author_name' => 'Fr. Emmanuel Niyonsaba',
                'author_avatar' => '/images/blog/authors/diane-uwimana.jpg',
                'author_role' => 'Parish Priest',
                'author_bio' => 'Reflections on pilgrimage, Marian devotion, and the message of Our Lady of Kibeho.',
                'published_at' => '2026-01-29',
                'cover_image' => '/images/sanctuary/crest.jpg',
                'body' => '<p>The sanctuary invites youth groups from parishes across Rwanda to a dedicated retreat weekend focused on prayer, reconciliation, and Marian devotion. Programs include Mass, confession, guided reflection, and time at the apparition sites.</p><h2>How to Register</h2><p>Parish youth leaders may contact the sanctuary office to reserve places. Accommodation and meals are included for registered groups. Spaces are limited — early booking is recommended.</p>',
            ],
            [
                'slug' => 'message-of-reconciliation-for-rwanda-and-the-world',
                'title' => 'The Message of Reconciliation for Rwanda and the World',
                'excerpt' => 'Reflecting on Our Lady\'s call to forgive and heal — a message that continues to resonate at Kibeho today.',
                'category' => 'Rector',
                'tags' => ['Reconciliation', 'Our Lady of Kibeho'],
                'author_name' => 'Fr. Emmanuel Niyonsaba',
                'author_avatar' => '/images/blog/authors/diane-uwimana.jpg',
                'author_role' => 'Rector',
                'author_bio' => 'Reflections on pilgrimage, Marian devotion, and the message of Our Lady of Kibeho.',
                'published_at' => '2025-12-05',
                'cover_image' => '/images/sanctuary/hero.jpg',
                'body' => '<p>Long before Rwanda\'s darkest hour, the messages at Kibeho spoke of sorrow, warning, and an urgent call to reconciliation. Today, pilgrims come seeking healing — for themselves, their families, and their nation.</p><blockquote><p>Repent, repent, repent. Forgive each other. Help the poor.</p><cite>Our Lady of Kibeho</cite></blockquote><p>The shrine offers confession, spiritual guidance, and prayer spaces where this message can take root. Reconciliation is not a single moment — it is a path walked in faith, one step at a time.</p>',
            ],
            [
                'slug' => 'bishop-pastoral-letter-on-pilgrimage',
                'title' => 'Pastoral Letter: Walking with Our Lady of Kibeho',
                'excerpt' => 'A message from the Bishop of Gikongoro on pilgrimage, conversion, and supporting the development of the Shrine.',
                'category' => 'Bishop',
                'tags' => ['Bishop', 'Pastoral Letter'],
                'author_name' => 'Bishop of Gikongoro',
                'author_avatar' => '/images/blog/authors/team.jpg',
                'author_role' => 'Diocese of Gikongoro',
                'author_bio' => 'Pastoral messages from the Diocese of Gikongoro for the Shrine of Our Lady of Kibeho.',
                'published_at' => '2025-11-20',
                'cover_image' => '/images/sanctuary/church.jpg',
                'body' => '<p>Dear pilgrims and friends of Kibeho: the Shrine of Our Lady of Kibeho remains a gift for Rwanda and for the universal Church. I invite you to come, to pray, and to support the pastoral and infrastructural development that will welcome future generations of pilgrims.</p><p>May the Mother of the Word lead us always to her Son.</p>',
            ],
            [
                'slug' => 'press-note-international-pilgrimage',
                'title' => 'Press Note: International Pilgrimage Announcement',
                'excerpt' => 'Media information regarding the forthcoming international pilgrimage to the Shrine of Our Lady of Kibeho.',
                'category' => 'Press',
                'tags' => ['Press', 'Pilgrimage'],
                'author_name' => 'Shrine Communications',
                'author_avatar' => '/images/blog/authors/team.jpg',
                'author_role' => 'Shrine Communications',
                'author_bio' => 'News and updates from the pastoral team serving pilgrims at the Shrine of Our Lady of Kibeho.',
                'published_at' => '2025-10-12',
                'cover_image' => '/images/sanctuary/hills.jpg',
                'body' => '<p>The Diocese of Gikongoro announces preparations for an international pilgrimage to the Shrine of Our Lady of Kibeho. Accredited media are invited to contact the Pilgrimage Office for schedules, interviews, and access guidelines.</p>',
            ],
        ];

        foreach ($posts as $post) {
            NewsPost::updateOrCreate(
                ['slug' => $post['slug']],
                array_merge($post, ['is_published' => true])
            );
        }
    }
}
