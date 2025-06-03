<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'surnames',
        'email',
        'password',
        'curriculum',
        'portfolio',
        'rol_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userSession() 
    {
        return $this->hasOne(UserSession::class);
    }

    public function contents()
    {
        return $this->belongsToMany(Content::class, 'content_rol_user')
                   ->withPivot('rol_id');
    }
    
    public function rol()
    {
        return $this->belongsTo(Rol::class);
    }
    
    // Contenidos favoritos
    public function favorites()
    {
        return $this->belongsToMany(Content::class, 'content_user');
    }
}
