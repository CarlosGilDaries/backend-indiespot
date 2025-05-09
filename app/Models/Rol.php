<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $fillable = [
        'name'
    ];

        public function users()
    {
    return $this->hasMany(User::class/*, 'content_user_rol'*/);
                   //->withPivot('content_id');
    }
    
    public function contents()
    {
        return $this->belongsToMany(Content::class, 'content_user_rol')
                   ->withPivot('user_id');
    }
}
