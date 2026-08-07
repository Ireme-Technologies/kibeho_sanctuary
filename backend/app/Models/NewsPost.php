<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsPost extends Model
{
    protected $table = 'news_posts';

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'body',
        'category',
        'tags',
        'author_name',
        'author_avatar',
        'author_role',
        'author_bio',
        'cover_image',
        'published_at',
        'is_published',
        'translations',
    ];

    protected $casts = [
        'tags' => 'array',
        'translations' => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];
}
