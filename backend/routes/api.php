<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\StaffPermissionController;
use App\Http\Controllers\BusinessController;

// ── Public routes — no auth required ──────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Clients use these without logging in
Route::get('/businesses/{business}/slots',     [AvailabilityController::class, 'getSlots']);
Route::post('/businesses/{business}/bookings', [BookingController::class, 'store']);
Route::get('/businesses/slug/{slug}', [BusinessController::class, 'findBySlug']);

// ── Authenticated routes ───────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::get('/my-businesses', [BusinessController::class, 'myBusinesses']);
    Route::get('/businesses/{business}/my-permissions', [StaffPermissionController::class, 'myPermissions']);

    // ── Owner only — staff can never access these ──────────────────
    Route::middleware('role.owner')->group(function () {

        Route::get('/my-business', [BusinessController::class, 'show']);
        Route::get('/businesses/{business}/staff', [StaffPermissionController::class, 'listStaff']);

        // Availability rules — business configuration
        Route::post('/businesses', [BusinessController::class, 'store']);
        Route::get('/businesses/{business}/availability-rules', [AvailabilityController::class, 'getRules']);
        Route::put('/businesses/{business}/availability-rules', [AvailabilityController::class, 'setRules']);

        // Staff permission management
        Route::get('/users/search', [StaffPermissionController::class, 'searchUser']);
        Route::get('/businesses/{business}/staff/{user}/permissions',    [StaffPermissionController::class, 'index']);
        Route::post('/businesses/{business}/staff/{user}/permissions',   [StaffPermissionController::class, 'grant']);
        Route::delete('/businesses/{business}/staff/{user}/permissions/{permission}', [StaffPermissionController::class, 'revoke']);
    });

    // ── Owner always + staff if granted ───────────────────────────

    Route::middleware('permission:view_bookings')->group(function () {
        Route::get('/businesses/{business}/bookings', [BookingController::class, 'index']);
    });

    Route::middleware('permission:confirm')->group(function () {
        Route::put('/bookings/{booking}/confirm', [BookingController::class, 'confirm']);
    });

    Route::middleware('permission:cancel')->group(function () {
        Route::delete('/bookings/{booking}', [BookingController::class, 'cancel']);
    });

    Route::middleware('permission:reschedule')->group(function () {
        Route::put('/bookings/{booking}/reschedule', [BookingController::class, 'reschedule']);
    });

    Route::middleware('permission:complete')->group(function () {
        Route::put('/bookings/{booking}/complete', [BookingController::class, 'complete']);
    });

    Route::middleware('permission:manage_overrides')->group(function () {
        Route::post('/businesses/{business}/availability-overrides', [AvailabilityController::class, 'addOverride']);
    });

    // ── Client only ────────────────────────────────────────────────
    Route::middleware('role.client')->group(function () {
        // future: view own bookings, cancel own booking
    });

});