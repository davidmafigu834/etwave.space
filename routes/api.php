<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\SimplePaynowController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('api')->prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
    Route::put('/profile', [AuthController::class, 'editProfile'])->middleware('auth:sanctum');
    
    // Business routes
    Route::get('/businesses', [BusinessController::class, 'index'])->middleware('auth:sanctum');
    
    // Appointment routes
    Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('auth:sanctum');
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy'])->middleware('auth:sanctum');
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus'])->middleware('auth:sanctum');
    
    // Announcement routes
    Route::prefix('announcements')->middleware('auth:sanctum')->group(function () {
        // User-facing routes
        Route::get('/', [AnnouncementController::class, 'index']);
        Route::post('/{announcement}/read', [AnnouncementController::class, 'markAsRead']);
        Route::post('/mark-all-read', [AnnouncementController::class, 'markAllAsRead']);
        
        // Admin routes
        Route::middleware(['role:admin|superadmin'])->group(function () {
            Route::get('/admin', [AdminAnnouncementController::class, 'index']);
            Route::post('/', [AdminAnnouncementController::class, 'store']);
            Route::get('/{announcement}', [AdminAnnouncementController::class, 'show']);
            Route::put('/{announcement}', [AdminAnnouncementController::class, 'update']);
            Route::delete('/{announcement}', [AdminAnnouncementController::class, 'destroy']);
            Route::post('/{announcement}/toggle-status', [AdminAnnouncementController::class, 'toggleStatus']);
        });
    });
});