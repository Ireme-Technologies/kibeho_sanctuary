<?php

namespace App\Services;

use App\Models\Media;
use App\Models\Setting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SiteAssetService
{
    private const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'];

    private const REMOVED_SETTING_KEY = 'site_removed_assets';

    public function __construct(private ImageOptimizer $optimizer) {}

    public function inventory(): array
    {
        $this->pruneRemovedFiles();
        $company = $this->company();

        return [
            'branding' => $this->branding($company),
            'site' => $this->siteImages($company),
        ];
    }

    public function replacePublicPath(string $rawPath, UploadedFile $file, ?string $role = null): array
    {
        $relative = $this->normalizePublicPath($rawPath);
        $this->unmarkRemoved($relative);
        $processed = $this->optimizer->process($file);
        $written = $this->writePublicFile($relative, $processed['contents']);
        $versioned = '/'.$relative.'?v='.time();

        if (in_array($role, ['logo', 'favicon', 'preloader'], true)) {
            $this->updateCompanyField($role === 'preloader' ? 'preloaderLogo' : $role, $versioned);
        }

        return [
            'path' => $relative,
            'url' => $versioned,
            'written' => $written,
            'size' => $processed['size'],
            'mime' => $processed['mime'],
        ];
    }

    public function replaceMedia(Media $media, UploadedFile $file): Media
    {
        $processed = $this->optimizer->process($file);
        Storage::disk($media->disk ?: 'public')->put($media->path, $processed['contents']);

        $baseUrl = '/storage/'.ltrim($media->path, '/');
        $oldUrl = $media->url;
        $newUrl = $baseUrl.'?v='.time();

        $media->update([
            'url' => $newUrl,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $processed['mime'],
            'size' => $processed['size'],
            'width' => $processed['width'] ?: null,
            'height' => $processed['height'] ?: null,
        ]);

        $this->rewriteStoredUrls($oldUrl, $newUrl);

        return $media->fresh();
    }

    public function deleteMediaRecord(Media $media): void
    {
        $this->rewriteStoredUrls($media->url, '');
        Storage::disk($media->disk ?: 'public')->delete($media->path);
        $media->delete();
    }

    /**
     * Flag existing uploads (or copy a few bundled sanctuary photos) into the public gallery once.
     */
    public function ensurePublicGallery(int $limit = 8): int
    {
        if (Setting::query()->where('key', 'public_gallery_seeded')->exists()) {
            return 0;
        }

        $added = 0;

        if (! Media::query()->where('show_in_gallery', true)->exists()) {
            $sort = (int) Media::query()->max('gallery_sort');

            $existing = Media::query()
                ->where('mime_type', 'like', 'image/%')
                ->orderByDesc('id')
                ->limit($limit)
                ->get();

            if ($existing->isNotEmpty()) {
                foreach ($existing as $media) {
                    $sort++;
                    $media->update([
                        'show_in_gallery' => true,
                        'gallery_sort' => $sort,
                    ]);
                    $added++;
                }
            } else {
                $candidates = [
                    'images/sanctuary/hero.jpg',
                    'images/sanctuary/welcome.jpg',
                    'images/sanctuary/church.jpg',
                    'images/sanctuary/hills.jpg',
                    'images/sanctuary/mary.jpg',
                    'images/sanctuary/church-wide.jpg',
                    'images/sanctuary/activity-candle.jpg',
                    'images/sanctuary/activity-spring.jpg',
                ];
                foreach ($candidates as $relative) {
                    if ($added >= $limit) {
                        break;
                    }
                    $abs = $this->firstExisting($relative);
                    if (! $abs) {
                        continue;
                    }
                    $sort++;
                    $this->importPublicFileToGallery($abs, $relative, $sort);
                    $added++;
                }
            }
        }

        Setting::updateOrCreate(
            ['key' => 'public_gallery_seeded'],
            ['value' => ['count' => $added, 'at' => now()->toIso8601String()]]
        );

        return $added;
    }

    /**
     * @return list<array{area: string, label: string, adminHref: string|null}>
     */
    public function findUsages(string $rawUrl): array
    {
        $targets = $this->urlMatchSet($rawUrl);
        if (! $targets) {
            return [];
        }

        $hits = [];
        $record = function (string $area, string $label, ?string $href = null) use (&$hits) {
            $key = $area.'|'.$label;
            if (! isset($hits[$key])) {
                $hits[$key] = [
                    'area' => $area,
                    'label' => $label,
                    'adminHref' => $href,
                ];
            }
        };

        foreach (Setting::query()->get() as $setting) {
            if ($setting->key === 'public_gallery_seeded' || $setting->key === self::REMOVED_SETTING_KEY) {
                continue;
            }
            if (! $this->valueContainsUrl($setting->value, $targets)) {
                continue;
            }
            $record(
                $setting->key === 'company' ? 'Organisation settings' : 'Settings',
                $this->settingUsageLabel($setting, $targets),
                '/admin/settings'
            );
        }

        if (Schema::hasTable('page_sections')) {
            $cols = ['key', 'label', 'content'];
            if (Schema::hasColumn('page_sections', 'translations')) {
                $cols[] = 'translations';
            }
            foreach (DB::table('page_sections')->get($cols) as $row) {
                $content = json_decode($row->content ?? '', true);
                $translations = isset($row->translations) ? json_decode($row->translations ?? '', true) : null;
                if ($this->valueContainsUrl($content, $targets) || $this->valueContainsUrl($translations, $targets)) {
                    $record('Pages', $row->label ?: $row->key, '/admin/sections');
                }
            }
        }

        foreach ($this->contentUsageTables() as $table => $meta) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            $titleCol = Schema::hasColumn($table, $meta['title']) ? $meta['title'] : null;
            $columns = array_values(array_filter(
                $meta['columns'],
                fn ($col) => Schema::hasColumn($table, $col)
            ));
            if (! $columns) {
                continue;
            }
            $select = array_values(array_unique(array_filter(['id', $titleCol, ...$columns, $meta['extra'] ?? null])));
            foreach (DB::table($table)->get($select) as $row) {
                $matched = false;
                foreach ($columns as $col) {
                    $decoded = json_decode($row->{$col} ?? '', true);
                    $value = $decoded === null ? $row->{$col} : $decoded;
                    if ($this->valueContainsUrl($value, $targets)) {
                        $matched = true;
                        break;
                    }
                }
                if (! $matched) {
                    continue;
                }
                $label = $titleCol ? (string) ($row->{$titleCol} ?? '') : '';
                $href = $meta['href'];
                if ($table === 'sacred_places' && isset($row->type)) {
                    $href = ($row->type ?? '') === 'apparition_site'
                        ? '/admin/apparition-sites'
                        : '/admin/churches';
                }
                $record($meta['area'], $label !== '' ? $label : $meta['area'].' #'.$row->id, $href);
            }
        }

        $inGallery = Media::query()
            ->where('show_in_gallery', true)
            ->get(['url', 'original_name']);
        foreach ($inGallery as $media) {
            if ($this->valueContainsUrl($media->url, $targets)) {
                $record('Public gallery', $media->original_name ?: 'Shown on /gallery', '/admin/gallery');
                break;
            }
        }

        return array_values($hits);
    }

    private function branding(array $company): array
    {
        $items = [
            [
                'role' => 'logo',
                'label' => 'Site logo',
                'hint' => 'Header, footer, and admin.',
                'path' => 'images/logo/logo-transparent.png',
                'current' => $company['logo'] ?? null,
            ],
            [
                'role' => 'favicon',
                'label' => 'Favicon',
                'hint' => 'Browser tab icon.',
                'path' => 'images/logo/favicon.png',
                'current' => $company['favicon'] ?? null,
            ],
            [
                'role' => 'preloader',
                'label' => 'Preloader mark',
                'hint' => 'Shown while pages load. Use the Kibeho Sanctuary mark.',
                'path' => 'images/logo/logo-transparent.png',
                'current' => $company['preloaderLogo'] ?? $company['logo'] ?? null,
            ],
        ];

        return array_map(fn ($item) => $this->decoratePublicItem($item), $items);
    }

    private function siteImages(array $company): array
    {
        $removed = array_flip($this->removedPaths());
        $paths = [];
        foreach ($this->imageRoots() as $root) {
            if (! is_dir($root)) {
                continue;
            }
            foreach (File::allFiles($root) as $file) {
                $ext = strtolower($file->getExtension());
                if (! in_array($ext, self::IMAGE_EXT, true)) {
                    continue;
                }
                if ((int) $file->getSize() <= 0) {
                    continue;
                }
                $relative = 'images/'.ltrim(str_replace('\\', '/', $file->getRelativePathname()), '/');
                if (isset($removed[$relative])) {
                    continue;
                }
                $paths[$relative] = true;
            }
        }

        foreach ($this->collectImageUrls() as $url) {
            $path = ltrim(parse_url($url, PHP_URL_PATH) ?: '', '/');
            if (! str_starts_with($path, 'images/') || isset($removed[$path])) {
                continue;
            }
            if ($this->firstExisting($path)) {
                $paths[$path] = true;
            }
        }

        $brandingPaths = $this->brandingPaths();

        $items = [];
        foreach (array_keys($paths) as $relative) {
            if (in_array($relative, $brandingPaths, true) || $this->isBrandingPath($relative)) {
                continue;
            }
            $item = $this->decoratePublicItem([
                'role' => 'site',
                'label' => basename($relative),
                'path' => $relative,
            ]);
            if ($item['exists'] === false || (int) ($item['size'] ?? 0) <= 0) {
                continue;
            }
            $items[] = $item;
        }

        usort($items, fn ($a, $b) => strcasecmp($a['path'], $b['path']));

        return $items;
    }

    public function deletePublicPath(string $rawPath): array
    {
        $relative = $this->normalizePublicPath($rawPath);
        if ($this->isBrandingPath($relative)) {
            throw ValidationException::withMessages([
                'path' => 'Logo and brand files are managed on the Logo & brand tab.',
            ]);
        }

        $this->markRemoved($relative);
        $files = $this->deletePublicFiles($relative);
        $this->clearStoredPublicUrl($relative);
        $gone = ! $this->liveFileStillPresent($relative);

        return [
            'path' => $relative,
            'deleted' => $gone,
            'files' => $files,
            'pending' => ! $gone,
            'message' => $gone
                ? null
                : 'The file is marked removed. If it is still visible on the live site, the web server could not delete a git-owned file; it will be deleted on the next deploy.',
            'inventory' => $this->inventory(),
        ];
    }

    public function deleteAllSiteImages(): array
    {
        $items = $this->siteImages($this->company());
        $removed = 0;
        $files = 0;
        $pending = [];

        foreach ($items as $item) {
            $relative = $item['path'] ?? '';
            if (! $relative || $this->isBrandingPath($relative)) {
                continue;
            }
            $this->markRemoved($relative);
            $files += $this->deletePublicFiles($relative);
            $this->clearStoredPublicUrl($relative);
            $removed++;
            if ($this->liveFileStillPresent($relative)) {
                $pending[] = $relative;
            }
        }

        $this->pruneRemovedFiles();

        return [
            'removed' => $removed,
            'files' => $files,
            'pending' => count($pending),
            'pending_paths' => $pending,
            'deleted' => $removed > 0 && ! $pending,
            'message' => $pending
                ? count($pending).' file(s) are marked removed but could not be deleted yet. They will be removed from the live web root on the next deploy.'
                : null,
            'inventory' => $this->inventory(),
        ];
    }

    public function pruneRemovedFiles(): array
    {
        $deleted = 0;
        $missing = 0;
        $failed = 0;
        $errors = [];

        foreach ($this->removedPaths() as $relative) {
            if ($this->isBrandingPath($relative)) {
                continue;
            }
            $before = $this->liveFileStillPresent($relative);
            $count = $this->deletePublicFiles($relative);
            $deleted += $count;
            if (! $this->liveFileStillPresent($relative)) {
                if (! $before) {
                    $missing++;
                }
                continue;
            }
            $failed++;
            $errors[] = $relative;
        }

        return compact('deleted', 'missing', 'failed', 'errors');
    }

    private function brandingPaths(): array
    {
        return [
            'images/logo/logo-transparent.png',
            'images/logo/favicon.png',
            'images/logo/favicon.svg',
            'images/logo/favicon.jpeg',
            'images/logo/logo-transparent.jpeg',
        ];
    }

    private function isBrandingPath(string $relative): bool
    {
        return in_array($relative, $this->brandingPaths(), true)
            || str_starts_with($relative, 'images/logo/');
    }

    private function deletePublicFiles(string $relative): int
    {
        $deleted = 0;
        foreach ($this->writeTargets($relative) as $abs) {
            if ($this->forceDeleteFile($abs)) {
                $deleted++;
            }
        }

        return $deleted;
    }

    private function forceDeleteFile(string $abs): bool
    {
        clearstatcache(true, $abs);
        if (is_link($abs)) {
            @chmod($abs, 0666);
            if (@unlink($abs)) {
                return true;
            }
        }
        if (! is_file($abs)) {
            return true;
        }

        @chmod(dirname($abs), 0775);
        @chmod($abs, 0666);

        if (@unlink($abs) || File::delete($abs)) {
            clearstatcache(true, $abs);

            return ! is_file($abs);
        }

        $handle = @fopen($abs, 'c+');
        if ($handle) {
            @ftruncate($handle, 0);
            @fclose($handle);
            @unlink($abs);
        } else {
            @file_put_contents($abs, '');
            @unlink($abs);
        }

        clearstatcache(true, $abs);
        if (! is_file($abs)) {
            return true;
        }

        return is_writable($abs) && @file_put_contents($abs, '') !== false && (int) filesize($abs) === 0;
    }

    private function liveFileStillPresent(string $relative): bool
    {
        $abs = public_path($relative);
        clearstatcache(true, $abs);

        return is_file($abs) && (int) filesize($abs) > 0;
    }

    private function removedPaths(): array
    {
        $fromSettings = [];
        $raw = Setting::query()->where('key', self::REMOVED_SETTING_KEY)->value('value');
        if (is_string($raw)) {
            $raw = json_decode($raw, true);
        }
        if (is_array($raw)) {
            $fromSettings = $raw['paths'] ?? (array_is_list($raw) ? $raw : []);
        }

        $fromFile = [];
        $file = $this->removedStoragePath();
        if (is_file($file)) {
            $decoded = json_decode((string) File::get($file), true);
            if (is_array($decoded)) {
                $fromFile = $decoded['paths'] ?? (array_is_list($decoded) ? $decoded : []);
            }
        }

        $paths = [];
        foreach ([...$fromSettings, ...$fromFile] as $path) {
            $path = ltrim(str_replace('\\', '/', (string) $path), '/');
            if ($path !== '' && str_starts_with($path, 'images/')) {
                $paths[$path] = true;
            }
        }

        return array_keys($paths);
    }

    private function markRemoved(string $relative): void
    {
        $paths = $this->removedPaths();
        if (! in_array($relative, $paths, true)) {
            $paths[] = $relative;
        }
        $this->saveRemovedPaths($paths);
    }

    private function unmarkRemoved(string $relative): void
    {
        $this->saveRemovedPaths(array_values(array_filter(
            $this->removedPaths(),
            fn ($path) => $path !== $relative
        )));
    }

    private function saveRemovedPaths(array $paths): void
    {
        $paths = array_values(array_unique(array_filter($paths)));
        $payload = ['paths' => $paths];
        Setting::updateOrCreate(['key' => self::REMOVED_SETTING_KEY], ['value' => $payload]);
        File::ensureDirectoryExists(dirname($this->removedStoragePath()));
        File::put($this->removedStoragePath(), json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }

    private function removedStoragePath(): string
    {
        return storage_path('app/removed-site-assets.json');
    }

    private function clearStoredPublicUrl(string $relative): void
    {
        $url = '/'.ltrim($relative, '/');
        $this->rewriteStoredUrls($url, '');
    }

    private function decoratePublicItem(array $item): array
    {
        $relative = $item['path'];
        $exists = false;
        $size = null;
        foreach ($this->writeTargets($relative) as $abs) {
            if (is_file($abs)) {
                $exists = true;
                $size = filesize($abs) ?: $size;
            }
        }

        $current = $item['current'] ?? ('/'.$relative);

        return [
            ...$item,
            'url' => $current ?: '/'.$relative,
            'preview' => ($current ?: '/'.$relative).(str_contains((string) $current, '?') ? '' : '?t='.filemtime($this->firstExisting($relative) ?: __FILE__)),
            'exists' => $exists,
            'size' => $size,
        ];
    }

    private function normalizePublicPath(string $raw): string
    {
        $path = parse_url(trim($raw), PHP_URL_PATH) ?: trim($raw);
        $path = ltrim(str_replace('\\', '/', $path), '/');
        if (! preg_match('#^images/[A-Za-z0-9._/-]+$#', $path)) {
            throw ValidationException::withMessages([
                'path' => 'Only files under /images/ can be changed.',
            ]);
        }
        if (str_contains($path, '..')) {
            throw ValidationException::withMessages(['path' => 'Invalid path.']);
        }
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (! in_array($ext, self::IMAGE_EXT, true)) {
            throw ValidationException::withMessages(['path' => 'Unsupported image type.']);
        }

        return $path;
    }

    private function writePublicFile(string $relative, string $contents): array
    {
        $written = [];
        foreach ($this->writeTargets($relative) as $abs) {
            File::ensureDirectoryExists(dirname($abs));
            File::put($abs, $contents);
            $written[] = $abs;
        }
        if (! $written) {
            throw ValidationException::withMessages([
                'path' => 'Could not write the image to public storage.',
            ]);
        }

        return $written;
    }

    private function writeTargets(string $relative): array
    {
        $targets = [public_path($relative)];
        $frontend = base_path('../frontend/public/'.$relative);
        if (is_dir(dirname($frontend)) || is_dir(base_path('../frontend/public'))) {
            $targets[] = $frontend;
        }

        return array_values(array_unique($targets));
    }

    private function firstExisting(string $relative): ?string
    {
        foreach ($this->writeTargets($relative) as $abs) {
            if (is_file($abs)) {
                return $abs;
            }
        }

        return null;
    }

    private function imageRoots(): array
    {
        return array_values(array_filter([
            public_path('images'),
            base_path('../frontend/public/images'),
        ], 'is_dir'));
    }

    private function company(): array
    {
        $raw = Setting::query()->where('key', 'company')->value('value') ?: [];
        if (is_string($raw)) {
            $raw = json_decode($raw, true) ?: [];
        }

        return is_array($raw) ? $raw : [];
    }

    private function updateCompanyField(string $field, string $url): void
    {
        $company = $this->company();
        $company[$field] = $url;
        Setting::updateOrCreate(['key' => 'company'], ['value' => $company]);
    }

    private function collectImageUrls(): array
    {
        $found = [];
        $walk = function ($value) use (&$found, &$walk) {
            if (is_string($value) && $this->looksLikeImage($value)) {
                $found[$value] = true;
            } elseif (is_array($value)) {
                foreach ($value as $child) {
                    $walk($child);
                }
            }
        };

        foreach (Setting::query()->get() as $setting) {
            $walk($setting->value);
        }

        if (Schema::hasTable('page_sections')) {
            foreach (DB::table('page_sections')->get(['content', 'translations']) as $row) {
                $walk(json_decode($row->content ?? '', true));
                $walk(json_decode($row->translations ?? '', true));
            }
        }

        foreach ($this->contentImageColumns() as $table => $columns) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            $existing = array_values(array_filter($columns, fn ($col) => Schema::hasColumn($table, $col)));
            if (! $existing) {
                continue;
            }
            foreach (DB::table($table)->get($existing) as $row) {
                foreach ($existing as $col) {
                    $walk(json_decode($row->{$col} ?? '', true) ?: $row->{$col});
                }
            }
        }

        return array_keys($found);
    }

    private function contentImageColumns(): array
    {
        return [
            'media' => ['url'],
            'pilgrimage_services' => ['image', 'detail_image'],
            'facilities' => ['cover_image', 'featured_image', 'gallery'],
            'news_posts' => ['cover_image', 'author_avatar'],
            'activities' => ['image'],
            'upcoming_pilgrimages' => ['image', 'archives'],
            'videos' => ['thumbnail_url'],
            'testimonials' => ['author_avatar'],
            'shrine_projects' => ['cover_image', 'gallery'],
            'sacred_places' => ['cover_image', 'gallery'],
            'pastoral_team_members' => ['photo'],
            'communities' => ['cover_image', 'gallery'],
        ];
    }

    private function contentUsageTables(): array
    {
        return [
            'news_posts' => [
                'area' => 'News',
                'href' => '/admin/blog',
                'title' => 'title',
                'columns' => ['cover_image', 'author_avatar'],
            ],
            'facilities' => [
                'area' => 'Lodging',
                'href' => '/admin/projects',
                'title' => 'title',
                'columns' => ['cover_image', 'featured_image', 'gallery'],
            ],
            'activities' => [
                'area' => 'Activities',
                'href' => '/admin/activities',
                'title' => 'title',
                'columns' => ['image'],
            ],
            'upcoming_pilgrimages' => [
                'area' => 'Pilgrimage events',
                'href' => '/admin/upcoming-pilgrimages',
                'title' => 'title',
                'columns' => ['image', 'archives'],
            ],
            'videos' => [
                'area' => 'Videos',
                'href' => '/admin/videos',
                'title' => 'title',
                'columns' => ['thumbnail_url'],
            ],
            'testimonials' => [
                'area' => 'Testimonies',
                'href' => '/admin/testimonials',
                'title' => 'author_name',
                'columns' => ['author_avatar'],
            ],
            'shrine_projects' => [
                'area' => 'Shrine projects',
                'href' => '/admin/shrine-projects',
                'title' => 'title',
                'columns' => ['cover_image', 'gallery'],
            ],
            'sacred_places' => [
                'area' => 'Sacred places',
                'href' => '/admin/churches',
                'title' => 'name',
                'columns' => ['cover_image', 'gallery'],
                'extra' => 'type',
            ],
            'pilgrimage_services' => [
                'area' => 'Services',
                'href' => '/admin/services',
                'title' => 'title',
                'columns' => ['image', 'detail_image'],
            ],
            'pastoral_team_members' => [
                'area' => 'Pastoral team',
                'href' => '/admin/pastoral-team',
                'title' => 'name',
                'columns' => ['photo'],
            ],
            'communities' => [
                'area' => 'Communities',
                'href' => '/admin/communities',
                'title' => 'name',
                'columns' => ['cover_image', 'gallery'],
            ],
        ];
    }

    private function importPublicFileToGallery(string $abs, string $relative, int $sort): void
    {
        $ext = strtolower(pathinfo($abs, PATHINFO_EXTENSION)) ?: 'jpg';
        $basename = pathinfo($relative, PATHINFO_FILENAME);
        $path = 'gallery/'.Str::slug($basename).'-'.Str::random(6).'.'.$ext;
        Storage::disk('public')->put($path, File::get($abs));

        Media::create([
            'disk' => 'public',
            'path' => $path,
            'url' => '/storage/'.ltrim($path, '/'),
            'original_name' => basename($relative),
            'mime_type' => File::mimeType($abs) ?: 'image/jpeg',
            'size' => Storage::disk('public')->size($path),
            'folder' => 'gallery',
            'alt' => str_replace('-', ' ', $basename),
            'show_in_gallery' => true,
            'gallery_sort' => $sort,
        ]);
    }

    private function urlMatchSet(string $raw): array
    {
        $raw = trim($raw);
        if ($raw === '') {
            return [];
        }
        $path = parse_url($raw, PHP_URL_PATH);
        if (! is_string($path) || $path === '') {
            $path = strtok($raw, '?') ?: $raw;
        }
        $path = '/'.ltrim($path, '/');
        $bare = strtok($raw, '?') ?: $raw;

        return array_values(array_unique(array_filter([
            $raw,
            $bare,
            $path,
            ltrim($path, '/'),
        ])));
    }

    private function valueContainsUrl(mixed $value, array $targets): bool
    {
        if (is_string($value)) {
            if ($value === '') {
                return false;
            }
            $bare = strtok($value, '?') ?: $value;
            $path = parse_url($value, PHP_URL_PATH);
            $path = is_string($path) && $path !== '' ? '/'.ltrim($path, '/') : $bare;

            return in_array($value, $targets, true)
                || in_array($bare, $targets, true)
                || in_array($path, $targets, true)
                || in_array(ltrim($path, '/'), $targets, true);
        }
        if (is_array($value)) {
            foreach ($value as $child) {
                if ($this->valueContainsUrl($child, $targets)) {
                    return true;
                }
            }
        }

        return false;
    }

    private function settingUsageLabel($setting, array $targets): string
    {
        if ($setting->key === 'company' && is_array($setting->value)) {
            $fields = [];
            foreach (['logo' => 'Site logo', 'favicon' => 'Favicon', 'preloaderLogo' => 'Preloader'] as $field => $label) {
                if ($this->valueContainsUrl($setting->value[$field] ?? null, $targets)) {
                    $fields[] = $label;
                }
            }

            return $fields ? implode(', ', $fields) : 'Organisation';
        }

        return (string) $setting->key;
    }

    private function rewriteStoredUrls(?string $from, string $to): void
    {
        if (! $from) {
            return;
        }
        if ($from === $to) {
            return;
        }
        $variants = array_unique([
            $from,
            strtok($from, '?'),
        ]);

        foreach (Setting::query()->get() as $setting) {
            $next = $this->replaceInValue($setting->value, $variants, $to);
            if ($to === '') {
                $next = $this->scrubEmptyImageSlots($next);
            }
            if ($next !== $setting->value) {
                $setting->value = $next;
                $setting->save();
            }
        }

        if (Schema::hasTable('page_sections')) {
            foreach (DB::table('page_sections')->get() as $row) {
                $content = json_decode($row->content ?? '', true);
                $translations = json_decode($row->translations ?? '', true);
                $updates = [];
                if (is_array($content)) {
                    $next = $this->replaceInValue($content, $variants, $to);
                    if ($to === '') {
                        $next = $this->scrubEmptyImageSlots($next);
                    }
                    if ($next !== $content) {
                        $updates['content'] = json_encode($next);
                    }
                }
                if (is_array($translations)) {
                    $next = $this->replaceInValue($translations, $variants, $to);
                    if ($to === '') {
                        $next = $this->scrubEmptyImageSlots($next);
                    }
                    if ($next !== $translations) {
                        $updates['translations'] = json_encode($next);
                    }
                }
                if ($updates) {
                    DB::table('page_sections')->where('id', $row->id)->update($updates);
                }
            }
        }

        foreach ($this->contentImageColumns() as $table => $columns) {
            if ($table === 'media' || ! Schema::hasTable($table)) {
                continue;
            }
            foreach ($columns as $col) {
                if (! Schema::hasColumn($table, $col)) {
                    continue;
                }
                foreach (DB::table($table)->whereNotNull($col)->get(['id', $col]) as $row) {
                    $decoded = json_decode($row->{$col} ?? '', true);
                    $value = $decoded === null ? $row->{$col} : $decoded;
                    $next = $this->replaceInValue($value, $variants, $to);
                    if ($to === '') {
                        $next = $this->scrubEmptyImageSlots($next);
                    }
                    if ($next !== $value) {
                        DB::table($table)->where('id', $row->id)->update([
                            $col => is_array($next) ? json_encode($next) : $next,
                        ]);
                    }
                }
            }
        }
    }

    private function replaceInValue(mixed $value, array $from, string $to): mixed
    {
        if (is_string($value)) {
            return in_array($value, $from, true) || in_array(strtok($value, '?'), $from, true)
                ? $to
                : $value;
        }
        if (is_array($value)) {
            foreach ($value as $key => $child) {
                $value[$key] = $this->replaceInValue($child, $from, $to);
            }
        }

        return $value;
    }

    private function scrubEmptyImageSlots(mixed $value): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        $isList = array_is_list($value);
        foreach ($value as $key => $child) {
            $value[$key] = $this->scrubEmptyImageSlots($child);
        }
        if ($isList) {
            $value = array_values(array_filter(
                $value,
                fn ($item) => $item !== '' && $item !== null
            ));
        }

        return $value;
    }

    private function looksLikeImage(string $value): bool
    {
        if (! str_starts_with($value, '/') && ! str_starts_with($value, 'http')) {
            return false;
        }

        return (bool) preg_match('/\.(jpe?g|png|gif|webp|svg|ico)(\?|$)/i', $value);
    }
}
