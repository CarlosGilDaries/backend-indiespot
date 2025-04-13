<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name'
    ];

        public function users()
    {
        return $this->belongsToMany(User::class, 'content_user_role')
                   ->withPivot('content_id');
    }
    
    public function contents()
    {
        return $this->belongsToMany(Content::class, 'content_user_role')
                   ->withPivot('user_id');
    }
}
