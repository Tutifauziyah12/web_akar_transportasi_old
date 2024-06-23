<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SewaKendaraanController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Auth/Login', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login', [
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/register', function () {
    return Inertia::render('Auth/Register', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/kendaraan', [KendaraanController::class, 'index'])->name('kendaraan.index');
    Route::get('/kendaraan/create', [KendaraanController::class, 'create'])->name('kendaraan.create');
    Route::post('/kendaraan', [KendaraanController::class, 'store'])->name('kendaraan.store');
    Route::get('/kendaraan/{kendaraan}/edit', [KendaraanController::class, 'edit'])->name('kendaraan.edit');
    Route::put('/kendaraan/{kendaraan}', [KendaraanController::class, 'update'])->name('kendaraan.update');
    Route::delete('/kendaraan/{kendaraan}', [KendaraanController::class, 'destroy'])->name('kendaraan.destroy');

    Route::get('/kas', [KasController::class, 'index'])->name('kas.index');
    Route::get('/kas/create', [KasController::class, 'create'])->name('kas.create');
    Route::post('/kas', [KasController::class, 'store'])->name('kas.store');
    Route::get('/kas/{kas}/edit', [KasController::class, 'edit'])->name('kas.edit');
    Route::put('/kas/{kas}', [KasController::class, 'update'])->name('kas.update');
    Route::delete('/kas/{kas}', [KasController::class, 'destroy'])->name('kas.destroy');

    Route::get('/sewa_kendaraan', [SewaKendaraanController::class, 'index'])->name('sewa_kendaraan.index');
    Route::get('/sewa_kendaraan/create', [SewaKendaraanController::class, 'create'])->name('sewa_kendaraan.create');
    Route::post('/sewa_kendaraan', [SewaKendaraanController::class, 'store'])->name('sewa_kendaraan.store');
    Route::get('/sewa_kendaraan/{sewa_kendaraan}/edit', [SewaKendaraanController::class, 'edit'])->name('sewa_kendaraan.edit');
    Route::put('/sewa_kendaraan/{sewa_kendaraan}', [SewaKendaraanController::class, 'update'])->name('sewa_kendaraan.update');
    Route::delete('/sewa_kendaraan/{sewa_kendaraan}', [SewaKendaraanController::class, 'destroy'])->name('sewa_kendaraan.destroy');

});
require __DIR__.'/auth.php';
