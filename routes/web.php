<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/file/{path}', function ($path) {
    $filePathMovie = "content/{$path}";
    $filePathUsers = "users/{$path}";

    if (Storage::disk('private')->exists($filePathMovie)) {
        return response()->file(storage_path("app/private/{$filePathMovie}"));
    }

    if (Storage::disk('private')->exists($filePathUsers)) {
        return response()->file(storage_path("app/private/{$filePathUsers}"));
    }

    abort(404);
})->where('path', '[a-zA-Z0-9\/\-_.@]+');
