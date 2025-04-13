<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
        protected $fillable = [
        'title',
        'overview',
        'tagline',
        'cover',
        'release_date',
        'vote_count',
        'vote_average',
        'type',
        'duration',
        'url',
        'slug',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'content_role_user')
                   ->withPivot('role_id');
    }
    
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'content_user_role')
                   ->withPivot('user_id');
    }
    
    // Método para obtener usuarios con un rol específico en este contenido
    public function usersWithRole($roleId)
    {
        return $this->users()->wherePivot('role_id', $roleId);
    }
}
