<?php

namespace App\Services;

use App\Models\AudioItem;
use App\Models\Community;
use App\Models\Facility;
use App\Models\MaryMessage;
use App\Models\MassSchedule;
use App\Models\Media;
use App\Models\NewsPost;
use App\Models\OfficialPrayer;
use App\Models\PageSection;
use App\Models\PastoralTeamMember;
use App\Models\SacredPlace;
use App\Models\Setting;
use App\Models\ShrineProject;
use App\Models\SpiritualBook;
use App\Models\UpcomingPilgrimage;
use App\Models\Video;
use App\Models\Visionary;
use App\Support\Locale;
use Illuminate\Support\Collection;

class CmsAuditService
{
    public function report(): array
    {
        $i18n = Locale::pack();
        $default = $i18n['defaultLocale'];
        $languages = $i18n['languages'];

        $settings = $this->settingsSection();
        $setup = $this->setupSection();
        $pages = $this->pagesSection($default, $languages);
        $directories = $this->directories($default, $languages);
        $translations = $this->translationsSection($i18n, $pages, $directories);

        $weighted = [
            $settings['percent'],
            $setup['percent'],
            $pages['percent'],
        ];
        foreach ($directories as $section) {
            $weighted[] = $section['percent'];
        }
        $nonDefault = array_values(array_filter(
            $translations['languages'],
            fn (array $lang) => ! $lang['isDefault']
        ));
        if ($nonDefault) {
            $weighted[] = (int) round(array_sum(array_column($nonDefault, 'percent')) / count($nonDefault));
        }

        $overall = (int) round(array_sum($weighted) / max(count($weighted), 1));
        $critical = $this->criticalItems($settings, $setup, $pages, $directories, $translations);

        return [
            'overall' => [
                'percent' => $overall,
                'status' => $this->status($overall),
                'critical' => count($critical),
            ],
            'settings' => $settings,
            'setup' => $setup,
            'pages' => $pages,
            'directories' => $directories,
            'translations' => $translations,
            'critical' => $critical,
        ];
    }

    private function settingsSection(): array
    {
        $company = $this->setting('company');
        $contact = $this->setting('contact');
        $info = is_array($contact['info'] ?? null) ? $contact['info'] : [];
        $map = is_array($contact['map'] ?? null) ? $contact['map'] : [];
        $hero = is_array($contact['hero'] ?? null) ? $contact['hero'] : [];
        $socials = is_array($company['socials'] ?? null) ? $company['socials'] : [];

        $offerings = $this->setting('offerings');
        $accounts = is_array($offerings['accounts'] ?? null) ? $offerings['accounts'] : [];
        $hasBank = collect($accounts)->contains(fn ($row) => is_array($row) && $this->filled($row['number'] ?? null));

        $checks = [
            $this->check('Site name', $this->filled($company['name'] ?? null), '/admin/settings?tab=brand'),
            $this->check('Tagline', $this->filled($company['tagline'] ?? null), '/admin/settings?tab=brand'),
            $this->check('Logo', $this->filled($company['logo'] ?? null), '/admin/settings?tab=brand'),
            $this->check('Phone', $this->filled($company['phone'] ?? null) && ! $this->placeholderContact($company['phone'] ?? ''), '/admin/settings?tab=contact'),
            $this->check('Second phone', $this->filled($company['phone2'] ?? $info['phone2'] ?? null), '/admin/settings?tab=contact'),
            $this->check('Email', $this->filled($company['email'] ?? null) && ! str_contains(strtolower((string) ($company['email'] ?? '')), 'kibehosanctuary.org'), '/admin/settings?tab=contact'),
            $this->check('WhatsApp', $this->filled($company['whatsapp'] ?? null) && ! $this->placeholderContact($company['whatsapp'] ?? ''), '/admin/settings?tab=contact'),
            $this->check('Postal address', $this->filled($company['address'] ?? $info['address'] ?? null), '/admin/settings?tab=contact'),
            $this->check('Plus Code / map pin', $this->filled($info['plusCode'] ?? $map['label'] ?? null), '/admin/settings?tab=map'),
            $this->check('How to reach Kibeho', $this->filled($info['localization'] ?? null) || count($info['routes'] ?? []) > 0, '/admin/settings?tab=contact-page'),
            $this->check('Contact page heading', $this->filled($hero['headline'] ?? null) || $this->filled($info['heading'] ?? null), '/admin/settings?tab=contact-page'),
            $this->check('Map embed', $this->filled($map['embedSrc'] ?? null), '/admin/settings?tab=map'),
            $this->check('Live social links', collect($socials)->contains(fn ($row) => is_array($row) && $this->realSocial($row['href'] ?? '')), '/admin/settings?tab=contact'),
            $this->check(
                $this->filled($offerings['onlinePaymentUrl'] ?? null)
                    ? 'Online payment link'
                    : 'Donation bank accounts (shown until online payment is set)',
                $this->filled($offerings['onlinePaymentUrl'] ?? null) || $hasBank,
                '/admin/settings?tab=offerings'
            ),
            $this->check('MoMo Pay code', $this->filled($offerings['momoCode'] ?? null), '/admin/settings?tab=offerings'),
        ];

        return $this->section('settings', 'Settings', '/admin/settings', $checks);
    }

