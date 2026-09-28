<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmergencyController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Routes for EchoAid Caller, Responder, and Split-screen interfaces.
*/

Route::get('/', [EmergencyController::class, 'index'])->name('emergency.index');
Route::get('/responder', [EmergencyController::class, 'responder'])->name('emergency.responder');
Route::get('/split', [EmergencyController::class, 'split'])->name('emergency.split');

// API routes fallback on web for seamless CSRF session support
Route::post('/api/emergency/state', [EmergencyController::class, 'updateState'])->name('emergency.state');
Route::post('/api/emergency/sos', [EmergencyController::class, 'triggerSos'])->name('emergency.sos');
