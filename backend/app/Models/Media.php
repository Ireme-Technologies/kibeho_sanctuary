<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = [
        'disk',
        'path',
        'url',
        'original_name',
        'mime_type',
        'size',
        'width',
        'height',
        'folder',
        'alt',
        'translations',
        'show_in_gallery',
        'gallery_sort',
    ];

    protected $casts = [
        'show_in_gallery' => 'boolean',
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'gallery_sort' => 'integer',
        'translations' => 'array',
    ];
}
