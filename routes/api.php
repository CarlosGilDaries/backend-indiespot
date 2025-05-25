<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\API\ContentController;
use App\Http\Controllers\API\LoginController;
use App\Http\Controllers\API\ContentRolUserController;
use App\Http\Controllers\API\ContentUserController;
use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\API\RolController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\UserSessionController;
use App\Http\Controllers\API\VoteController;
//use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register', [LoginController::class, 'register']);
Route::post('login', [LoginController::class, 'login']);

Route::get('users', [UserController::class, 'index']);
Route::get('content', [ContentController::class, 'index']);

Route::get('rols', [RolController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('content/datatable', [ContentController::class, 'datatable']);
    Route::get('genders/datatable', [GenderController::class, 'datatable']);
    Route::get('users/datatable', [UserController::class, 'datatable']);
    Route::get('rols/datatable', [RolController::class, 'datatable']);
    Route::get('unlinked-users/{movieId}/datatable', [ContentRolUserController::class, 'datatable']);
    Route::get('categories/datatable', [CategoryController::class, 'datatable']);

    Route::get('manage-devices', [UserSessionController::class, 'index']);
    Route::delete('destroy-device' , [UserSessionController::class, 'destroy']);
    Route::post('new-device', [UserSessionController::class, 'store']);
    Route::get('check-device-id', [UserSessionController::class, 'checkDeviceId']);
    Route::post('logout', [LoginController::class, 'logout']);

    Route::get('users', [Usercontroller::class, 'index']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::get('current-user', [UserController::class, 'getCurrentUser']);
    Route::post('edit-user/{id}', [UserController::class, 'update']);
    Route::delete('delete-user/', [UserController::class, 'destroy']);

    //Route::get('content', [ContentController::class, 'index']);
    Route::get('content/{slug}', [ContentController::class, 'show']);
    Route::get('edit-view-content/{id}', [ContentController::class, 'editShow']);
    Route::post('add-content', [ContentController::class, 'store']);
    Route::post('update-content/{id}', [ContentController::class, 'update']);
    Route::delete('delete-content', [ContentController::class, 'destroy']);

    Route::post('link-users-with-content', [ContentRolUserController::class, 'store']);
    Route::post('unlink-user', [ContentRolUserController::class, 'destroy']);

    Route::get('favorites', [ContentUserController::class, 'show']);
    Route::post('{slug}/add-to-favorites', [ContentUserController::class, 'store']);

    Route::post('add-vote/{slug}', [VoteController::class, 'store']);
    Route::get('get-vote/{slug}', [VoteController::class, 'show']);

    Route::get('genders', [GenderController::class, 'index']);
    Route::get('gender/{id}', [GenderController::class, 'show']);
    Route::post('add-gender', [GenderController::class, 'store']);
    Route::post('edit-gender/{id}', [GenderController::class, 'update']);
    Route::delete('delete-gender', [GenderController::class, 'destroy']);

    Route::get('rol/{id}', [RolController::class, 'show']);
    Route::post('add-rol', [RolController::class, 'store']);
    Route::post('edit-rol/{id}', [RolController::class, 'update']);
    Route::delete('delete-rol', [RolController::class, 'destroy']);

    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('category/{id}', [CategoryController::class, 'show']);
    Route::post('add-category', [CategoryController::class, 'store']);
    Route::post('edit-category/{id}', [CategoryController::class, 'update']);
    Route::delete('delete-category', [CategoryController::class, 'destroy']);
});