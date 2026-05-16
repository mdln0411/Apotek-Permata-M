<?php

use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\ConsultationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Apotek Permata
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'message' => 'Apotek Permata API berjalan dengan baik',
    ]);
});

// --- Auth Routes ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// --- Medicines Routes (Public & Admin) ---
Route::prefix('medicines')->group(function () {
    Route::get('/categories', [MedicineController::class, 'categories']);
    Route::get('/', [MedicineController::class, 'index']);
    Route::get('/{id}', [MedicineController::class, 'show']);
    
    // Actions
    Route::post('/', [MedicineController::class, 'store']);
    Route::put('/{id}', [MedicineController::class, 'update']);
    Route::delete('/{id}', [MedicineController::class, 'destroy']);
});

// --- Education Routes ---
Route::apiResource('education', EducationController::class);

// --- Protected Routes (Butuh Login) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    // Auth Profile
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Cart System
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
    });

    // Orders System
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::post('/{id}/confirm-received', [OrderController::class, 'confirmReceived']);
        Route::post('/{id}/report', [OrderController::class, 'reportIssue']);
    });


    // --- Shared Admin/Apoteker Routes ---
    Route::middleware('role:admin,apoteker')->group(function () {
        Route::get('/admin/orders', [OrderController::class, 'allOrders']);
        Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
    });

    // --- Admin Only Routes ---
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/users', [AuthController::class, 'allUsers']);
        Route::post('/users', [AuthController::class, 'storeUser']);
        Route::put('/users/{id}', [AuthController::class, 'updateUser']);
        Route::delete('/users/{id}', [AuthController::class, 'destroyUser']);
    });


    // --- Shared Routes (Patient & Pharmacist) ---
    // Prescription Routes
    Route::get('/prescriptions', [PrescriptionController::class, 'index']);
    Route::post('/prescriptions', [PrescriptionController::class, 'store']);
    Route::put('/prescriptions/{id}/status', [PrescriptionController::class, 'updateStatus']);

    // Consultation Routes
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::post('/consultations/start', [ConsultationController::class, 'startChatWithUser']);
    Route::get('/consultations/{id}', [ConsultationController::class, 'show']);
    Route::post('/consultations/{id}/messages', [ConsultationController::class, 'sendMessage']);
    Route::post('/consultations/{id}/read', [ConsultationController::class, 'markAsRead']);


});
