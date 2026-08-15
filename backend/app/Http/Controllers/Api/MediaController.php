<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\ImageOptimizer;
use App\Services\SiteAssetService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::query()->orderByDesc('created_at');

        if ($request->filled('folder')) {
            $query->where('folder', $request->string('folder'));
        }

        if ($request->boolean('gallery')) {
            $query->where('show_in_gallery', true)->orderBy('gallery_sort')->orderByDesc('id');
        }

        return response()->json($query->get());
    }

    public function gallery()
    {
        $items = Media::query()
            ->where('show_in_gallery', true)
            ->orderBy('gallery_sort')
            ->orderByDesc('id')
            ->get();

        return response()->json($items);
    }

    public function siteAssets(SiteAssetService $assets)
    {
        return response()->json($assets->inventory());
    }

    public function replaceSiteAsset(Request $request, SiteAssetService $assets)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:15360', 'mimes:jpg,jpeg,png,gif,webp,svg,ico'],
            'path' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'in:logo,favicon,preloader,site'],
        ]);

        $result = $assets->replacePublicPath(
            (string) $request->input('path'),
            $request->file('file'),
            $request->input('role')
        );

        return response()->json([
            ...$result,
            'inventory' => $assets->inventory(),
        ]);
    }

    public function destroySiteAsset(Request $request, SiteAssetService $assets)
    {
        $request->validate([
            'path' => ['required', 'string', 'max:255'],
        ]);

        return response()->json($assets->deletePublicPath((string) $request->input('path')));
    }

    public function destroyAllSiteAssets(SiteAssetService $assets)
    {
        return response()->json($assets->deleteAllSiteImages());
    }

    public function replace(Request $request, Media $media, SiteAssetService $assets)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:15360', 'mimes:jpg,jpeg,png,gif,webp,svg,mp4,webm,pdf'],
        ]);

        return response()->json($assets->replaceMedia($media, $request->file('file')));
    }

    public function store(Request $request, ImageOptimizer $optimizer)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:15360', 'mimes:jpg,jpeg,png,gif,webp,svg,mp4,webm,pdf'],
            'folder' => ['nullable', 'string', 'max:100'],
            'alt' => ['nullable', 'string', 'max:255'],
            'show_in_gallery' => ['sometimes', 'boolean'],
        ]);

        $folder = trim((string) $request->input('folder', 'uploads'), '/') ?: 'uploads';
        $file = $request->file('file');
        $processed = $optimizer->process($file);

        $name = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = ($name ?: 'file').'-'.Str::random(8).'.'.$processed['extension'];
        $path = $folder.'/'.$filename;

        Storage::disk('public')->put($path, $processed['contents']);

        // Relative URL so Vite (/storage proxy) and production (same origin) both work.
        $publicUrl = '/storage/'.ltrim($path, '/');

        $media = Media::create([
            'disk' => 'public',
            'path' => $path,
            'url' => $publicUrl,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $processed['mime'],
            'size' => $processed['size'],
            'width' => $processed['width'] ?: null,
            'height' => $processed['height'] ?: null,
            'folder' => $folder,
            'alt' => $request->input('alt'),
            'show_in_gallery' => $request->boolean('show_in_gallery'),
            'gallery_sort' => (int) Media::query()->max('gallery_sort') + 1,
        ]);

        return response()->json([
            ...$media->toArray(),
            'optimized' => $processed['optimized'],
        ], 201);
    }

    public function update(Request $request, Media $media)
    {
        $data = $request->validate([
            'alt' => ['nullable', 'string', 'max:255'],
            'show_in_gallery' => ['sometimes', 'boolean'],
            'gallery_sort' => ['sometimes', 'integer', 'min:0'],
        ]);

        $media->update($data);

        return response()->json($media->fresh());
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:media,id'],
        ]);

        foreach ($data['order'] as $index => $id) {
            Media::where('id', $id)->update(['gallery_sort' => $index + 1]);
        }

        return response()->json(['message' => 'Gallery order updated.']);
    }

    public function destroy(Media $media)
    {
        Storage::disk($media->disk)->delete($media->path);
        $media->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}
