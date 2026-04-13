<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Business extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'timezone',
        'phone',
        'email',
        'description'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function availabilityRules()
    {
        return $this->hasMany(AvailabilityRule::class);
    }

    public function availabilityOverrides()
    {
        return $this->hasMany(AvailabilityOverride::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function staffPermissions()
    {
        return $this->hasMany(StaffPermission::class);
    }
}