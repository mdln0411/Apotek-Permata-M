<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\ApotekerWebController;
use App\Http\Controllers\AdminWebController;
use App\Http\Controllers\WebAuthController;


Route::get('/', [LandingController::class, 'index']);

// Auth Routes
Route::get('/login', [WebAuthController::class, 'showLogin'])->name('login');
Route::post('/login', [WebAuthController::class, 'login']);
Route::get('/logout', [WebAuthController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'role:apoteker'])->prefix('apoteker')->group(function () {
    Route::get('/dashboard', [ApotekerWebController::class, 'dashboard']);
    Route::get('/orders', [ApotekerWebController::class, 'orders']);
    Route::get('/orders/export', [ApotekerWebController::class, 'exportOrders']);
    Route::get('/orders/{order}', [ApotekerWebController::class, 'orderDetail']);
    Route::post('/orders/{order}/status', [ApotekerWebController::class, 'updateOrderStatus']);
    
    Route::get('/medicines', [ApotekerWebController::class, 'medicines']);
    Route::post('/medicines', [ApotekerWebController::class, 'storeMedicine']);
    Route::put('/medicines/{medicine}', [ApotekerWebController::class, 'updateMedicine']);
    Route::delete('/medicines/{medicine}', [ApotekerWebController::class, 'destroyMedicine']);

    Route::get('/prescriptions', [ApotekerWebController::class, 'prescriptions']);
    Route::get('/prescriptions/export', [ApotekerWebController::class, 'exportPrescriptions']);
    Route::post('/prescriptions/{prescription}/status', [ApotekerWebController::class, 'updatePrescriptionStatus']);
    Route::get('/chat', [ApotekerWebController::class, 'chat']);
    Route::get('/chat/{consultation}/messages', [ApotekerWebController::class, 'getMessages']);
    Route::post('/chat/{consultation}/send', [ApotekerWebController::class, 'sendMessage']);
    Route::post('/chat/{consultation}/read', [ApotekerWebController::class, 'markAsRead']);
    Route::get('/reports', [ApotekerWebController::class, 'reports']);
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminWebController::class, 'dashboard']);
    Route::get('/users', [AdminWebController::class, 'users']);
    Route::post('/users/{user}/role', [AdminWebController::class, 'updateUserRole']);
    Route::delete('/users/{user}', [AdminWebController::class, 'destroyUser']);
    Route::get('/reports', [AdminWebController::class, 'reports']);
    Route::get('/education', [AdminWebController::class, 'education']);
    Route::post('/education', [AdminWebController::class, 'storeEducation']);
    Route::put('/education/{education}', [AdminWebController::class, 'updateEducation']);
    Route::delete('/education/{education}', [AdminWebController::class, 'destroyEducation']);
    Route::get('/medicines', [AdminWebController::class, 'medicines']);
    Route::get('/transactions', [AdminWebController::class, 'transactions']);
});




