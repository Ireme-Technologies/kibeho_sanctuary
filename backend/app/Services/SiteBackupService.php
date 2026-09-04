<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use ZipArchive;

class SiteBackupService
{
    public const FORMAT = 'kibeho-site-backup';

    public const VERSION = 1;

    /** Insert order (parents before children). Delete in reverse. */
    public const TABLES = [
        'users',
        'settings',
        'page_sections',
        'media',
        'pilgrimage_services',
        'facilities',
        'news_posts',
        'activities',
        'upcoming_pilgrimages',
        'videos',
        'mass_schedules',
        'testimonials',
        'shrine_projects',
        'sacred_places',
        'visionaries',
        'mary_messages',
        'travel_routes',
        'official_prayers',
        'spiritual_books',
        'audio_items',
        'pastoral_team_members',
        'communities',
        'contact_messages',
        'pilgrim_enquiries',
        'pilgrim_enquiry_messages',
        'pilgrim_enquiry_documents',
    ];

    public function status(): array
    {
        $tables = [];
        foreach (self::TABLES as $table) {
            $tables[$table] = Schema::hasTable($table) ? (int) DB::table($table)->count() : 0;
        }

        return [
            'format' => self::FORMAT,
            'version' => self::VERSION,
            'tables' => $tables,
            'row_count' => array_sum($tables),
            'storage_files' => $this->countFiles(storage_path('app/public')),
            'public_images' => $this->countFiles(public_path('images')),
            'zip_available' => class_exists(ZipArchive::class),
            'php' => [
                'upload_max_filesize' => ini_get('upload_max_filesize'),
                'post_max_size' => ini_get('post_max_size'),
                'memory_limit' => ini_get('memory_limit'),
            ],
        ];
    }

