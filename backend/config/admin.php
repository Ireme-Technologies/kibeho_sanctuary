<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Seeded admin accounts
    |--------------------------------------------------------------------------
    |
    | Values are read from .env at config load time. Prefer config('admin.*')
    | in seeders/code — never env() directly — so config:cache stays correct.
    |
    */

    'name' => env('ADMIN_NAME', 'Master Admin'),

    'password' => env('ADMIN_PASSWORD', 'ChangeMeNow!123'),

    'master_email' => env('MASTER_ADMIN_EMAIL', 'admin@kibehosanctuary.org'),

    /*
    | Email domain allowed to access the Users admin screen and delete users.
    | Example: iremetech.com → any *@iremetech.com account.
    */
    'users_access_domain' => strtolower(env('ADMIN_USERS_DOMAIN', 'iremetech.com')),

    /*
    | Optional second admin (legacy ADMIN_EMAIL). Leave empty to skip.
    */
    'email' => env('ADMIN_EMAIL'),

    /*
    | Allow public admin registration from /admin/login.
    | Set ADMIN_REGISTRATION_OPEN=false after you create your admin account.
    */
    'registration_open' => filter_var(env('ADMIN_REGISTRATION_OPEN', true), FILTER_VALIDATE_BOOLEAN),

];
