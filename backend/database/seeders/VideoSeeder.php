<?php

namespace Database\Seeders;

use App\Models\Video;
use Illuminate\Database\Seeder;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        if (Video::query()->exists()) {
            return;
        }

        // Placeholder entry — replace the YouTube URL in Admin → Videos with an official Diocese video.
        Video::query()->create([
            'slug' => 'message-of-our-lady-of-kibeho',
            'title' => 'The Message of Our Lady of Kibeho',
            'description' => '<p>Replace this entry in Admin → Videos with an official YouTube URL from the Diocese of Gikongoro.</p>',
            'youtube_url' => 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
            'youtube_id' => 'jNQXAC9IVRw',
            'thumbnail_url' => 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
            'sort_order' => 0,
            'is_published' => true,
            'published_at' => now()->subDays(3),
        ]);
    }
}