    private function setupSection(): array
    {
        $nav = $this->setting('navigation');
        $primary = is_array($nav['primaryNav'] ?? null) ? $nav['primaryNav'] : [];
        $hero = PageSection::query()->where('key', 'home.hero')->first();
        $heroContent = is_array($hero?->content) ? $hero->content : [];
        $slides = is_array($heroContent['slides'] ?? null) ? $heroContent['slides'] : [];
        $hasSlide = collect($slides)->contains(fn ($slide) => $this->filled($slide['src'] ?? null));
        $hasCover = $this->filled($heroContent['coverImage'] ?? null);
        $header = PageSection::query()->where('key', 'headers.default')->first();
        $headerImage = is_array($header?->content) ? ($header->content['backgroundImage'] ?? '') : '';

        $checks = [
            $this->check('Main menu has items', count($primary) > 0, '/admin/menus'),
            $this->check('Home hero photo or slides', $hasSlide || $hasCover, '/admin/home-hero'),
            $this->check('Home hero heading', $this->filled($heroContent['heading'] ?? null), '/admin/home-hero'),
            $this->check('Default page header image', $this->filled($headerImage), '/admin/sections?tab=default-header'),
        ];

        return $this->section('setup', 'Menus & home', '/admin/menus', $checks);
    }

    private function pagesSection(string $default, array $languages): array
    {
        $rows = PageSection::query()
            ->where('key', 'not like', 'headers.%')
            ->where('key', '!=', 'home.hero')
            ->orderBy('label')
            ->get();

        $items = [];
        $complete = 0;
        $withBody = 0;
        $points = 0;
        $max = 0;

        foreach ($rows as $row) {
            $content = is_array($row->content) ? $row->content : [];
            $title = $this->filled($content['title'] ?? $content['heading'] ?? $row->label);
            $intro = $this->filled($content['intro'] ?? $content['text'] ?? $content['caption'] ?? null);
            $blocks = is_array($content['blocks'] ?? null) ? $content['blocks'] : [];
            $itemsList = is_array($content['items'] ?? null) ? $content['items'] : [];
            $hero = $this->filled($content['heroImage'] ?? $content['image'] ?? $content['coverImage'] ?? null);
            $hasBody = $intro || count($blocks) > 0 || count($itemsList) > 0;
            $okCount = (int) $title + (int) $hasBody;
            $itemPercent = $this->pct($okCount, 2);
            if ($hasBody) {
                $withBody++;
            }
            if ($itemPercent >= 90) {
                $complete++;
            }
            $points += $okCount;
            $max += 2;

            $missing = [];
            if (! $title) {
                $missing[] = 'Title';
            }
            if (! $hasBody) {
                $missing[] = 'Text or layout';
            }
            if (! $hero) {
                $missing[] = 'Own header photo (using site default until you add one)';
            }

            $items[] = [
                'id' => $row->key,
                'title' => $row->label ?: $row->key,
                'href' => '/admin/sections',
                'percent' => $itemPercent,
                'missing' => $missing,
            ];
        }

        $percent = $this->pct($points, max($max, 1));
        $defaultPhotoCount = count(array_filter(
            $items,
            fn (array $item) => in_array('Own header photo (using site default until you add one)', $item['missing'] ?? [], true)
        ));
        $incomplete = array_values(array_filter($items, fn (array $item) => count($item['missing'] ?? []) > 0));

        return [
            'id' => 'pages',
            'label' => 'Site pages',
            'href' => '/admin/sections',
            'count' => $rows->count(),
            'complete' => $complete,
            'withBody' => $withBody,
            'defaultPhotoCount' => $defaultPhotoCount,
            'percent' => $percent,
            'status' => $this->status($percent),
            'incomplete' => array_slice($incomplete, 0, 40),
        ];
    }

