<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class ImageOptimizer
{
    public const MAX_BYTES = 700 * 1024;

    /**
     * Process an uploaded image according to size rules:
     * - under/equal 700KB: keep as-is (small images under 100KB are allowed)
     * - over 700KB: resize/compress until <= 700KB
     *
     * @return array{contents: string, extension: string, mime: string, width: int, height: int, size: int, optimized: bool}
     */
    public function process(UploadedFile $file): array
    {
        $size = $file->getSize() ?: 0;
        $mime = $file->getMimeType() ?: '';
        $isImage = str_starts_with($mime, 'image/') && ! str_contains($mime, 'svg');

        // Size rules apply to raster images only (videos/PDFs/SVG pass through).
        if (! $isImage) {
            return [
                'contents' => file_get_contents($file->getRealPath()),
                'extension' => $file->getClientOriginalExtension() ?: 'bin',
                'mime' => $mime,
                'width' => 0,
                'height' => 0,
                'size' => $size,
                'optimized' => false,
            ];
        }

        if ($size > 0 && $size <= self::MAX_BYTES) {
            [$width, $height] = @\getimagesize($file->getRealPath()) ?: [0, 0];

            return [
                'contents' => file_get_contents($file->getRealPath()),
                'extension' => $this->preferredExtension($mime, $file),
                'mime' => $mime,
                'width' => (int) $width,
                'height' => (int) $height,
                'size' => $size,
                'optimized' => false,
            ];
        }

        return $this->compressToMax($file);
    }

    private function compressToMax(UploadedFile $file): array
    {
        if ($this->gdAvailable()) {
            return $this->compressWithGd($file);
        }

        if ($this->imagickAvailable()) {
            return $this->compressWithImagick($file);
        }

        throw ValidationException::withMessages([
            'file' => ['This image is over 700KB and cannot be compressed on the server. Upload a smaller file, or enable PHP GD / Imagick.'],
        ]);
    }

    private function compressWithGd(UploadedFile $file): array
    {
        $path = $file->getRealPath();
        $info = @\getimagesize($path);
        if (! $info) {
            throw new RuntimeException('Unable to read image.');
        }

        [$width, $height] = $info;
        $source = $this->createImageResource($path, $info['mime']);
        if (! $source) {
            throw new RuntimeException('Unsupported image type for optimization.');
        }

        $scale = 1.0;
        $quality = 85;
        $contents = null;
        $attempts = 0;

        while ($attempts < 12) {
            $newW = max(1, (int) round($width * $scale));
            $newH = max(1, (int) round($height * $scale));
            $canvas = \imagecreatetruecolor($newW, $newH);
            \imagealphablending($canvas, false);
            \imagesavealpha($canvas, true);
            \imagecopyresampled($canvas, $source, 0, 0, 0, 0, $newW, $newH, $width, $height);

            ob_start();
            \imagejpeg($canvas, null, $quality);
            $contents = ob_get_clean();
            \imagedestroy($canvas);

            if (strlen($contents) <= self::MAX_BYTES) {
                \imagedestroy($source);

                return [
                    'contents' => $contents,
                    'extension' => 'jpg',
                    'mime' => 'image/jpeg',
                    'width' => $newW,
                    'height' => $newH,
                    'size' => strlen($contents),
                    'optimized' => true,
                ];
            }

            if ($quality > 55) {
                $quality -= 10;
            } else {
                $scale *= 0.85;
                $quality = 80;
            }
            $attempts++;
        }

        \imagedestroy($source);

        throw ValidationException::withMessages([
            'file' => ['Unable to compress this image under 700KB. Try a smaller source file.'],
        ]);
    }

    private function compressWithImagick(UploadedFile $file): array
    {
        $image = new \Imagick($file->getRealPath());
        $image->setImageBackgroundColor('white');
        if ($image->getImageAlphaChannel()) {
            $image = $image->mergeImageLayers(\Imagick::LAYERMETHOD_FLATTEN);
        }
        $image->setImageFormat('jpeg');

        $scale = 1.0;
        $quality = 85;
        $attempts = 0;
        $width = $image->getImageWidth();
        $height = $image->getImageHeight();

        while ($attempts < 12) {
            $clone = clone $image;
            $newW = max(1, (int) round($width * $scale));
            $newH = max(1, (int) round($height * $scale));
            $clone->resizeImage($newW, $newH, \Imagick::FILTER_LANCZOS, 1, true);
            $clone->setImageCompressionQuality($quality);
            $contents = $clone->getImageBlob();
            $clone->clear();
            $clone->destroy();

            if (strlen($contents) <= self::MAX_BYTES) {
                $image->clear();
                $image->destroy();

                return [
                    'contents' => $contents,
                    'extension' => 'jpg',
                    'mime' => 'image/jpeg',
                    'width' => $newW,
                    'height' => $newH,
                    'size' => strlen($contents),
                    'optimized' => true,
                ];
            }

            if ($quality > 55) {
                $quality -= 10;
            } else {
                $scale *= 0.85;
                $quality = 80;
            }
            $attempts++;
        }

        $image->clear();
        $image->destroy();

        throw ValidationException::withMessages([
            'file' => ['Unable to compress this image under 700KB. Try a smaller source file.'],
        ]);
    }

    private function gdAvailable(): bool
    {
        return \extension_loaded('gd') && \function_exists('imagecreatefromjpeg');
    }

    private function imagickAvailable(): bool
    {
        return \extension_loaded('imagick') && class_exists(\Imagick::class);
    }

    private function createImageResource(string $path, string $mime)
    {
        return match ($mime) {
            'image/jpeg', 'image/jpg' => @\imagecreatefromjpeg($path),
            'image/png' => @\imagecreatefrompng($path),
            'image/webp' => \function_exists('imagecreatefromwebp') ? @\imagecreatefromwebp($path) : null,
            'image/gif' => @\imagecreatefromgif($path),
            default => null,
        };
    }

    private function preferredExtension(string $mime, UploadedFile $file): string
    {
        return match ($mime) {
            'image/jpeg', 'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            default => $file->getClientOriginalExtension() ?: 'bin',
        };
    }
}
