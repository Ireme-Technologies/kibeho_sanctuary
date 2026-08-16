<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $navPath = database_path('data/sanctuary_navigation.json');
        $navigation = is_file($navPath)
            ? (json_decode(file_get_contents($navPath), true) ?: [])
            : [];

        $settings = [
            'company' => [
                'name' => 'Shrine of Our Lady of Kibeho',
                'shortName' => 'Our Lady of Kibeho',
                'tagline' => 'Official Website · Diocese of Gikongoro',
                'logo' => '/images/logo/logo-transparent.png',
                'favicon' => '/images/logo/favicon.svg',
                'preloaderLogo' => '/images/logo/logo-transparent.png',
                'phone' => '+250 788 559 192',
                'phoneHref' => 'tel:+250788559192',
                'phone2' => '+250 788 307 376',
                'whatsapp' => '+250788559192',
                'email' => 'info@kibehosanctuary.rw',
                'notifyEmail' => 'info@kibehosanctuary.rw',
                'address' => 'Sanctuary Our Lady of Kibeho, B.P. 341 Butare / Rwanda',
                'plusCode' => '9H23+58 Kibeho',
                'socials' => [
                    ['iconKey' => 'facebook', 'href' => '', 'label' => 'Facebook'],
                    ['iconKey' => 'twitter', 'href' => '', 'label' => 'Twitter'],
                    ['iconKey' => 'instagram', 'href' => '', 'label' => 'Instagram'],
                ],
            ],
            'navigation' => [
                'primaryNav' => $navigation['primaryNav'] ?? [],
                'footerLinks' => $navigation['footerLinks'] ?? [],
                'footerServiceLinks' => $navigation['footerServiceLinks'] ?? [],
                'navCTA' => $navigation['navCTA'] ?? ['label' => 'Donate', 'path' => '/support/donations'],
            ],
            'contact' => [
                'hero' => [
                    'eyebrow' => 'Where to find us',
                    'headline' => 'Contact us',
                    'hero-bg-image' => '',
                    'subline' => 'The Sanctuary Our Lady of Kibeho is situated in Gikongoro Diocese, Nyaruguru District, in Southern Rwanda, not far from the Burundian border.',
                ],
                'info' => [
                    'eyebrow' => 'Where to find us',
                    'heading' => 'Contact us',
                    'address' => 'Sanctuary Our Lady of Kibeho, B.P. 341 Butare / Rwanda',
                    'postalAddress' => 'B.P. 341 Butare, RWANDA',
                    'phone' => '+250 788 559 192',
                    'phone2' => '+250 788 307 376',
                    'email' => 'info@kibehosanctuary.rw',
                    'plusCode' => '9H23+58 Kibeho',
                    'localization' => 'Pilgrims from foreign countries can use the airplane that lands in Kigali. From Kigali, the St. Vincent Pallotti Pilgrimages Centre can help you find facilities for your pilgrimage to Kibeho.',
                    'routes' => [
                        'Kigali – Huye – Matyazo – Kibeho',
                        'Rusizi – Huye – Matyazo – Kibeho',
                        'Akanyaru – Cahinda – Kibeho',
                    ],
                    'businessHours' => [
                        ['day' => 'Monday – Saturday', 'hours' => 'As announced by the Pilgrimage Office'],
                        ['day' => 'Sunday & feast days', 'hours' => 'See Mass schedule'],
                    ],
                    'whatsappNumber' => '250788559192',
                    'whatsappLabel' => 'Message on WhatsApp',
                    'responseNote' => 'We typically respond within 1–2 business days.',
                ],
                'map' => [
                    'label' => '9H23+58 Kibeho',
                    'title' => 'Sanctuary Our Lady of Kibeho',
                    'subtitle' => 'Nyaruguru District · Diocese of Gikongoro',
                    'embedSrc' => 'https://www.google.com/maps?q=9H23%2B58+Kibeho&output=embed',
                    'directionsLink' => 'https://maps.google.com/?q=9H23+58+Kibeho',
                    'directionsLabel' => 'Get directions',
                ],
            ],
            'offerings' => [
                'candlePriceUsd' => 1,
                'massPriceUsd' => 20,
                'momoCode' => '*182*8*1*060974#',
                'momoLabel' => 'Mobile Money',
                'bankLabel' => 'Bank transfer (Kibeho bank account)',
                'accounts' => [
                    ['bank' => 'Bank of Kigali (BK)', 'name' => 'Diocese Gikongoro/Sanct KIBEHO', 'number' => '00266 00690793-01', 'currency' => 'RWF'],
                    ['bank' => 'Bank of Kigali (BK)', 'name' => 'Diocese Gikongoro/Sanct KIBEHO', 'number' => '00266 00690796-02', 'currency' => 'EUR'],
                    ['bank' => 'Bank of Kigali (BK)', 'name' => 'Diocese Gikongoro/Sanct KIBEHO', 'number' => '00266 00690797-03', 'currency' => 'USD'],
                    ['bank' => 'Banque Populaire du Rwanda (BPR)', 'name' => 'Diocese Gikongoro/Sanct KIBEHO', 'number' => '475453520910197', 'currency' => 'RWF'],
                ],
            ],
            'theme' => [
                'primaryColor' => '#1a365d',
                'secondaryColor' => '#4aa3e0',
                'headingFont' => 'Libre Baskerville',
                'bodyFont' => 'Source Sans 3',
            ],
            'i18n' => I18nSeederData::payload(),
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
