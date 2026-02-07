<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
     use HasFactory;

    protected $fillable = [
        'outlet_id',
        'total_price',
        'status',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function outlet()
    {
        return $this->belongsTo(User::class, 'outlet_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
