<?php

use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\MedicineReminderController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Api\AllergyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Apotek Permata
|--------------------------------------------------------------------------
*/

// Health check (+ cek koneksi database)
Route::get('/health', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbOk = true;
        $dbName = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
    } catch (\Throwable $e) {
        $dbOk = false;
        $dbName = null;
    }

    return response()->json([
        'status'  => $dbOk ? 'ok' : 'degraded',
        'message' => $dbOk
            ? 'Apotek Permata API berjalan dengan baik'
            : 'API aktif tetapi database tidak terhubung. Pastikan MySQL/XAMPP sudah dijalankan.',
        'database' => [
            'connected' => $dbOk,
            'name' => $dbName,
        ],
    ], $dbOk ? 200 : 503);
});

// --- Auth Routes ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Password Reset Routes
Route::post('/auth/forgot-password', [\App\Http\Controllers\Api\PasswordResetController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [\App\Http\Controllers\Api\PasswordResetController::class, 'verifyOtp']);
Route::post('/auth/reset-password', [\App\Http\Controllers\Api\PasswordResetController::class, 'resetPassword']);

// --- Medicines Routes (Public & Admin) ---
Route::prefix('medicines')->group(function () {
    Route::get('/categories', [MedicineController::class, 'categories']);
    Route::get('/units', [MedicineController::class, 'units']);
    Route::get('/', [MedicineController::class, 'index']);
    Route::get('/{id}', [MedicineController::class, 'show']);
    
    // Actions
    Route::post('/', [MedicineController::class, 'store']);
    Route::put('/{id}', [MedicineController::class, 'update']);
    Route::delete('/{id}', [MedicineController::class, 'destroy']);
});

// --- Drug Simulation Routes (Public) ---
Route::get('/simulasi-obat/list', [MedicineController::class, 'getSimulationMedicines']);
Route::get('/simulasi-obat/check', [MedicineController::class, 'checkSimulationInteraction']);


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
    Route::post('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

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
        Route::post('/{id}/pay', [OrderController::class, 'confirmPayment']);
        Route::post('/{id}/cancel', [OrderController::class, 'cancelOrder']);
    });

    // Allergies System — by-user HARUS didefinisikan sebelum resource {allergy}
    Route::get('/allergies/by-user', [AllergyController::class, 'byUser']);
    Route::apiResource('allergies', AllergyController::class)->only(['index', 'store', 'destroy']);


    // --- Shared Admin/Apoteker Routes ---
    Route::middleware('role:admin,apoteker')->group(function () {
        Route::get('/finance/summary', [FinanceController::class, 'summary']);
        Route::get('/admin/orders', [OrderController::class, 'allOrders']);
        Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
        Route::post('/admin/orders/{id}/verify-payment', [OrderController::class, 'verifyPayment']);
    });

    // --- Admin Only Routes ---
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/users', [AuthController::class, 'allUsers']);
        Route::post('/users', [AuthController::class, 'storeUser']);
        Route::put('/users/{id}', [AuthController::class, 'updateUser']);
        Route::delete('/users/{id}', [AuthController::class, 'destroyUser']);
        Route::get('/dashboard/stats', [DashboardController::class, 'index']);
    });


    // --- Shared Routes (Patient & Pharmacist) ---
    // Prescription Routes
    Route::get('/prescriptions', [PrescriptionController::class, 'index']);
    Route::post('/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('/prescriptions/{id}', [PrescriptionController::class, 'show']);
    Route::put('/prescriptions/{id}/status', [PrescriptionController::class, 'updateStatus']);

    // Consultation Routes
    Route::get('/consultations', [ConsultationController::class, 'index']);
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::post('/consultations/start', [ConsultationController::class, 'startChatWithUser']);
    Route::get('/consultations/{id}', [ConsultationController::class, 'show']);
    Route::post('/consultations/{id}/messages', [ConsultationController::class, 'sendMessage']);
    Route::post('/consultations/{id}/read', [ConsultationController::class, 'markAsRead']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Medicine Reminders
    Route::prefix('medicine-reminders')->group(function () {
        Route::get('/', [MedicineReminderController::class, 'index']);
        Route::post('/', [MedicineReminderController::class, 'store']);
        Route::put('/{id}', [MedicineReminderController::class, 'update']);
        Route::delete('/{id}', [MedicineReminderController::class, 'destroy']);
    });
});
