<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    $indexPath = public_path('index.html');

    if (File::exists($indexPath)) {
        return response(File::get($indexPath), 200)->header('Content-Type', 'text/html');
    }

    return view('welcome');
})->where('any', '^(?!api|sanctum|storage|up).*$');
