<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UpcomingPilgrimageController;
use App\Http\Controllers\Api\ClientAuthController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\MassScheduleController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\NewsPostController;
use App\Http\Controllers\Api\PageSectionController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\PilgrimEnquiryController;
use App\Http\Controllers\Api\PilgrimageServiceController;
use App\Http\Controllers\Api\SacredPlaceController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ShrineProjectController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\I18nController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/admin/registration-status', [AuthController::class, 'registrationStatus']);
Route::post('/admin/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::post('/password/forgot', [PasswordController::class, 'forgot']);
Route::post('/password/reset', [PasswordController::class, 'reset']);

Route::post('/client/register', [ClientAuthController::class, 'register']);
Route::post('/client/login', [ClientAuthController::class, 'login']);

Route::get('/settings', [SettingController::class, 'index']);
Route::get('/settings/{key}', [SettingController::class, 'show']);
Route::get('/i18n', [I18nController::class, 'show']);

Route::get('/pilgrimage-services', [PilgrimageServiceController::class, 'index']);
Route::get('/pilgrimage-services/{slug}', [PilgrimageServiceController::class, 'show']);

Route::get('/facilities', [FacilityController::class, 'index']);
Route::get('/facilities/{slug}', [FacilityController::class, 'show']);

Route::get('/news', [NewsPostController::class, 'index']);
Route::get('/news/{slug}', [NewsPostController::class, 'show']);

Route::get('/activities', [ActivityController::class, 'index']);
Route::get('/activities/{slug}', [ActivityController::class, 'show']);

Route::get('/upcoming-pilgrimages', [UpcomingPilgrimageController::class, 'index']);
Route::get('/upcoming-pilgrimages/{slug}', [UpcomingPilgrimageController::class, 'show']);

Route::get('/mass-schedules', [MassScheduleController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{slug}', [TestimonialController::class, 'show']);
Route::get('/shrine-projects', [ShrineProjectController::class, 'index']);
Route::get('/shrine-projects/{slug}', [ShrineProjectController::class, 'show']);
Route::get('/sacred-places', [SacredPlaceController::class, 'index']);
Route::get('/sacred-places/{slug}', [SacredPlaceController::class, 'show']);

Route::get('/pages', [PageSectionController::class, 'index']);
Route::get('/pages/{key}', [PageSectionController::class, 'show']);

Route::get('/gallery', [MediaController::class, 'gallery']);
Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/{slug}', [VideoController::class, 'show']);

Route::post('/contact', [ContactMessageController::class, 'store']);
Route::post('/pilgrim-enquiries', [PilgrimEnquiryController::class, 'store']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/password/change', [PasswordController::class, 'change']);
});

Route::middleware(['auth:sanctum', 'client'])->prefix('client')->group(function () {
    Route::get('/pilgrim-enquiries', [PilgrimEnquiryController::class, 'clientIndex']);
    Route::post('/pilgrim-enquiries', [PilgrimEnquiryController::class, 'clientStore']);
    Route::get('/pilgrim-enquiries/{pilgrimEnquiry}', [PilgrimEnquiryController::class, 'clientShow']);
    Route::post('/pilgrim-enquiries/{pilgrimEnquiry}/messages', [PilgrimEnquiryController::class, 'clientReply']);
    Route::post('/pilgrim-enquiries/{pilgrimEnquiry}/documents', [PilgrimEnquiryController::class, 'uploadDocument']);
});

Route::middleware(['auth:sanctum', 'super_admin'])->group(function () {
    Route::put('/settings', [SettingController::class, 'update']);
    Route::put('/i18n', [I18nController::class, 'update']);

    Route::post('/pilgrimage-services', [PilgrimageServiceController::class, 'store']);
    Route::put('/pilgrimage-services/{pilgrimageService}', [PilgrimageServiceController::class, 'update']);
    Route::delete('/pilgrimage-services/{pilgrimageService}', [PilgrimageServiceController::class, 'destroy']);

    Route::post('/facilities', [FacilityController::class, 'store']);
    Route::put('/facilities/{facility}', [FacilityController::class, 'update']);
    Route::delete('/facilities/{facility}', [FacilityController::class, 'destroy']);

    Route::post('/news', [NewsPostController::class, 'store']);
    Route::put('/news/{newsPost}', [NewsPostController::class, 'update']);
    Route::delete('/news/{newsPost}', [NewsPostController::class, 'destroy']);

    Route::post('/activities', [ActivityController::class, 'store']);
    Route::put('/activities/{activity}', [ActivityController::class, 'update']);
    Route::delete('/activities/{activity}', [ActivityController::class, 'destroy']);

    Route::post('/upcoming-pilgrimages', [UpcomingPilgrimageController::class, 'store']);
    Route::put('/upcoming-pilgrimages/{upcomingPilgrimage}', [UpcomingPilgrimageController::class, 'update']);
    Route::delete('/upcoming-pilgrimages/{upcomingPilgrimage}', [UpcomingPilgrimageController::class, 'destroy']);

    Route::post('/mass-schedules', [MassScheduleController::class, 'store']);
    Route::put('/mass-schedules/{massSchedule}', [MassScheduleController::class, 'update']);
    Route::delete('/mass-schedules/{massSchedule}', [MassScheduleController::class, 'destroy']);

    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

    Route::post('/shrine-projects', [ShrineProjectController::class, 'store']);
    Route::put('/shrine-projects/{shrineProject}', [ShrineProjectController::class, 'update']);
    Route::delete('/shrine-projects/{shrineProject}', [ShrineProjectController::class, 'destroy']);

    Route::post('/sacred-places', [SacredPlaceController::class, 'store']);
    Route::put('/sacred-places/{sacredPlace}', [SacredPlaceController::class, 'update']);
    Route::delete('/sacred-places/{sacredPlace}', [SacredPlaceController::class, 'destroy']);

    Route::post('/pages', [PageSectionController::class, 'store']);
    Route::put('/pages/{key}', [PageSectionController::class, 'update']);
    Route::delete('/pages/{key}', [PageSectionController::class, 'destroy']);

    Route::get('/contact-messages', [ContactMessageController::class, 'index']);
    Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
    Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);

    Route::get('/pilgrim-enquiries/stats', [PilgrimEnquiryController::class, 'stats']);
    Route::get('/pilgrim-enquiries', [PilgrimEnquiryController::class, 'index']);
    Route::get('/pilgrim-enquiries/{pilgrimEnquiry}', [PilgrimEnquiryController::class, 'show']);
    Route::put('/pilgrim-enquiries/{pilgrimEnquiry}', [PilgrimEnquiryController::class, 'update']);
    Route::delete('/pilgrim-enquiries/{pilgrimEnquiry}', [PilgrimEnquiryController::class, 'destroy']);
    Route::post('/pilgrim-enquiries/{pilgrimEnquiry}/messages', [PilgrimEnquiryController::class, 'reply']);
    Route::post('/pilgrim-enquiries/{pilgrimEnquiry}/documents', [PilgrimEnquiryController::class, 'uploadDocument']);

    Route::get('/media', [MediaController::class, 'index']);
    Route::get('/media/site-assets', [MediaController::class, 'siteAssets']);
    Route::post('/media', [MediaController::class, 'store']);
    Route::post('/media/site-assets/replace', [MediaController::class, 'replaceSiteAsset']);
    Route::post('/media/{media}/replace', [MediaController::class, 'replace']);
    Route::put('/media/reorder', [MediaController::class, 'reorder']);
    Route::put('/media/{media}', [MediaController::class, 'update']);
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);

    Route::post('/videos', [VideoController::class, 'store']);
    Route::put('/videos/reorder', [VideoController::class, 'reorder']);
    Route::put('/videos/{video}', [VideoController::class, 'update']);
    Route::delete('/videos/{video}', [VideoController::class, 'destroy']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});
