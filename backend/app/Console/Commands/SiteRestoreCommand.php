<?php

namespace App\Console\Commands;

use App\Services\SiteBackupService;
use Illuminate\Console\Command;

class SiteRestoreCommand extends Command
{
    protected $signature = 'site:restore {path : Path to a kibeho-backup ZIP} {--force : Skip confirmation}';

    protected $description = 'Restore site content and media from a backup ZIP';

    public function handle(SiteBackupService $backups): int
    {
        $path = $this->argument('path');
        if (! is_file($path)) {
            $this->error('File not found: '.$path);

            return self::FAILURE;
        }

        if (! $this->option('force') && ! $this->confirm('This replaces all current site content. Continue?')) {
            return self::SUCCESS;
        }

        $result = $backups->importZip($path);
        $this->info('Restored backup from '.($result['manifest']['created_at'] ?? 'unknown date').'.');
        $this->info('Storage files: '.$result['storage_files'].' · Public images: '.$result['public_images']);

        return self::SUCCESS;
    }
}
