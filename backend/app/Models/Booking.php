<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'business_id',
        // 'service_id',
        'client_name',
        'client_email',
        'booking_date',
        'booking_time',
        'duration_minutes',
        'status',
        'notes',
    ];

    protected $casts = [
    'booking_date' => 'date:Y-m-d',
    'booking_time' => 'string',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    // Status transition
    public function isPending(): bool    { return $this->status === 'pending'; }
    public function isConfirmed(): bool  { return $this->status === 'confirmed'; }
    public function isCancelled(): bool  { return $this->status === 'cancelled'; }
    public function isCompleted(): bool  { return $this->status === 'completed'; }
    
}
