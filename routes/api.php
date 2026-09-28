<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmergencyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/emergency/state', [EmergencyController::class, 'updateState']);
Route::post('/emergency/sos', [EmergencyController::class, 'triggerSos']);
