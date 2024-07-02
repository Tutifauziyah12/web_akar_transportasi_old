<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sewa extends Model
{
    use HasFactory;
    protected $table = 'sewa';


    protected $fillable = [
        'kode',
        'mulai_tanggal',
        'akhir_tanggal',
        'total',
        'metode',
        'kas_kode',
    ];

    public function kas()
    {
        return $this->belongsTo(Kas::class, 'kode', 'kode');
    }

    public function sewaKendaraan()
    {
        return $this->hasMany(SewaKendaraan::class, 'kode', 'kode');
    }

    public function pendapatanLainnya()
    {
        return $this->hasMany(SewaLainnya::class, 'kode_sewa', 'kode');
    }
}
