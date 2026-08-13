<?php

namespace App\Console\Commands;

use App\Services\SiteBackupService;
use Illuminate\Console\Command;

class SiteBackupCommand extends Command
{
    protected $signature = 'site:backup {--path= : Optional full path for the ZIP file}';

    protected $description = 'Export a full site backup (database + media) as a ZIP file';

    public function handle(SiteBackupService $backups): int
    {
        $this->info('Creating site backup…');
        $path = $backups->exportZip($this->option('path') ?: null);
        $this->info('Backup written to: '.$path);

        return self::SUCCESS;
    }
}
