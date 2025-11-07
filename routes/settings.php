<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\EmailSettingController;
use App\Http\Controllers\Settings\SettingsController;
use App\Http\Controllers\Settings\SystemSettingsController;
use App\Http\Controllers\Settings\CurrencySettingController;
use App\Http\Controllers\PlanOrderController;
use App\Http\Controllers\Settings\PaymentSettingController;
use App\Http\Controllers\Settings\WebhookController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\PayPalPaymentController;
use App\Http\Controllers\BankPaymentController;
use App\Http\Controllers\UpgradeController;
use App\Http\Controllers\NotificationPreferenceController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Settings Routes
|--------------------------------------------------------------------------
|
| Here are the routes for settings management
|
*/

// Payment routes accessible without plan check
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/payment-methods', [PaymentSettingController::class, 'getPaymentMethods'])->name('payment.methods');
    Route::get('/enabled-payment-methods', [PaymentSettingController::class, 'getEnabledMethods'])->name('payment.enabled-methods');
    Route::post('/plan-orders', [PlanOrderController::class, 'create'])->name('plan-orders.create');
    Route::post('/stripe-payment', [StripePaymentController::class, 'processPayment'])->name('settings.stripe.payment');
    
    // Upgrade routes (superadmin only, no plan check needed)
    Route::middleware('superadmin')->group(function () {
        Route::get('settings/upgrade', [UpgradeController::class, 'index'])->name('upgrade.index');
        Route::post('settings/upgrade/upload', [UpgradeController::class, 'upload'])->name('upgrade.upload');
        Route::post('settings/upgrade/apply', [UpgradeController::class, 'apply'])->name('upgrade.apply');
        Route::post('settings/upgrade/rollback', [UpgradeController::class, 'rollback'])->name('upgrade.rollback');
    });
});

// TEST ROUTE - Remove after testing
// Route::get('test-upgrade', function() {
//     return 'Upgrade route test';
// })->name('test.upgrade');

Route::middleware(['auth', 'verified', 'plan.access'])->group(function () {
    // Payment Settings (admin only)
    Route::post('/payment-settings', [PaymentSettingController::class, 'store'])->name('payment.settings');
    
    // Profile settings page with profile and password sections
    Route::get('profile', function () {
        return Inertia::render('settings/profile-settings');
    })->name('profile');

    // Routes for form submissions
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('profile', [ProfileController::class, 'update']); // For file uploads with method spoofing
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('profile/password', [PasswordController::class, 'update'])->name('password.update');

    // Email settings page
    Route::get('settings/email', [EmailSettingController::class, 'index'])->name('settings.email');
    
    // Email settings routes
    Route::get('settings/email/get', [EmailSettingController::class, 'getEmailSettings'])->name('settings.email.get');
    Route::post('settings/email/update', [EmailSettingController::class, 'updateEmailSettings'])->name('settings.email.update');
    Route::post('settings/email/test', [EmailSettingController::class, 'sendTestEmail'])->name('settings.email.test');
  
    // General settings page with system and company settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings');

    Route::post('notifications/push-subscriptions', [NotificationPreferenceController::class, 'storeSubscription'])->name('notifications.push-subscriptions.store');
    Route::patch('notifications/preferences', [NotificationPreferenceController::class, 'updatePreferences'])->name('notifications.preferences.update');
    
    // System Settings routes
    Route::post('settings/system', [SystemSettingsController::class, 'update'])->name('settings.system.update');
    Route::post('settings/brand', [SystemSettingsController::class, 'updateBrand'])->name('settings.brand.update');
    Route::post('settings/storage', [SystemSettingsController::class, 'updateStorage'])->name('settings.storage.update');
    Route::post('settings/recaptcha', [SystemSettingsController::class, 'updateRecaptcha'])->name('settings.recaptcha.update');
    Route::post('settings/chatgpt', [SystemSettingsController::class, 'updateChatgpt'])->name('settings.chatgpt.update');
    Route::post('settings/cookie', [SystemSettingsController::class, 'updateCookie'])->name('settings.cookie.update');
    Route::post('settings/seo', [SystemSettingsController::class, 'updateSeo'])->name('settings.seo.update');
    Route::post('settings/cache/clear', [SystemSettingsController::class, 'clearCache'])->name('settings.cache.clear');
    
    // Currency Settings routes
    Route::post('settings/currency', [CurrencySettingController::class, 'update'])->name('settings.currency.update');
    
    // Webhook Settings routes
    Route::get('settings/webhooks', [WebhookController::class, 'index'])->name('settings.webhooks.index');
    Route::post('settings/webhooks', [WebhookController::class, 'store'])->name('settings.webhooks.store');
    Route::put('settings/webhooks/{webhook}', [WebhookController::class, 'update'])->name('settings.webhooks.update');
    Route::delete('settings/webhooks/{webhook}', [WebhookController::class, 'destroy'])->name('settings.webhooks.destroy');
    
    // Google Calendar Settings routes
    Route::post('settings/google-calendar', [SystemSettingsController::class, 'updateGoogleCalendar'])->name('settings.google-calendar.update');
    
    // Newsletter routes
    Route::get('landing-page/newsletters', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'index'])->name('landing-page.newsletters.index');
    Route::get('landing-page/newsletters/{newsletter}', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'show'])->name('landing-page.newsletters.show');
    Route::post('landing-page/newsletters', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'store'])->name('landing-page.newsletters.store');
    Route::put('landing-page/newsletters/{newsletter}', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'update'])->name('landing-page.newsletters.update');
    Route::delete('landing-page/newsletters/{newsletter}', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'destroy'])->name('landing-page.newsletters.destroy');
    Route::post('landing-page/newsletters/bulk-action', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'bulkAction'])->name('landing-page.newsletters.bulk-action');
    Route::post('landing-page/newsletters/send-email', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'sendEmail'])->name('landing-page.newsletters.send-email');
    
});