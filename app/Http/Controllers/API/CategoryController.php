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
			$categories = Category::with(['contents.gender' => function ($query) {
				$query->orderBy('created_at', 'desc');
			}])
            ->where('render_at_index', 1)
            ->orderBy('priority')
            ->get();
            $priorities = Category::all()->sortBy('priority')->pluck('priority')->toArray();

            return response()->json([
                'success' => true,
                'categories' => $categories,
                'priorities' => $priorities
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function dropDownMenu()
	{
		try {
			$categories = Category::orderBy('priority')->with('contents.gender')->get();
            $priorities = Category::all()->sortBy('priority')->pluck('priority')->toArray();

			return response()->json([
				'success' => true,
				'categories' => $categories,
                'priorities' => $priorities
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
				->addColumn('priority', function($category) {
					return $category->priority;
				})
				->addColumn('name', function($category) {
					return $category->name;
				})
                ->addColumn('render', function($category) {
					return $category->render_at_index;
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
            $category = Category::with('contents.gender')->where('id', $id)->first();

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

            $category->name = $request->input('name');
            $newPriority = $request->input('priority');
            
            // Si la prioridad ya existe, desplazar las categorías existentes
            if (Category::where('priority', $newPriority)->exists()) {
                Category::where('priority', '>=', $newPriority)
                       ->increment('priority');
            }
            $category->priority = $newPriority;
            $category->render_at_index = $request->input('render_at_index');
    
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
        try {
            $category = Category::where('id', $id)->first();
            $category->name = $request->input('name');
            $category->render_at_index = $request->input('render_at_index');
            $currentPriority = $category->priority;
            $newPriority = $request->input('priority');
            
            if ($currentPriority != $newPriority) {
                if ($newPriority < $currentPriority) {
                    // Mover hacia arriba (prioridad más alta)
                    Category::where('priority', '>=', $newPriority)
                        ->where('priority', '<', $currentPriority)
                        ->increment('priority');
                } else {
                    // Mover hacia abajo (prioridad más baja)
                    Category::where('priority', '>', $currentPriority)
                        ->where('priority', '<=', $newPriority)
                        ->decrement('priority');
                }
                
                $category->priority = $newPriority;
            }
    
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

    public function destroy(Request $request)
    {
        try {
            $id = $request->input('content_id');
            $category = Category::findOrFail($id);
            $deletedPriority = $category->priority;
            
            $category->delete();
            
            // Reordenar las categorías restantes si la eliminada no era la última
            $maxPriority = Category::max('priority') ?? 0;           
            if ($deletedPriority < $maxPriority) {
                Category::where('priority', '>', $deletedPriority)
                       ->decrement('priority');
            }

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
