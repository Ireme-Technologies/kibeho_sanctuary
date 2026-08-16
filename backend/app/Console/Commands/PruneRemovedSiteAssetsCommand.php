<?php

namespace App\Console\Commands;

use App\Services\SiteAssetService;
use Illuminate\Console\Command;

class PruneRemovedSiteAssetsCommand extends Command
{
    protected $signature = 'site:prune-removed-assets';

    protected $description = 'Delete site images staff removed in Media library so git/deploy copies do not restore them on the live web root';

    public function handle(SiteAssetService $assets): int
    {
        $result = $assets->pruneRemovedFiles();
        $this->info(
            'Pruned removed site images: '.$result['deleted'].' deleted, '
            .$result['missing'].' already gone, '.$result['failed'].' still present.'
        );
        foreach ($result['errors'] as $path) {
            $this->warn('Could not delete '.$path);
        }

        return $result['failed'] ? self::FAILURE : self::SUCCESS;
    }
}
