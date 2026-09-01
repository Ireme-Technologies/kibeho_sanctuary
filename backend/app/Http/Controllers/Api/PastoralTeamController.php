<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PastoralTeamMember;
use App\Support\Locale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PastoralTeamController extends Controller
{
    public function index(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $query = PastoralTeamMember::query()->orderBy('sort_order')->orderBy('id');

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json(
            $query->get()->map(fn (PastoralTeamMember $item) => $this->transform($item, $locale))
        );
    }

    public function show(Request $request, string $slug)
    {
        $locale = Locale::fromRequest($request);
        $query = PastoralTeamMember::query()->where('slug', $slug);

        if (! Auth::guard('web')->user()) {
            $query->where('is_published', true);
        }

        return response()->json($this->transform($query->firstOrFail(), $locale));
    }

    public function store(Request $request)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request);
        $data['slug'] = ! empty($data['slug']) ? $data['slug'] : Str::slug($data['name']);
        if (! isset($data['sort_order'])) {
            $data['sort_order'] = (int) PastoralTeamMember::query()->max('sort_order') + 1;
        }
        $item = PastoralTeamMember::create($data);

        return response()->json($this->transform($item, $locale), 201);
    }

    public function update(Request $request, PastoralTeamMember $pastoralTeamMember)
    {
        $locale = Locale::fromRequest($request);
        $data = $this->validated($request, $pastoralTeamMember->id);
        if (array_key_exists('slug', $data) && empty($data['slug'])) {
            unset($data['slug']);
        }
        $pastoralTeamMember->update($data);

        return response()->json($this->transform($pastoralTeamMember->fresh(), $locale));
    }

    public function destroy(PastoralTeamMember $pastoralTeamMember)
    {
        $pastoralTeamMember->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:255', 'unique:pastoral_team_members,slug,'.($ignoreId ?? 'NULL')],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'photo' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'translations' => ['nullable', 'array'],
        ]);
    }

    private function transform(PastoralTeamMember $item, ?string $locale = null): array
    {
        $resolved = Locale::resolve(
            [
                'name' => $item->name,
                'role' => $item->role,
                'bio' => $item->bio,
            ],
            $item->translations,
            ['name', 'role', 'bio'],
            $locale
        );

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'name' => $resolved['name'],
            'title' => $resolved['name'],
            'role' => $resolved['role'],
            'bio' => $resolved['bio'],
            'description' => $resolved['bio'],
            'photo' => $item->photo,
            'coverImage' => $item->photo,
            'path' => '/shrine/pastoral-team/'.$item->slug,
            'sortOrder' => $item->sort_order,
            'isPublished' => $item->is_published,
            'translations' => $item->translations ?? [],
        ];
    }
}
