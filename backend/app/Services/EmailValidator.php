<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;

class EmailValidator
{
    public function assertDeliverable(string $email): void
    {
        $email = trim(strtolower($email));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw ValidationException::withMessages([
                'email' => ['Please enter a valid email address.'],
            ]);
        }

        $domain = substr(strrchr($email, '@') ?: '', 1);
        if (! $domain) {
            throw ValidationException::withMessages([
                'email' => ['Please enter a valid email address.'],
            ]);
        }

        if (! checkdnsrr($domain, 'MX') && ! checkdnsrr($domain, 'A')) {
            throw ValidationException::withMessages([
                'email' => ['This email domain does not appear to accept mail. Please use a different address.'],
            ]);
        }
    }
}
