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
                'phone' => '+250 788 123 456',
                'phoneHref' => 'tel:+250788123456',
                'whatsapp' => '+250788123456',
                'email' => 'info@kibehosanctuary.org',
                'notifyEmail' => 'info@kibehosanctuary.org',
                'address' => 'Kibeho, Nyaruguru District, Southern Province, Rwanda',
                'socials' => [
                    ['iconKey' => 'facebook', 'href' => 'https://facebook.com', 'label' => 'Facebook'],
                    ['iconKey' => 'instagram', 'href' => 'https://instagram.com', 'label' => 'Instagram'],
                    ['iconKey' => 'youtube', 'href' => 'https://youtube.com', 'label' => 'YouTube'],
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
                    'eyebrow' => 'Pilgrim Office',
                    'headline' => 'Contact Us',
                    'hero-bg-image' => '/images/contact/contact-hero.jpeg',
                    'subline' => 'Questions about visiting Kibeho, group pilgrimages, offerings, or volunteering? We are here to help.',
                ],
                'info' => [
                    'eyebrow' => 'Get In Touch',
                    'heading' => 'Contact Information',
                    'address' => 'Kibeho, Nyaruguru District, Southern Province, Rwanda',
                    'phone' => '+250 788 123 456',
                    'email' => 'info@kibehosanctuary.org',
                    'businessHours' => [
                        ['day' => 'Monday – Saturday', 'hours' => '7:00 AM – 6:00 PM'],
                        ['day' => 'Sunday', 'hours' => '6:00 AM – 8:00 PM (Pilgrimage Day)'],
                        ['day' => 'Feast Days', 'hours' => 'Extended hours — check schedule'],
                    ],
                    'whatsappNumber' => '250788123456',
                    'whatsappLabel' => 'Message on WhatsApp',
                    'responseNote' => 'We typically respond within 1–2 business days.',
                ],
                'map' => [
                    'label' => 'Kibeho — Nyaruguru, Rwanda',
                    'title' => 'Shrine of Our Lady of Kibeho',
                    'subtitle' => 'Diocese of Gikongoro',
                    'embedSrc' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5!2d29.556!3d-2.635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c4c7e0e0e0e0e1%3A0x0!2sKibeho%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1699000000000!5m2!1sen!2srw',
                    'directionsLink' => 'https://maps.google.com/?q=Kibeho,Nyaruguru,Rwanda',
                    'directionsLabel' => 'Get Directions',
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
