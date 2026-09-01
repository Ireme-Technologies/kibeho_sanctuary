<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SpiritualBook;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SpiritualBookController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = SpiritualBook::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (SpiritualBook $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = SpiritualBook::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json($this->transform($query->firstOrFail(), $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = ! empty($data['slug']) ? $data['slug'] : Str::slug($data['title']);
        if (! isset($data['sort_order'])) {
            $data['sort_order'] = (int) SpiritualBook::query()->max('sort_order') + 1;
        }
        $item = SpiritualBook::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, SpiritualBook $spiritualBook)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $spiritualBook->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $spiritualBook->update($data);

        return response()->json($this->transform($spiritualBook->fresh(), $locale));
    }

    public function destroy(SpiritualBook $spiritualBook)
    {
        $spiritualBook->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:spiritual_books,slug,'.($ignoreId ?? 'NULL')],
            'title' => ['required', 'string', 'max:255'],
            'author' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'purchase_url' => ['nullable', 'string', 'max:500'],
            'availability_note' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(SpiritualBook $item, ?string $locale = null): array
    {
        $resolved = Locale::resolve(
            [
                'title' => $item->title,
                'author' => $item->author,
                'description' => $item->description,
                'availability_note' => $item->availability_note,
            ],
            $item->translations,
            ['title', 'author', 'description', 'availability_note'],
            $locale
        );

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'title' => $resolved['title'],
            'author' => $resolved['author'],
            'description' => $resolved['description'],
            'coverImage' => $item->cover_image,
            'purchaseUrl' => $item->purchase_url,
            'availabilityNote' => $resolved['availability_note'],
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'path' => '/spirituality/books#'.$item->slug,
            'translations' => $item->translations ?? [],
        ];
    }
}
