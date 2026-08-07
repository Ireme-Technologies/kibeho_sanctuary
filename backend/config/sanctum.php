<?php

use App\Http\Middleware\EncryptCookies;
use App\Http\Middleware\VerifyCsrfToken;
use Laravel\Sanctum\Http\Middleware\AuthenticateSession;
use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Include your production host. Example:
    | SANCTUM_STATEFUL_DOMAINS=demo.iremetech.com,localhost,localhost:5173
    |
    */

    'stateful' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
            '%s%s',
            'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,127.0.0.1:5173,::1,demo.iremetech.com',
            Sanctum::currentApplicationUrlWithPort()
        )))
    ))),

    'guard' => ['web'],

    'expiration' => null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    | Laravel 10 uses VerifyCsrfToken (not Laravel 11's ValidateCsrfToken).
    */
    'middleware' => [
        'authenticate_session' => AuthenticateSession::class,
        'encrypt_cookies' => EncryptCookies::class,
        'verify_csrf_token' => VerifyCsrfToken::class,
        'validate_csrf_token' => VerifyCsrfToken::class,
    ],

];
