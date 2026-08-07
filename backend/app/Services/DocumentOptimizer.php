<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class DocumentOptimizer
{
    public const MAX_BYTES = 700 * 1024;

    public function __construct(private ImageOptimizer $images) {}

    /**
     * @return array{contents: string, extension: string, mime: string, width: int, height: int, size: int, optimized: bool}
     */
    public function process(UploadedFile $file): array
    {
        $mime = $file->getMimeType() ?: '';
        $size = $file->getSize() ?: 0;

        if (str_starts_with($mime, 'image/') && ! str_contains($mime, 'svg')) {
            return $this->images->process($file);
        }

        if ($mime === 'application/pdf' || str_ends_with(strtolower($file->getClientOriginalName()), '.pdf')) {
            if ($size > self::MAX_BYTES) {
                throw ValidationException::withMessages([
                    'file' => ['This PDF is over 700KB. Please compress it before uploading.'],
                ]);
            }

            return [
                'contents' => file_get_contents($file->getRealPath()),
                'extension' => 'pdf',
                'mime' => 'application/pdf',
                'width' => 0,
                'height' => 0,
                'size' => $size,
                'optimized' => false,
            ];
        }

        throw ValidationException::withMessages([
            'file' => ['Only images and PDF documents are allowed.'],
        ]);
    }
}
