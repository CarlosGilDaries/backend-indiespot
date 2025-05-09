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
use Illuminate\Support\Facades\DB;

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
            $director = Auth::user();
            $movie = new Content();
            $movie->title = $request->input('title');
            $movie->overview = $request->input('overview');
            $movie->tagline = $request->input('tagline');
            $movie->release_date = $request->input('release_date');
            $movie->vote_count = 0;
            $movie->vote_average = 0;
            $movie->type = $request->input('type');
            $movie->principal_gender_id = $request->input('principal_gender_id');
            $movie->duration = $request->input('duration');

            //Para que se puedan generar películas con el mismo título pero cada una tenga un slug único
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

            if ($request->input('type') != 'application/vnd.apple.mpegurl') {
                $content = $request->file('content');
                $contentExtension = $content->getClientOriginalExtension();
                $movie->url = '/file/' . $slug . '/' . $slug . '.' . $contentExtension;
                $content->storeAs('content/' . $slug, $slug . '.' . $contentExtension, 'private');
            } else {
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
                DB::table('content_role_user')->insert([
                    'content_id' => $movie->id,
                    'user_id' => $director->id,
                    'role_id' => 2,                   
                    'created_at' => now(),
                    'updated_at' => now(),
            ]);

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

        /*
        INSERT INTO `contents` (`id`, `title`, `overview`, `tagline`, `cover`, `release_date`, `vote_count`, `vote_average`, `type`, `duration`, `url`, `slug`, `created_at`, `updated_at`) VALUES
            (1, 'pelicula 1', 'Sinopsis larga de la película 1', 'Resumen corto de película 1', 'url-a-la-cover-1.jpg', '1993-01-29', 0, 0, 'video/mp4', 'short', 'url-a-la-pelicula-1.mp4', 'pelicula-1', NOW(), NOW());
        INSERT INTO `contents` (`id`, `title`, `overview`, `tagline`, `cover`, `release_date`, `vote_count`, `vote_average`, `type`, `duration`, `url`, `slug`, `created_at`, `updated_at`) VALUES
            (1, 'pelicula 2', 'Sinopsis larga de la película 2', 'Resumen corto de la película 2', 'url-a-la-cover-2.jpg', '1997-06-17', 0, 0, 'video/mp4', 'medium', 'url-a-la-pelicula-2.mp4', 'pelicula-2', NOW(), NOW());
        */
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        try {
            $movie = Content::where('slug', $slug)->first();

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
    public function update(Request $request, Content $content)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $movie = Content::findOrFail($id);

            $directory = ("content/{$movie->slug}");
            Storage::disk('private')->deleteDirectory($directory, true);
            Content::where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contenido eliminado con éxito.'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al eliminar el archivo: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
