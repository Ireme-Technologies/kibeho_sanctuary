<?php

namespace App\Services;

use App\Models\Setting;

class WhatsAppUrlBuilder
{
    public function companyNumber(): string
    {
        $company = Setting::query()->where('key', 'company')->value('value') ?: [];
        if (is_string($company)) {
            $company = json_decode($company, true) ?: [];
        }

        $raw = (string) ($company['whatsapp'] ?? $company['phone'] ?? env('WHATSAPP_NUMBER', ''));

        return preg_replace('/\D+/', '', $raw) ?: '';
    }

    public function build(string $text, ?string $toNumber = null): ?string
    {
        $number = preg_replace('/\D+/', '', (string) ($toNumber ?: $this->companyNumber()));
        if (! $number) {
            return null;
        }

        return 'https://wa.me/'.$number.'?text='.rawurlencode($text);
    }

    public function enquiryPrefill(array $data): string
    {
        $lines = [
            'Hello Kibeho Sanctuary,',
            '',
            'I would like to submit an enquiry:',
            'Name: '.($data['name'] ?? ''),
            'Phone: '.($data['phone'] ?? ''),
        ];

        if (! empty($data['email'])) {
            $lines[] = 'Email: '.$data['email'];
        }
        if (! empty($data['subject'])) {
            $lines[] = 'Subject: '.$data['subject'];
        }

        $lines[] = '';
        $lines[] = $data['message'] ?? '';

        return implode("\n", $lines);
    }
}
