<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\Gender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $content = Content::all();
            $genders = Gender::all();

            return response()->json([
                'success' => true,
                'data' => [
                    'movies' => $content,
                    'genders' => $genders,
                ],
                'message' => 'Contenido obtenido con éxito'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al listar contenido: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $movie = new Content();
            $movie->title = $request->input('title');
            $movie->overview = $request->input('overview');
            $movie->tagline = $request->input('tagline');
            $movie->release_date = $request->input('release_date');
            $movie->vote_count = 0;
            $movie->vote_average = 0;
            $movie->type = $request->input('type');
            $movie->gender_id = $request->input('gender_id');
            $movie->duration = $request->input('duration');
            $movie->duration_type_name = $request->input('duration_type_name');

            $slug = Str::slug($request->input('title'), '-');
            $counter = 1;
            while (Content::where('slug', $slug)->exists()) {
                $slug = Str::slug($request->input('title'), '-') . '-remake-' . $counter;
                $counter++;
            }
            $movie->slug = $slug;

            $trailer = $request->file('trailer');
            if ($trailer) {
                $trailerExtension = $trailer->getClientOriginalExtension();
                $movie->trailer = '/file/' . $slug . '/' . $slug . '-trailer.' . $trailerExtension;
                $trailer->storeAs('content/' . $slug, $slug . '-trailer.' . $trailerExtension, 'private');
            }

            $cover = $request->file('cover');
            if ($cover) {
                $coverExtension = $cover->getClientOriginalExtension();
                $movie->cover = '/file/' . $slug . '/' . $slug . '-img.' . $coverExtension;
                $cover->storeAs('content/' . $slug, $slug . '-img.' . $coverExtension, 'private');
            }
            $cover->storeAs('content/' . $slug, $slug . '-img.' . $coverExtension, 'private');

            $content = $request->file('content');
            $hls_content = $request->file('m3u8');
            if ($content && $request->input('type') != 'application/vnd.apple.mpegurl') {
                $content = $request->file('content');
                $contentExtension = $content->getClientOriginalExtension();
                $movie->url = '/file/' . $slug . '/' . $slug . '.' . $contentExtension;
                $content->storeAs('content/' . $slug, $slug . '.' . $contentExtension, 'private');
            } 
            else if ($hls_content && $request->input('type') == 'application/vnd.apple.mpegurl') {
                $content = $request->file('m3u8');
                //$mime = $content->getMimeType();
                //dd($mime);
                $contentExtension = $content->getClientOriginalExtension();
                $movie->url = '/file/' . $slug . '/' . $slug . '.' . $contentExtension;
                $content->storeAs('content/' . $slug, $slug . '.' . $contentExtension, 'private');

                $zips = ['ts1', 'ts2', 'ts3'];
                $extractPath = storage_path('app/private/content/' . $slug);

                if (!file_exists($extractPath)) {
                    mkdir($extractPath, 0777, true);
                }

                foreach ($zips as $zipKey) {
                    $zipFile = $request->file($zipKey);
                    if ($zipFile) {
                        $zip = new \ZipArchive;
                        if ($zip->open($zipFile->getRealPath()) === true) {
                            $zip->extractTo($extractPath);
                            $zip->close();
                        }
                    }
                }

            }

            $movie->save();

            return response()->json([
                'success' => true,
                'movie' => $movie,
                'message' => $movie->title . ' subido correctamente'
            ], 201);

        } catch (\Exception $e) {
            // Limpiar archivos subidos en caso de error
            if (isset($slug)) {
                Storage::disk('private')->deleteDirectory('content/' . $slug);
            }

            Log::error('Error al crear contenido: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        try {
            $movie = Content::where('slug', $slug)->with(['users.rol'])->first();

            if (!$movie) {
                return response()->json([
                    'success' => false,
                    'error' => 'Película no encontrada.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'movie' => $movie,
                'message' => 'Película obtenida con éxito.'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al obtener película: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function editShow($id)
    {
        try {
            $movie = Content::where('id', $id)->first();

            if (!$movie) {
                return response()->json([
                    'success' => false,
                    'error' => 'Película no encontrada.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'movie' => $movie,
                'message' => 'Película obtenida con éxito.'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al obtener película: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {            
            $movie = Content::where('id', $id)->first();
            $title = $request->input('title');
            $movie->overview = $request->input('overview');
            $movie->tagline = $request->input('tagline');
            $movie->release_date = $request->input('release_date');
            $movie->vote_count = 0;
            $movie->vote_average = 0;
            $movie->gender_id = $request->input('gender_id');
            $movie->duration = $request->input('duration');
            $movie->duration_type_name = $request->input('duration_type_name');

            $oldSlug = $movie->slug;
            // El slug sólo cambia si ha cambiado el título
            if ($movie->title !== $title) {
                $newSlug = Str::slug($request->input('title'), '-');
                $counter = 1;
                while (Content::where('slug', $newSlug)->exists()) {
                    $newSlug = Str::slug($request->input('title'), '-') . '-remake-' . $counter;
                    $counter++;
                }
                $movie->slug = $newSlug;
            }
            $movie->title = $title;

            if ($oldSlug != $movie->slug) {
                $oldPath = 'content/' . $oldSlug;
                $newPath = 'content/' . $movie->slug;

                // Verificar si existe la carpeta antigua
                if (Storage::disk('private')->exists($oldPath)) {
                    if ($movie->trailer) {
                        $movie->trailer = str_replace($oldSlug, $movie->slug, $movie->trailer);
                        Storage::disk('private')->move('content/' . $oldSlug . '/' . $oldSlug . '-trailer.mp4', 'content/' . $movie->slug . '/' . $movie->slug  . '-trailer.mp4');
                    }
                    $movie->cover = str_replace($oldSlug, $movie->slug, $movie->cover);
                    Storage::disk('private')->move('content/' . $oldSlug . '/' . $oldSlug . '-img.jpg', 'content/' . $movie->slug . '/' . $movie->slug  . '-img.jpg');
                    $movie->url = str_replace($oldSlug, $movie->slug, $movie->url);
                    if ($movie->type == 'video/mp4') {
                        Storage::disk('private')->move('content/' . $oldSlug . '/' . $oldSlug . '.mp4', 'content/' . $movie->slug . '/' . $movie->slug  . '.mp4');
                    } else {
                        Storage::disk('private')->move('content/' . $oldSlug . '/' . $oldSlug . '.m3u8', 'content/' . $movie->slug . '/' . $movie->slug  . '.m3u8');
                        $files = Storage::disk('private')->allFiles($oldPath);
                        foreach ($files as $file) {
                            $relativePath = str_replace($oldPath . '/', '', $file);
                            Storage::disk('private')->move($file, $newPath . '/' . $relativePath);
                        }
                    
                    }
                    Storage::disk('private')->deleteDirectory($oldPath);
                }
            }

            $trailer = $request->file('trailer');
            if ($trailer) {
                Storage::disk('private')->delete('content/' . $movie->slug . '/' . $movie->slug  . '-trailer.mp4');
                $trailerExtension = $trailer->getClientOriginalExtension();
                $movie->trailer = '/file/' . $movie->slug . '/' . $movie->slug . '-trailer.' . $trailerExtension;
                $trailer->storeAs('content/' . $movie->slug, $movie->slug . '-trailer.' . $trailerExtension, 'private');
            }

            $cover = $request->file('cover');
            if ($cover) {
                Storage::disk('private')->delete('content/' . $movie->slug . '/' . $movie->slug  . '-img.jpg');
                $coverExtension = $cover->getClientOriginalExtension();
                $movie->cover = '/file/' . $movie->slug . '/' . $movie->slug . '-img.' . $coverExtension;
                $cover->storeAs('content/' . $movie->slug, $movie->slug . '-img.' . $coverExtension, 'private');
            }
            
            $content = $request->file('content');
            $hls_content = $request->file('m3u8');
            if ($content && $request->input('type') == 'video/mp4') {
                if ($movie->type == 'application/vnd.apple.mpegurl') {
                    Storage::disk('private')->delete('content/' . $movie->slug . '/' . $movie->slug  . '.m3u8');
                    $basePath = 'content/' . $movie->slug;
                    $subdirectories = Storage::disk('private')->directories($basePath);
                    // Eliminar cada subdirectorio (con todo su contenido)
                    foreach ($subdirectories as $dir) {
                        Storage::disk('private')->deleteDirectory($dir);
                    }
                } else {
                    Storage::disk('private')->delete('content/' . $movie->slug . '/' . $movie->slug  . '.mp4');
                }
                $content = $request->file('content');
                $contentExtension = $content->getClientOriginalExtension();
                $movie->url = '/file/' . $movie->slug . '/' . $movie->slug . '.' . $contentExtension;
                $content->storeAs('content/' . $movie->slug, $movie->slug . '.' . $contentExtension, 'private');
            } 
            else if ($hls_content && $request->input('type') == 'application/vnd.apple.mpegurl') {
                if ($movie->type == 'application/vnd.apple.mpegurl') {
                    Storage::disk('private')->delete('content/' . $movie->slug . '/' . $movie->slug  . '.m3u8');
                } else {
                    Storage::disk('private')->delete('content/' . $movie->slug . '/' . $movie->slug  . '.mp4');
                }
                $content = $request->file('m3u8');
                $contentExtension = $content->getClientOriginalExtension();
                $movie->url = '/file/' . $movie->slug . '/' . $movie->slug . '.' . $contentExtension;
                $content->storeAs('content/' . $movie->slug, $movie->slug . '.' . $contentExtension, 'private');               
                $basePath = 'content/' . $movie->slug;
                $subdirectories = Storage::disk('private')->directories($basePath);
                // Eliminar cada subdirectorio (con todo su contenido)
                foreach ($subdirectories as $dir) {
                    Storage::disk('private')->deleteDirectory($dir);
                }

                $zips = ['ts1', 'ts2', 'ts3'];
                $extractPath = storage_path('app/private/content/' . $movie->slug);

                if (!file_exists($extractPath)) {
                    mkdir($extractPath, 0777, true);
                }

                foreach ($zips as $zipKey) {
                    $zipFile = $request->file($zipKey);
                    if ($zipFile) {
                        $zip = new \ZipArchive;
                        if ($zip->open($zipFile->getRealPath()) === true) {
                            $zip->extractTo($extractPath);
                            $zip->close();
                        }
                    }
                }
            }
            $movie->type = $request->input('type');

            $movie->save();
                /*DB::table('content_role_user')->insert([
                    'content_id' => $movie->id,
                    'user_id' => $director->id,
                    'role_id' => 2,                   
                    'created_at' => now(),
                    'updated_at' => now(),
            ]);*/

            return response()->json([
                'success' => true,
                'movie' => $movie,
                'message' => $movie->title . ' subido correctamente'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al editar contenido: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
	{
		try {
			$id = $request->input('content_id');
			$content = Content::where('id', $id)->first();

			if (Auth::check() && Auth::user()->type == 'admin') {
				$directory = ("content/{$content->slug}");
				Storage::disk('private')->deleteDirectory($directory, true);
				Content::where('id', $id)->delete();

				return response()->json([
					'success' => true,
					'message' => 'Contenido eliminado con éxito'
				], 200);
			}
		} catch (\Exception $e) {
			Log::error('Error al eliminar el archivo: ' . $e->getMessage());

			return response()->json([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage(),
			], 500);
		}
	}
}
