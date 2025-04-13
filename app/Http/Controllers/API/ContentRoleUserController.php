<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Content;

class ContentRoleUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            foreach($request->users as $user) {
                DB::table('content_role_user')->insert([
                    'content_id' => $request->content_id,
                    'user_id' => $user['id'],
                    'role_id' => $user['role_id'],                   
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Usuarios y roles vinculados al contenido con éxito.'
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
    public function show($slug)
    {
        try {
            $content = Content::where('slug', $slug)->firstOrFail();
            $actors = $content->usersWithRole(1)->get();
            $directors = $content->usersWithRole(2)->get();
            $productors = $content->usersWithRole(3)->get();
            $photo_directors = $content->usersWithRole(4)->get();
            $screenwriter = $content->usersWithRole(5)->get();
            $operators = $content->usersWithRole(6)->get();
            $sound_engineers = $content->usersWithRole(7)->get();
            $editors = $content->usersWithRole(8)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'actors' => $actors,
                    'directors' => $directors,
                    'productors' => $productors,
                    'photo_directors' => $photo_directors,
                    'screenwriter' => $screenwriter,
                    'operators' => $operators,
                    'sound_engineers' => $sound_engineers,
                    'editors' => $editors
                ],
                'message' => 'Usuarios con roles en el contenido obtenidos con éxito.'
            ],200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
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