    private function directories(string $default, array $languages): array
    {
        return [
            $this->collection('accommodations', 'Accommodations', '/admin/projects', Facility::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->cover_image) || $this->filled($row->featured_image)],
                ['id' => 'description', 'label' => 'Description', 'fn' => fn ($row) => $this->filled($row->description)],
                ['id' => 'gallery', 'label' => 'Gallery', 'fn' => fn ($row) => count($row->gallery ?? []) > 0],
                ['id' => 'amenities', 'label' => 'Amenities', 'fn' => fn ($row) => count($row->amenities ?? []) > 0],
                ['id' => 'services', 'label' => 'Services', 'fn' => fn ($row) => count($row->related_programs ?? []) > 0],
                ['id' => 'contact', 'label' => 'Phone or email', 'fn' => fn ($row) => $this->filled($row->phone) || $this->filled($row->email)],
                ['id' => 'website', 'label' => 'Website or booking', 'fn' => fn ($row) => $this->filled($row->website_url) || $this->filled($row->booking_url)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'description'], $default, $languages),
            $this->collection('communities', 'Communities', '/admin/communities', Community::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->name, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->cover_image)],
                ['id' => 'description', 'label' => 'Description', 'fn' => fn ($row) => $this->filled($row->description)],
                ['id' => 'location', 'label' => 'Location', 'fn' => fn ($row) => $this->filled($row->location)],
                ['id' => 'gallery', 'label' => 'Gallery', 'fn' => fn ($row) => count($row->gallery ?? []) > 0],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['name', 'description', 'location'], $default, $languages),
            $this->collection('articles', 'Articles / News', '/admin/blog', NewsPost::query()->orderByDesc('id')->get(), fn ($row) => $row->title, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->cover_image)],
                ['id' => 'body', 'label' => 'Article body', 'fn' => fn ($row) => $this->filled($row->body)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'excerpt', 'body'], $default, $languages),
            $this->collection('events', 'Pilgrimage events', '/admin/upcoming-pilgrimages', UpcomingPilgrimage::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->image)],
                ['id' => 'description', 'label' => 'Description', 'fn' => fn ($row) => $this->filled($row->description) || $this->filled($row->short_description)],
                ['id' => 'date', 'label' => 'Date', 'fn' => fn ($row) => $this->filled($row->starts_on)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'description', 'short_description'], $default, $languages),
            $this->collection('visionaries', 'Visionaries', '/admin/visionaries', Visionary::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->name, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->photo)],
                ['id' => 'description', 'label' => 'Description', 'fn' => fn ($row) => $this->filled($row->description)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['name', 'description'], $default, $languages),
            $this->collection('mary-messages', 'Messages of Mary', '/admin/mary-messages', MaryMessage::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title, [
                ['id' => 'body', 'label' => 'Message body', 'fn' => fn ($row) => $this->filled($row->body) || $this->filled($row->summary)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'summary', 'body'], $default, $languages),
            $this->collection('projects', 'Development projects', '/admin/shrine-projects', ShrineProject::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->cover_image)],
                ['id' => 'description', 'label' => 'Description', 'fn' => fn ($row) => $this->filled($row->description) || $this->filled($row->short_description)],
                ['id' => 'problem', 'label' => 'The need', 'fn' => fn ($row) => $this->filled($row->problem)],
                ['id' => 'solution', 'label' => 'What we will do', 'fn' => fn ($row) => $this->filled($row->solution)],
                ['id' => 'impact', 'label' => 'Impact', 'fn' => fn ($row) => $this->filled($row->impact_local) || $this->filled($row->impact_global) || $this->filled($row->impact_church)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'description', 'short_description', 'problem', 'solution', 'impact_local', 'impact_global', 'impact_church'], $default, $languages),
            $this->collection('apparition-sites', 'Apparition sites', '/admin/apparition-sites', SacredPlace::query()->where('type', 'apparition_site')->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->name, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->cover_image)],
                ['id' => 'description', 'label' => 'Description', 'fn' => fn ($row) => $this->filled($row->description) || $this->filled($row->short_description)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['name', 'description', 'short_description'], $default, $languages),
            $this->collection('main-places', 'Main places', '/admin/main-places', SacredPlace::query()->where('type', 'main_place')->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->name, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->cover_image)],
                ['id' => 'description', 'label' => 'Description', 'fn' => fn ($row) => $this->filled($row->description) || $this->filled($row->short_description)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['name', 'description', 'short_description'], $default, $languages),
            $this->collection('mass-schedules', 'Mass schedules', '/admin/mass-schedules', MassSchedule::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title ?: $row->day_label, [
                ['id' => 'time', 'label' => 'Time', 'fn' => fn ($row) => $this->filled($row->time_label) || $this->filled($row->starts_at_time)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'day_label', 'notes'], $default, $languages),
            $this->collection('pastoral-team', 'Pastoral team', '/admin/pastoral-team', PastoralTeamMember::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->name, [
                ['id' => 'photo', 'label' => 'Own photo', 'fn' => fn ($row) => $this->filled($row->photo)],
                ['id' => 'role', 'label' => 'Role', 'fn' => fn ($row) => $this->filled($row->role)],
                ['id' => 'bio', 'label' => 'Bio', 'fn' => fn ($row) => $this->filled($row->bio)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['name', 'role', 'bio'], $default, $languages),
            $this->collection('official-prayers', 'Official prayers', '/admin/official-prayers', OfficialPrayer::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title, [
                ['id' => 'description', 'label' => 'Prayer text', 'fn' => fn ($row) => $this->filled($row->description)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'description'], $default, $languages),
            $this->collection('spiritual-books', 'Spiritual books', '/admin/spiritual-books', SpiritualBook::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title, [
                ['id' => 'cover', 'label' => 'Cover image', 'fn' => fn ($row) => $this->filled($row->cover_image)],
                ['id' => 'description', 'label' => 'Description', 'fn' => fn ($row) => $this->filled($row->description)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'description'], $default, $languages),
            $this->collection('audio', 'Audio & broadcast', '/admin/audio-items', AudioItem::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title, [
                ['id' => 'url', 'label' => 'Audio URL', 'fn' => fn ($row) => $this->filled($row->audio_url)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'description'], $default, $languages),
            $this->collection('videos', 'Videos (YouTube)', '/admin/videos', Video::query()->orderBy('sort_order')->orderBy('id')->get(), fn ($row) => $row->title, [
                ['id' => 'url', 'label' => 'YouTube URL', 'fn' => fn ($row) => $this->filled($row->youtube_url) || $this->filled($row->youtube_id)],
                ['id' => 'published', 'label' => 'Published', 'fn' => fn ($row) => (bool) $row->is_published],
            ], ['title', 'description'], $default, $languages),
            $this->galleryDirectory(),
        ];
    }

    private function galleryDirectory(): array
    {
        $default = Locale::default();
        $languages = Locale::pack()['languages'];
        $rows = Media::query()->where('show_in_gallery', true)->get();
        $count = $rows->count();
        $percent = $count >= 6 ? 100 : ($count >= 3 ? 70 : ($count >= 1 ? 40 : 0));

        $translations = [];
        foreach ($languages as $lang) {
            $code = $lang['code'] ?? null;
            if (! $code) {
                continue;
            }
            $ok = 0;
            foreach ($rows as $row) {
                if ($code === $default) {
                    if ($this->filled($row->alt)) {
                        $ok++;
                    }
                    continue;
                }
                $pack = is_array($row->translations[$code] ?? null) ? $row->translations[$code] : [];
                if ($this->filled($pack['alt'] ?? null) || $this->filled($row->alt)) {
                    $ok++;
                }
            }
            $translations[$code] = $this->pct($ok, max($count, 1));
        }

        return [
            'id' => 'gallery',
            'label' => 'Media gallery',
            'href' => '/admin/gallery',
            'count' => $count,
            'published' => $count,
            'percent' => $percent,
            'status' => $this->status($percent),
            'min' => 3,
            'empty' => $count === 0,
            'fields' => [['id' => 'visible', 'label' => 'Visible in gallery'], ['id' => 'alt', 'label' => 'Alt text']],
            'incomplete' => $count < 3 ? [[
                'id' => 'gallery',
                'title' => $count ? "{$count} gallery image(s) — add a few more" : 'No gallery images yet',
                'href' => '/admin/gallery',
                'percent' => $percent,
                'missing' => ['At least 3 public gallery images'],
            ]] : [],
            'translations' => $translations,
        ];
    }

    private function collection(
        string $id,
        string $label,
        string $href,
        Collection $rows,
        callable $title,
        array $fields,
        array $transFields,
        string $default,
        array $languages,
        int $min = 1
    ): array {
        $fieldCount = max(count($fields), 1);
        $incomplete = [];
        $points = 0;
        $max = 0;
        $published = 0;
        $transHits = [];
        foreach ($languages as $lang) {
            if ($lang['code'] !== $default) {
                $transHits[$lang['code']] = ['ok' => 0, 'total' => 0];
            }
        }

        foreach ($rows as $row) {
            $ok = 0;
            $missing = [];
            foreach ($fields as $field) {
                $pass = (bool) ($field['fn'])($row);
                if ($pass) {
                    $ok++;
                } else {
                    $missing[] = $field['label'];
                }
            }
            $points += $ok;
            $max += $fieldCount;
            if (! empty($row->is_published)) {
                $published++;
            }
            $itemPercent = $this->pct($ok, $fieldCount);
            if ($itemPercent < 90 || $missing) {
                $incomplete[] = [
                    'id' => $row->id ?? $row->slug ?? $id,
                    'title' => (string) ($title($row) ?: 'Untitled'),
                    'href' => $href,
                    'percent' => $itemPercent,
                    'missing' => $missing,
                ];
            }

            $bag = is_array($row->translations ?? null) ? $row->translations : [];
            foreach ($transHits as $code => $_) {
                $transHits[$code]['total']++;
                $pack = is_array($bag[$code] ?? null) ? $bag[$code] : [];
                $has = false;
                foreach ($transFields as $name) {
                    if ($this->filled($pack[$name] ?? null)) {
                        $has = true;
                        break;
                    }
                }
                if ($has) {
                    $transHits[$code]['ok']++;
                }
            }
        }

        $count = $rows->count();
        $percent = $count === 0 ? 0 : $this->pct($points, max($max, 1));
        if ($count < $min) {
            $percent = min($percent, 20);
        }

        $translations = [];
        foreach ($transHits as $code => $hit) {
            $translations[$code] = $this->pct($hit['ok'], max($hit['total'], 1));
        }

        return [
            'id' => $id,
            'label' => $label,
            'href' => $href,
            'count' => $count,
            'published' => $published,
            'percent' => $percent,
            'status' => $this->status($percent),
            'min' => $min,
            'empty' => $count === 0,
            'fields' => array_map(fn (array $field) => ['id' => $field['id'], 'label' => $field['label']], $fields),
            'incomplete' => array_slice($incomplete, 0, 12),
            'translations' => $translations,
        ];
    }

    private function translationsSection(array $i18n, array $pages, array $directories): array
    {
        $default = $i18n['defaultLocale'];
        $strings = is_array($i18n['strings'] ?? null) ? $i18n['strings'] : [];
        $defaultKeys = [];
        foreach ($strings as $key => $values) {
            if (is_array($values) && $this->filled($values[$default] ?? $values['en'] ?? null)) {
                $defaultKeys[] = $key;
            }
        }
        $uiTotal = max(count($defaultKeys), 1);
        $allPageItems = PageSection::query()
            ->where('key', 'not like', 'headers.%')
            ->where('key', '!=', 'home.hero')
            ->get();

        $out = [];
        foreach ($i18n['languages'] as $lang) {
            $code = $lang['code'];
            $isDefault = $code === $default;
            $uiOk = 0;
            if ($isDefault) {
                $uiOk = $uiTotal;
            } else {
                foreach ($defaultKeys as $key) {
                    $values = $strings[$key] ?? [];
                    if (is_array($values) && $this->filled($values[$code] ?? null)) {
                        $uiOk++;
                    }
                }
            }
            $uiPercent = $this->pct($uiOk, $uiTotal);

            if ($isDefault) {
                $contentPercent = 100;
            } else {
                $contentOk = 0;
                $contentTotal = 0;
                foreach ($allPageItems as $row) {
                    $contentTotal++;
                    $pack = is_array($row->translations[$code] ?? null) ? $row->translations[$code] : [];
                    $overlay = is_array($pack['content'] ?? null) ? $pack['content'] : $pack;
                    if ($this->filled($overlay['title'] ?? $overlay['heading'] ?? $overlay['intro'] ?? $overlay['text'] ?? $pack['label'] ?? null)) {
                        $contentOk++;
                    }
                }
                foreach ($directories as $dir) {
                    if (! isset($dir['translations'][$code]) || ($dir['count'] ?? 0) === 0) {
                        continue;
                    }
                    $contentTotal += $dir['count'];
                    $contentOk += (int) round(($dir['translations'][$code] / 100) * $dir['count']);
                }
                $contentPercent = $this->pct($contentOk, max($contentTotal, 1));
            }

            $percent = $isDefault ? 100 : (int) round(($uiPercent * 0.35) + ($contentPercent * 0.65));
            $out[] = [
                'code' => $code,
                'label' => $lang['nativeLabel'] ?? $lang['label'] ?? $code,
                'flag' => $lang['flag'] ?? '',
                'public' => (bool) ($lang['public'] ?? false),
                'isDefault' => $isDefault,
                'percent' => $percent,
                'status' => $this->status($percent),
                'uiPercent' => $uiPercent,
                'contentPercent' => $isDefault ? 100 : $contentPercent,
                'href' => '/admin/translations',
            ];
        }

        return [
            'defaultLocale' => $default,
            'href' => '/admin/translations',
            'languages' => $out,
        ];
    }

    private function criticalItems(array $settings, array $setup, array $pages, array $directories, array $translations): array
    {
        $items = [];
        foreach ([$settings, $setup] as $section) {
            foreach ($section['checks'] as $check) {
                if (! $check['ok']) {
                    $items[] = [
                        'label' => $check['label'],
                        'href' => $check['href'],
                        'area' => $section['label'],
                        'reason' => 'Not set yet',
                    ];
                }
            }
        }

        if (($pages['percent'] ?? 100) < 70) {
            $items[] = [
                'label' => 'Several site pages still need title or body text',
                'href' => '/admin/sections',
                'area' => 'Site pages',
                'reason' => ($pages['percent'] ?? 0).'% complete',
            ];
        }

        $missingPhotos = (int) ($pages['defaultPhotoCount'] ?? 0);
        if ($missingPhotos >= 5) {
            $items[] = [
                'label' => $missingPhotos.' pages still use the default header photo',
                'href' => '/admin/sections',
                'area' => 'Site pages',
                'reason' => 'Add a unique image on each page when you have one',
            ];
        }

        $listingPhotos = 0;
        foreach ($directories as $dir) {
            foreach ($dir['incomplete'] ?? [] as $row) {
                if (in_array('Own photo', $row['missing'] ?? [], true)) {
                    $listingPhotos++;
                }
            }
        }
        if ($listingPhotos >= 5) {
            $items[] = [
                'label' => $listingPhotos.' listings still use the default photo',
                'href' => '/admin/audit',
                'area' => 'Directories',
                'reason' => 'Upload a unique photo when one is available',
            ];
        }

        foreach ($directories as $dir) {
            if (! empty($dir['empty'])) {
                $items[] = [
                    'label' => 'Add at least one '.$dir['label'].' item',
                    'href' => $dir['href'],
                    'area' => $dir['label'],
                    'reason' => 'None created yet',
                ];
                continue;
            }
            if (($dir['percent'] ?? 100) < 60) {
                $first = $dir['incomplete'][0]['title'] ?? $dir['label'];
                $items[] = [
                    'label' => $dir['label'].' needs more detail (e.g. '.$first.')',
                    'href' => $dir['href'],
                    'area' => $dir['label'],
                    'reason' => ($dir['percent'] ?? 0).'% complete',
                ];
            }
        }

        foreach ($translations['languages'] as $lang) {
            if ($lang['isDefault'] || $lang['percent'] >= 50) {
                continue;
            }
            $items[] = [
                'label' => trim(($lang['flag'] ?? '').' '.$lang['label']).' translation is still low',
                'href' => '/admin/translations',
                'area' => 'Translations',
                'reason' => $lang['percent'].'% translated',
            ];
        }

        return array_slice($items, 0, 20);
    }

    private function section(string $id, string $label, string $href, array $checks): array
    {
        $ok = count(array_filter($checks, fn (array $check) => $check['ok']));
        $percent = $this->pct($ok, max(count($checks), 1));

        return [
            'id' => $id,
            'label' => $label,
            'href' => $href,
            'percent' => $percent,
            'status' => $this->status($percent),
            'checks' => $checks,
        ];
    }

    private function check(string $label, bool $ok, string $href): array
    {
        return compact('label', 'ok', 'href');
    }

    private function setting(string $key): array
    {
        $value = Setting::query()->where('key', $key)->value('value');
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            $value = is_array($decoded) ? $decoded : [];
        }

        return is_array($value) ? $value : [];
    }

    private function filled(mixed $value): bool
    {
        if (is_array($value)) {
            return collect($value)->contains(fn ($item) => $this->filled($item));
        }
        $text = html_entity_decode(strip_tags((string) $value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = trim(preg_replace('/\s+/u', ' ', $text) ?? '');

        return $text !== '';
    }

    private function placeholderContact(string $value): bool
    {
        $digits = preg_replace('/\D+/', '', $value) ?? '';

        return str_contains($digits, '788123456') || str_contains($value, '123 456');
    }

    private function realSocial(string $href): bool
    {
        $href = trim($href);
        if ($href === '' || ! preg_match('#^https?://#i', $href)) {
            return false;
        }
        $host = strtolower((string) parse_url($href, PHP_URL_HOST));
        $path = trim((string) parse_url($href, PHP_URL_PATH), '/');
        $placeholderHosts = [
            'facebook.com', 'www.facebook.com',
            'instagram.com', 'www.instagram.com',
            'youtube.com', 'www.youtube.com',
            'twitter.com', 'www.twitter.com', 'x.com', 'www.x.com',
        ];

        return ! (in_array($host, $placeholderHosts, true) && $path === '');
    }

    private function pct(int $ok, int $total): int
    {
        if ($total <= 0) {
            return 0;
        }

        return (int) round(100 * $ok / $total);
    }

    private function status(int $percent): string
    {
        if ($percent >= 90) {
            return 'ready';
        }
        if ($percent >= 70) {
            return 'good';
        }
        if ($percent >= 40) {
            return 'needs_work';
        }

        return 'missing';
    }
}
