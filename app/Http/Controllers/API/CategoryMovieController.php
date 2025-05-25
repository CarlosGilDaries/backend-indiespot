<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Content;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class CategoryMovieController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::withCount('contents')
                ->has('contents')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());
             return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {           
            foreach ($request->categories as $category) {
                 if (!isset($plan['id'])){
                    continue;
                }

                DB::table('category_content')->insert([
                    'content_id' => $request->content_id,
                    'category_id' => $category['id'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Contenido vinculado a categorías con éxito.'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);

        } catch (QueryException $e) {
            Log::error('Error: ' . $e->getMessage());

            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'El contenido y la categoría ya están vinculados.'
                ], 409);
            }
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