    /**
     * Build a ZIP archive on disk and return its absolute path.
     */
    public function exportZip(?string $destination = null): string
    {
        $this->ensureZipExtension();
        $this->raiseLimits();

        $dir = storage_path('app/backups');
        File::ensureDirectoryExists($dir);

        $filename = 'kibeho-backup-'.now()->format('Y-m-d-His').'.zip';
        $path = $destination ?: $dir.DIRECTORY_SEPARATOR.$filename;

        if (is_file($path)) {
            @unlink($path);
        }

        $zip = new ZipArchive;
        $opened = $zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        if ($opened !== true) {
            throw new RuntimeException('Could not create the backup archive (ZipArchive error '.$opened.').');
        }

        $database = $this->exportTables();
        $dbJson = json_encode($database, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
        if ($dbJson === false) {
            $zip->close();
            @unlink($path);
            throw new RuntimeException('Could not encode the database backup as JSON.');
        }

        $dbTmp = $dir.DIRECTORY_SEPARATOR.'database-'.uniqid('', true).'.json';
        File::put($dbTmp, $dbJson);
        $zip->addFile($dbTmp, 'database.json');

        $storageCount = $this->addDirectoryToZip($zip, storage_path('app/public'), 'files/storage/');
        $imagesCount = $this->addDirectoryToZip($zip, public_path('images'), 'files/public-images/');

        $manifest = json_encode([
            'format' => self::FORMAT,
            'version' => self::VERSION,
            'created_at' => now()->toIso8601String(),
            'app_name' => config('app.name'),
            'app_url' => config('app.url'),
            'tables' => array_keys($database),
            'row_count' => array_sum(array_map('count', $database)),
            'files' => [
                'storage' => $storageCount,
                'public_images' => $imagesCount,
            ],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $zip->addFromString('manifest.json', $manifest ?: '{}');

        if (! $zip->close()) {
            @unlink($dbTmp);
            @unlink($path);
            throw new RuntimeException('Could not finalise the backup archive. Check disk space and PHP zip support.');
        }

        @unlink($dbTmp);

        return $path;
    }

    /**
     * Restore a previously exported ZIP. Replaces CMS tables and overwrites included files.
     *
     * @return array{manifest: array, tables: int, storage_files: int, public_images: int}
     */
    public function importZip(string $zipPath): array
    {
        $this->ensureZipExtension();
        $this->raiseLimits();

        if (! is_file($zipPath)) {
            throw new RuntimeException('Backup file was not found.');
        }

        $zip = new ZipArchive;
        if ($zip->open($zipPath) !== true) {
            throw new RuntimeException('Could not open the backup archive. Use a file downloaded from Backup & restore.');
        }

        $manifestRaw = $zip->getFromName('manifest.json');
        $databaseRaw = $zip->getFromName('database.json');
        if ($manifestRaw === false || $databaseRaw === false) {
            $zip->close();
            throw new RuntimeException('This file is not a Kibeho site backup (missing manifest or database).');
        }

        $manifest = json_decode($manifestRaw, true);
        $database = json_decode($databaseRaw, true);

        if (! is_array($manifest) || ($manifest['format'] ?? '') !== self::FORMAT) {
            $zip->close();
            throw new RuntimeException('This file is not a recognised Kibeho site backup.');
        }

        if ((int) ($manifest['version'] ?? 0) > self::VERSION) {
            $zip->close();
            throw new RuntimeException('This backup was created by a newer version of the site. Update the application before restoring.');
        }

        if (! is_array($database)) {
            $zip->close();
            throw new RuntimeException('The backup database payload is invalid.');
        }

        DB::transaction(function () use ($database) {
            Schema::disableForeignKeyConstraints();
            try {
                foreach (array_reverse(self::TABLES) as $table) {
                    if (Schema::hasTable($table)) {
                        DB::table($table)->delete();
                    }
                }

                foreach (self::TABLES as $table) {
                    if (! Schema::hasTable($table) || empty($database[$table]) || ! is_array($database[$table])) {
                        continue;
                    }
                    $columns = Schema::getColumnListing($table);
                    foreach ($database[$table] as $row) {
                        if (! is_array($row)) {
                            continue;
                        }
                        $payload = [];
                        foreach ($row as $column => $value) {
                            if (! in_array($column, $columns, true)) {
                                continue;
                            }
                            if (is_array($value) || is_object($value)) {
                                $payload[$column] = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                            } else {
                                $payload[$column] = $value;
                            }
                        }
                        if ($payload) {
                            DB::table($table)->insert($payload);
                        }
                    }
                }
            } finally {
                Schema::enableForeignKeyConstraints();
            }
        });

        $storageFiles = $this->restoreZipDirectory($zip, 'files/storage/', storage_path('app/public'));
        $publicImages = $this->restoreZipDirectory($zip, 'files/public-images/', public_path('images'));

        $frontendImages = base_path('../frontend/public/images');
        if (is_dir(dirname($frontendImages))) {
            $this->restoreZipDirectory($zip, 'files/public-images/', $frontendImages);
        }

        $zip->close();

        return [
            'manifest' => $manifest,
            'tables' => count(array_filter(self::TABLES, fn ($table) => Schema::hasTable($table))),
            'storage_files' => $storageFiles,
            'public_images' => $publicImages,
        ];
    }

    private function exportTables(): array
    {
        $out = [];
        foreach (self::TABLES as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            $out[$table] = DB::table($table)->orderBy('id')->get()->map(function ($row) {
                return (array) $row;
            })->all();
        }

        return $out;
    }

    private function addDirectoryToZip(ZipArchive $zip, string $absoluteDir, string $zipPrefix): int
    {
        if (! is_dir($absoluteDir)) {
            return 0;
        }

        $count = 0;
        $root = rtrim($absoluteDir, DIRECTORY_SEPARATOR);
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if (! $file->isFile()) {
                continue;
            }
            $name = $file->getFilename();
            if ($name === '.gitignore' || str_starts_with($name, '.')) {
                continue;
            }
            $relative = ltrim(str_replace('\\', '/', substr($file->getPathname(), strlen($root))), '/');
            if ($relative === '' || str_contains($relative, '..')) {
                continue;
            }
            $zip->addFile($file->getPathname(), $zipPrefix.$relative);
            $count++;
        }

        return $count;
    }

    private function restoreZipDirectory(ZipArchive $zip, string $prefix, string $destinationRoot): int
    {
        File::ensureDirectoryExists($destinationRoot);
        $count = 0;
        $prefixLength = strlen($prefix);

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = $zip->getNameIndex($i);
            if (! is_string($name) || ! str_starts_with($name, $prefix) || str_ends_with($name, '/')) {
                continue;
            }
            if (str_contains($name, '..')) {
                continue;
            }
            $relative = substr($name, $prefixLength);
            if ($relative === '') {
                continue;
            }

            $target = rtrim($destinationRoot, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative);
            $realRoot = realpath($destinationRoot) ?: $destinationRoot;
            $parent = dirname($target);
            File::ensureDirectoryExists($parent);
            $realParent = realpath($parent);
            $rootPrefix = rtrim($realRoot, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
            if ($realParent === false || ($realParent !== $realRoot && ! str_starts_with($realParent, $rootPrefix))) {
                continue;
            }

            $stream = $zip->getStream($name);
            if ($stream === false) {
                continue;
            }
            $out = fopen($target, 'wb');
            if ($out === false) {
                fclose($stream);
                continue;
            }
            stream_copy_to_stream($stream, $out);
            fclose($stream);
            fclose($out);
            $count++;
        }

        return $count;
    }

    private function countFiles(string $absoluteDir): int
    {
        if (! is_dir($absoluteDir)) {
            return 0;
        }
        $count = 0;
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($absoluteDir, \FilesystemIterator::SKIP_DOTS)
        );
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getFilename() !== '.gitignore' && ! str_starts_with($file->getFilename(), '.')) {
                $count++;
            }
        }

        return $count;
    }

    private function ensureZipExtension(): void
    {
        if (! class_exists(ZipArchive::class)) {
            throw new RuntimeException('PHP zip extension is not enabled on this server. Ask hosting to enable ext-zip.');
        }
    }

    private function raiseLimits(): void
    {
        @set_time_limit(0);
        @ini_set('max_execution_time', '0');
        @ini_set('memory_limit', '512M');
    }
}
