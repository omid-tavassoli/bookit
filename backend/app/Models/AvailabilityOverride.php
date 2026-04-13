<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailabilityOverride extends Model
{
    protected $fillable = [
        'business_id',
        'date',
        'is_closed',
        'start_time',
        'end_time',
        'reason',
    ];

    protected $casts = [
        'date'      => 'date',
        'is_closed' => 'boolean',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
