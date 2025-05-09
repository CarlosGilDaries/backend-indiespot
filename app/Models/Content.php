<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
        protected $fillable = [
        'title',
        'overview',
        'tagline',
        'trailer',
        'cover',
        'release_date',
        'vote_count',
        'vote_average',
        'type',
        'principal_gender_id',
        'duration',
        'url',
        'slug',
    ];

    public function genders()
    {
        return $this->belongsToMany(Gender::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'content_rol_user')
                   ->withPivot('rol_id');
    }
    
    public function rols()
    {
        return $this->belongsToMany(Rol::class, 'content_user_rol')
                   ->withPivot('user_id');
    }
    
    // Método para obtener usuarios con un rol específico en este contenido
    public function usersWithRol($rolId)
    {
        return $this->users()->wherePivot('rol_id', $rolId);
    }
}
