<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailabilityRule extends Model
{
    protected $fillable = [
        'business_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

     public function getDayNameAttribute(): string
    {
        return ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][$this->day_of_week];
    }
}
