<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SiteBackupService;
use Illuminate\Http\Request;
use RuntimeException;
use Throwable;

class BackupController extends Controller
{
    public function status(Request $request, SiteBackupService $backups)
    {
        $this->authorizeBackup($request);

        return response()->json($backups->status());
    }

    public function export(Request $request, SiteBackupService $backups)
    {
        $this->authorizeBackup($request);

        try {
            $path = $backups->exportZip();
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        $filename = basename($path);

        return response()->download($path, $filename, [
            'Content-Type' => 'application/zip',
        ])->deleteFileAfterSend(true);
    }

    public function import(Request $request, SiteBackupService $backups)
    {
        $this->authorizeBackup($request);

        $request->validate([
            'file' => ['required', 'file', 'max:262144'],
            'confirm' => ['required', 'accepted'],
        ], [
            'file.max' => 'The backup file is larger than 256MB. Use SSH (`php artisan site:restore`) or raise PHP upload limits.',
            'confirm.accepted' => 'Tick the box to confirm you want to replace all current site data.',
        ]);

        $uploaded = $request->file('file');
        $extension = strtolower((string) $uploaded->getClientOriginalExtension());
        if ($extension !== 'zip') {
            return response()->json(['message' => 'Upload a .zip file downloaded from Backup & restore.'], 422);
        }

        try {
            $result = $backups->importZip($uploaded->getRealPath());
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Restore failed. The current database may be unchanged if the error happened before files were copied. Download a fresh backup before trying again.',
            ], 500);
        }

        return response()->json([
            'message' => 'Site data restored from backup.',
            'created_at' => $result['manifest']['created_at'] ?? null,
            'storage_files' => $result['storage_files'],
            'public_images' => $result['public_images'],
            'notice' => 'If you cannot stay signed in, log in with an administrator account that existed in the backup.',
        ]);
    }

    private function authorizeBackup(Request $request): void
    {
        $user = $request->user();
        if (! $user || ($user->role !== 'super_admin' && ! $user->isMasterAdmin())) {
            abort(403, 'Only administrators can export or restore site backups.');
        }
    }
}
