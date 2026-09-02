<?php

namespace Database\Seeders;

use App\Models\MaryMessage;
use App\Models\PageSection;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RestructureContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->updateNavigation();
        $this->updateOfferings();
        $this->removeDeprecatedPages();
        $this->seedPages();
        $this->seedMaryMessages();
        $this->updateHomeSections();
    }

    private function updateNavigation(): void
    {
        $path = database_path('data/sanctuary_navigation.json');
        if (! is_file($path)) {
            return;
        }
        $nav = json_decode(file_get_contents($path), true);
        Setting::updateOrCreate(['key' => 'navigation'], ['value' => $nav]);
    }

    private function updateOfferings(): void
    {
        $row = Setting::query()->where('key', 'offerings')->first();
        $value = is_array($row?->value) ? $row->value : [];
        $value['massPriceUsd'] = 2.5;
        $value['massPriceEur'] = 2;
        Setting::updateOrCreate(['key' => 'offerings'], ['value' => $value]);
    }

    private function removeDeprecatedPages(): void
    {
        $deprecated = [
            'our-lady.index', 'our-lady.apparitions', 'our-lady.visionaries', 'our-lady.messages',
            'our-lady.church-recognition', 'our-lady.history', 'our-lady.pastoral-team', 'our-lady.communities', 'our-lady.faq',
            'shrine.churches', 'shrine.holy-spring', 'shrine.way-of-the-cross', 'shrine.eucharistic-adorations',
            'shrine.mass-schedule',
            'pilgrimage.transportation', 'pilgrimage.office', 'pilgrimage.practical-information', 'pilgrimage.calendar',
            'spirituality.rosary', 'spirituality.seven-sorrows-rosary', 'spirituality.testimonies', 'spirituality.request-a-mass',
            'support.master-plan', 'support.annual-reports', 'support.transparency', 'support.partners',
            'hotels.index', 'faq.index',
        ];
        PageSection::query()->whereIn('key', $deprecated)->delete();
    }

    private function seedPages(): void
    {
        $pages = [
            'shrine.index' => [
                'label' => 'The Shrine — Hub',
                'content' => [
                    'title' => 'The Shrine of Our Lady of Kibeho',
                    'subtitle' => 'Africa\'s first Church-recognised Marian apparition site',
                    'intro' => '<p>Welcome to Kibeho — a place of prayer, conversion, and reconciliation where pilgrims from every nation are invited to encounter the Mother of the Word.</p>',
                    'links' => [
                        ['label' => 'Welcome', 'path' => '/shrine/welcome'],
                        ['label' => 'History', 'path' => '/shrine/history'],
                        ['label' => 'Apparition Sites', 'path' => '/shrine/apparition-sites'],
                        ['label' => 'The Messages', 'path' => '/shrine/messages'],
                        ['label' => 'Schedule', 'path' => '/shrine/schedule'],
                    ],
                    'cta' => [
                        'primary' => ['label' => 'Plan Your Pilgrimage', 'path' => '/pilgrimage/plan'],
                        'secondary' => ['label' => 'Support the Shrine', 'path' => '/support'],
                    ],
                ],
            ],
            'shrine.welcome' => [
                'label' => 'Shrine — Welcome',
                'content' => $this->mergeOld('shrine.welcome', [
                    'title' => 'Welcome to Kibeho',
                    'subtitle' => 'A sanctuary open to the world',
                    'leaderName' => 'The Rector',
                    'leaderRole' => 'Shrine of Our Lady of Kibeho',
                    'leaderMessage' => '<p>On behalf of the pastoral team, I welcome every pilgrim — near or far — who comes seeking God through Our Lady of Kibeho. May your visit be a time of conversion, prayer, and peace.</p>',
                    'mission' => '<p>To welcome pilgrims, preserve the message of Kibeho, and foster reconciliation through prayer and the sacramental life of the Church.</p>',
                    'vision' => '<p>A Shrine where every nation finds a home in the Mother of the Word — praying, reconciling, and building peace.</p>',
                    'coreValues' => [
                        ['title' => 'Prayer', 'text' => 'At the heart of every pilgrimage'],
                        ['title' => 'Conversion', 'text' => 'Turning hearts to God while there is still time'],
                        ['title' => 'Reconciliation', 'text' => 'Between persons, communities, and nations'],
                        ['title' => 'Welcome', 'text' => 'Open arms for international and local pilgrims'],
                    ],
                ]),
            ],
            'shrine.history' => [
                'label' => 'Shrine — History',
                'content' => $this->mergeOld('our-lady.history', [
                    'title' => 'History',
                    'subtitle' => 'Before, during, and after the apparitions',
                    'churchRecognition' => $this->oldContent('our-lady.church-recognition')['intro'] ?? '',
                ]),
            ],
            'shrine.messages' => [
                'label' => 'Shrine — The Messages (intro)',
                'content' => $this->mergeOld('our-lady.messages', [
                    'title' => 'The Messages',
                    'subtitle' => 'Faith, conversion, and prayer',
                ]),
            ],
            'shrine.schedule' => [
                'label' => 'Shrine — Schedule',
                'content' => [
                    'title' => 'Schedule of the Shrine',
                    'subtitle' => 'Weekly prayer, annual celebrations, and visitor guidelines',
                    'intro' => '<p>Join the daily and festal celebration of Holy Mass at the Shrine of Our Lady of Kibeho. Schedules may vary on feast days and major pilgrimages — confirm with the Pilgrimage Office when planning a group visit.</p>',
                    'weeklyIntro' => '<p>Join the daily prayer of the Shrine — Mass, confession, and Marian devotion throughout the week. Sundays and Thursday processions are especially important for pilgrims.</p>',
                    'annualIntro' => '<p>Major feast days and annual celebrations draw pilgrims from Rwanda and around the world. Check dates before you travel.</p>',
                    'guidelinesTitle' => 'Guidelines of the Shrine',
                    'guidelines' => [
                        [
                            'title' => 'Dress modestly',
                            'text' => 'Dress modestly for church and outdoor prayer throughout the Shrine grounds.',
                            'tone' => 'caution',
                            'icon' => 'shirt',
                        ],
                        [
                            'title' => 'Arrive early on feast days',
                            'text' => 'Principal Masses draw large pilgrim crowds — arrive early and follow steward directions.',
                            'tone' => 'alert',
                            'icon' => 'clock',
                        ],
                        [
                            'title' => 'Respect silence',
                            'text' => 'Keep silence at apparition sites and during prayer in the compound.',
                            'tone' => 'caution',
                            'icon' => 'volume',
                        ],
                        [
                            'title' => 'Follow shrine stewards',
                            'text' => 'Stewards guide processions, seating, and crowd flow for safety and prayer.',
                            'tone' => 'info',
                            'icon' => 'users',
                        ],
                    ],
                    'cta' => [
                        'primary' => ['label' => 'Plan Your Pilgrimage', 'path' => '/pilgrimage/plan'],
                        'secondary' => ['label' => 'Request a Mass', 'path' => '/spirituality/mass-request'],
                    ],
                ],
            ],
            'shrine.faq' => [
                'label' => 'Shrine — FAQ',
                'content' => $this->mergeOld('our-lady.faq', ['title' => 'Frequently Asked Questions']),
            ],
            'pilgrimage.practical-guidelines' => [
                'label' => 'Pilgrimage — Practical Guidelines',
                'content' => array_merge($this->mergeOld('pilgrimage.practical-information', [
                    'title' => 'Practical Guidelines',
                    'subtitle' => 'Prepare well before you travel',
                ]), [
                    'intro' => '<p>Whether you come alone, with family, or as a parish group, these guidelines help your pilgrimage remain prayerful, safe, and well organised. Groups should register in advance using the form on this page.</p>',
                    'blocks' => [
                        [
                            'type' => 'heading',
                            'text' => 'Good conduct at the Shrine',
                        ],
                        [
                            'type' => 'list',
                            'items' => [
                                'No music or personal speakers around the Shrine',
                                'No musical instruments in the shrine compound',
                                'Keep phones on silent mode',
                                'Avoid personal conversations in places of prayer',
                                'Wear appropriate and modest clothing',
                                'Follow our community support channel for updates',
                                'Shop only from approved Shrine shops',
                                'Carry valid national ID or passport',
                                'Arrange health insurance before travelling',
                                'Confirm accommodation reservations in advance',
                            ],
                        ],
                    ],
                ]),
            ],
            'pilgrimage.how-to-get-here' => [
                'label' => 'Pilgrimage — How to Get Here',
                'content' => $this->mergeOld('pilgrimage.transportation', [
                    'title' => 'How to Get Here',
                    'subtitle' => 'Reaching Kibeho from Rwanda and abroad',
                ]),
            ],
            'pilgrimage.annual-celebrations' => [
                'label' => 'Pilgrimage — Annual Celebrations',
                'content' => [
                    'title' => 'Annual Celebrations',
                    'subtitle' => 'Feast days and recurring pilgrimages at Kibeho',
                    'intro' => '<p>Each year the Shrine welcomes national and international celebrations — especially the Feast of the Assumption on 15 August. Plan ahead for accommodation and group registration.</p>',
                ],
            ],
            'spirituality.prayer-intentions' => [
                'label' => 'Spirituality — Prayer Intentions',
                'content' => [
                    'title' => 'Prayer Intentions',
                    'subtitle' => 'Share your intention with the Shrine',
                    'intro' => '<p>Submit a prayer intention to be remembered at the Shrine. Your request is received privately by the pastoral team and is not published on the website.</p>',
                    'privacyNotice' => 'Your intention is for the Shrine only — it will not appear publicly.',
                ],
            ],
            'spirituality.mass-request' => [
                'label' => 'Spirituality — Mass Request',
                'content' => $this->mergeOld('spirituality.request-a-mass', [
                    'title' => 'Request a Mass',
                    'subtitle' => 'USD 2.50 · EUR 2.00 per Mass',
                    'intro' => '<p>Request that Holy Mass be offered for your intention on the date(s) you specify. The Mass will be celebrated whether or not you are present at the Shrine.</p>',
                ]),
            ],
            'spirituality.light-a-candle' => [
                'label' => 'Spirituality — Light a Candle',
                'content' => [
                    'title' => 'Light a Candle',
                    'subtitle' => 'A prayer burning at Kibeho',
                    'intro' => '<p>Light a candle at the Shrine for a loved one, a need, or a thanksgiving. Your dedication is received by the Shrine office.</p>',
                ],
            ],
            'spirituality.share-testimony' => [
                'label' => 'Spirituality — Share Testimony',
                'content' => [
                    'title' => 'Share Your Testimony',
                    'subtitle' => 'For the Shrine archives',
                    'intro' => '<p>Share how Kibeho has touched your life. Testimonies are received for the Shrine\'s pastoral use and are <strong>not published</strong> on this website unless you are separately invited to share publicly.</p>',
                    'privacyNotice' => 'This form is for the Shrine team only — not for public display.',
                ],
            ],
            'spirituality.processions' => [
                'label' => 'Spirituality — Processions',
                'content' => [
                    'title' => 'Processions',
                    'subtitle' => 'Walking in prayer with Our Lady',
                    'intro' => '<p>Processions are a living part of devotion at Kibeho — especially on Thursdays, during outdoor Mass in the shrine compound, and during annual celebrations.</p>',
                    'schedule' => [
                        'Every Thursday at 5:30 PM',
                        'During outdoor Mass in the shrine compound (not inside the church)',
                        'During annual celebrations and major feast days',
                    ],
                ],
            ],
            'spirituality.adoration-worship' => [
                'label' => 'Spirituality — Adoration & Worship',
                'content' => $this->mergeOld('shrine.eucharistic-adorations', [
                    'title' => 'Adoration & Worship',
                    'subtitle' => 'Silent prayer before the Lord',
                ]),
            ],
            'spirituality.confessions' => [
                'label' => 'Spirituality — Confessions',
                'content' => [
                    'title' => 'Confessions',
                    'subtitle' => 'The mercy of God at Kibeho',
                    'intro' => '<p>Confession is central to the message of conversion at Kibeho. Priests are available at announced times, especially on feast days and during pilgrimages.</p>',
                    'times' => ['Daily — as announced at the Shrine', 'Feast days — extended availability'],
                ],
            ],
            'spirituality.blessings' => [
                'label' => 'Spirituality — Blessings',
                'content' => [
                    'title' => 'Blessings',
                    'subtitle' => 'Sacramentals and pilgrim blessings',
                    'intro' => '<p>Pilgrims may request blessings for religious articles and for their journey. Please approach the pastoral team or priests at appropriate times outside liturgical celebrations.</p>',
                ],
            ],
            'spirituality.books' => [
                'label' => 'Spirituality — Books',
                'content' => [
                    'title' => 'Books',
                    'subtitle' => 'Read and deepen your devotion',
                    'intro' => '<p>Books about Kibeho, the apparitions, and Marian devotion are available at the Shrine. Browse recommended titles below.</p>',
                ],
            ],
            'news.our-channels' => [
                'label' => 'News — Our Channels',
                'content' => [
                    'title' => 'Our Channels',
                    'subtitle' => 'Follow the Shrine online',
                    'intro' => '<p>Stay connected with news, celebrations, and messages from Kibeho through our official channels.</p>',
                ],
            ],
            'news.broadcast' => [
                'label' => 'News — Broadcast',
                'content' => [
                    'title' => 'Broadcast',
                    'subtitle' => 'Live and recorded broadcasts from the Shrine',
                    'intro' => '<p>Follow liturgies and special celebrations broadcast from Kibeho.</p>',
                ],
            ],
            'news.audio' => [
                'label' => 'News — Audio',
                'content' => [
                    'title' => 'Audio',
                    'subtitle' => 'Listen to messages and reflections',
                    'intro' => '<p>Audio recordings from the Shrine — homilies, reflections, and pilgrim resources.</p>',
                ],
            ],
            'news.documentaries' => [
                'label' => 'News — Documentaries',
                'content' => [
                    'title' => 'Documentaries',
                    'subtitle' => 'Audio stories of the apparitions',
                    'intro' => '<p>Documentary audio about the apparitions of Kibeho and the lives of the visionaries.</p>',
                ],
            ],
        ];

        foreach ($pages as $key => $payload) {
            PageSection::updateOrCreate(
                ['key' => $key],
                ['label' => $payload['label'], 'content' => $payload['content']]
            );
        }
    }

    private function oldContent(string $key): array
    {
        $row = PageSection::query()->where('key', $key)->first();

        return is_array($row?->content) ? $row->content : [];
    }

    private function mergeOld(string $key, array $defaults): array
    {
        return array_merge($this->oldContent($key), $defaults);
    }

    private function seedMaryMessages(): void
    {
        if (MaryMessage::query()->exists()) {
            return;
        }

        $messages = [
            ['number' => 1, 'title' => 'Convert while there is still time', 'theme' => 'Conversion'],
            ['number' => 2, 'title' => 'Pray the Rosary daily', 'theme' => 'Prayer'],
            ['number' => 3, 'title' => 'Offer reparation for sins', 'theme' => 'Reparation'],
            ['number' => 4, 'title' => 'Seek reconciliation', 'theme' => 'Reconciliation'],
            ['number' => 5, 'title' => 'Live as children of the Mother of the Word', 'theme' => 'Discipleship'],
            ['number' => 6, 'title' => 'Repent and return to God', 'theme' => 'Conversion'],
            ['number' => 7, 'title' => 'Pray the Seven Sorrows Rosary', 'theme' => 'Devotion'],
            ['number' => 8, 'title' => 'Help the poor', 'theme' => 'Charity'],
            ['number' => 9, 'title' => 'Forgive one another', 'theme' => 'Reconciliation'],
            ['number' => 10, 'title' => 'Be witnesses of hope', 'theme' => 'Mission'],
        ];

        foreach ($messages as $index => $row) {
            MaryMessage::updateOrCreate(
                ['number' => $row['number']],
                [
                    'title' => $row['title'],
                    'theme' => $row['theme'],
                    'sort_order' => $index + 1,
                    'is_published' => true,
                ]
            );
        }
    }

    private function updateHomeSections(): void
    {
        PageSection::updateOrCreate(['key' => 'home.hero'], [
            'label' => 'Home Hero',
            'content' => array_merge($this->oldContent('home.hero'), [
                'ctas' => [
                    'primary' => ['label' => 'Discover the Shrine', 'link' => '/shrine'],
                    'secondary' => ['label' => 'Plan Your Pilgrimage', 'link' => '/pilgrimage/plan'],
                ],
            ]),
        ]);

        PageSection::updateOrCreate(['key' => 'home.welcome'], [
            'label' => 'Home Welcome',
            'content' => array_merge($this->oldContent('home.welcome'), [
                'cta' => ['label' => 'Welcome to the Shrine', 'path' => '/shrine/welcome'],
            ]),
        ]);

        PageSection::updateOrCreate(['key' => 'home.activities'], [
            'label' => 'Home — Main Places of the Shrine',
            'content' => array_merge($this->oldContent('home.activities'), [
                'heading' => 'Main Places of the Shrine',
                'subline' => 'Walk the Chapel of the Seven Sorrows, apparition sites, the Holy Spring, and the ways of prayer across the hillside.',
                'primaryCta' => ['label' => 'Explore the Shrine', 'path' => '/shrine'],
                'secondaryCta' => ['label' => 'Welcome', 'path' => '/shrine/welcome'],
            ]),
        ]);

        PageSection::updateOrCreate(['key' => 'home.quickLinks'], [
            'label' => 'Home — Quick links',
            'content' => [
                'links' => [
                    ['id' => 'shrine', 'icon' => 'info', 'label' => 'The Shrine', 'text' => 'Welcome & message', 'path' => '/shrine'],
                    ['id' => 'plan', 'icon' => 'users', 'label' => 'Pilgrimage', 'text' => 'Plan your visit', 'path' => '/pilgrimage/plan'],
                    ['id' => 'pray', 'icon' => 'calendar', 'label' => 'Spirituality', 'text' => 'Pray with us', 'path' => '/spirituality'],
                    ['id' => 'donate', 'icon' => 'heart', 'label' => 'Support', 'text' => 'Projects & gifts', 'path' => '/support'],
                ],
            ],
        ]);
    }
}
