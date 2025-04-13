<?php

use App\Http\Controllers\API\ContentController;
use App\Http\Controllers\API\LoginController;
use App\Http\Controllers\API\ContentRoleUserController;
use App\Http\Controllers\API\ContentUserController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\UserSessionController;
use App\Http\Controllers\API\VoteController;
//use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register', [LoginController::class, 'register']);
Route::post('login', [LoginController::class, 'login']);

Route::get('users', [UserController::class, 'index']);
Route::get('content', [ContentController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('manage-devices', [UserSessionController::class, 'index']);
    Route::delete('destroy-device' , [UserSessionController::class, 'destroy']);
    Route::post('new-device', [UserSessionController::class, 'store']);

    Route::get('users/{id}', [UserController::class, 'show']);

    Route::get('content/{slug}', [ContentController::class, 'show']);
    Route::get('{slug}/role-users', [ContentRoleUserController::class, 'show']);
    Route::post('link-users-with-content', [ContentRoleUserController::class, 'store']);

    Route::get('favorites', [ContentUserController::class, 'show']);
    Route::post('{slug}/add-to-favorites', [ContentUserController::class, 'store']);

    Route::post('add-vote/{slug}', [VoteController::class, 'store']);
    Route::get('get-vote/{slug}', [VoteController::class, 'show']);
});