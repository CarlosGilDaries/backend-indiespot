<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ContentUserController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store($slug)
    {
        try {
            $user = Auth::user();
            $content = Content::where('slug', $slug)->first();

            DB::table('content_user')->insert([
                'content_id' => $content->id,
                'user_id' => $user->id,                 
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Contenido añadido a favoritos con éxito.',
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        try {
            $user = Auth::user();
            $favorites = $user->favorites;

            return response()->json([
                'success' => true,
                'favorites' => $favorites,
                'message' => 'Listado de favoritos obtenido con éxito.',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
