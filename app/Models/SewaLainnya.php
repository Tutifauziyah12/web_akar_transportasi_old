<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SewaLainnya extends Model
{
    use HasFactory;
    protected $table = 'sewa_lainnya';

    protected $fillable = [
        'kode_sewa',
        'nama',
        'total',
        'jumlah',
        'metode',
    ];

    public function sewa()
    {
        return $this->belongsTo(Sewa::class, 'kode_sewa', 'kode');
    }
}
