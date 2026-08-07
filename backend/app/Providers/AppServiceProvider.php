<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $base = rtrim(env('FRONTEND_URL', env('APP_URL', 'http://localhost:5173')), '/');

            return $base.'/admin/login?token='.$token.'&email='.urlencode($user->email);
        });
    }
}
