<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use DataTables;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::with('contents')->get();

            return response()->json([
                'success' => true,
                'categories' => $categories
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function datatable()
    {
        try {
            $categories = Category::all();

			return DataTables::of($categories)
				->addColumn('id', function($category) {
					return $category->id;
				})
				->addColumn('name', function($category) {
					return $category->name;
				})
				->addColumn('actions', function($category) {
					return $this->getActionButtons($category);
				})
				->rawColumns(['actions'])
				->make(true);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $category = Category::where('id', $id)->first();

            return response()->json([
                'success' => true,
                'category' => $category,
                'message' => 'Categoría obtenida con éxito.'
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
            $category = new Category();

            //$name = sanitize_html($request->input('name'));
            $category->name = $request->input('name');

            $category->save();

            return response()->json([
                'success' => true,
                'category' => $category
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $category = Category::where('id', $id)->first();

        //$name = sanitize_html($request->input('name'));
        $category->name = $request->input('name');

        $category->save();

        return response()->json([
            'success' => true,
            'category' => $category
        ], 200);
    }

    public function destroy(Request $request)
    {
        try {
            $id = $request->input('content_id');
            $category = Category::where('id', $id)->first();
            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada con éxito'
            ], 200);

        } catch(\Exception $e) {
            Log::error('Error al eliminar categoría: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function getActionButtons($category)
	{
		$id = $category->id;

		return '
			<div class="actions-container">
				<button class="actions-button orders-button">Acciones</button>
				<div class="actions-menu">
					<a href="/admin/edit-category.html" class="action-item content-action edit-button" data-id="'.$id.'">Editar</a>
                    <form class="category-delete-form" data-id="' . $id . '">
						<input type="hidden" name="content_id" value="' . $id . '">
						<button class="action-item content-action delete-btn" type="submit">Eliminar</button>
					</form>
				</div>
			</div>';
	}
}
