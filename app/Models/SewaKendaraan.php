<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SewaKendaraan extends Model
{
    use HasFactory;

    protected $table = 'sewa_kendaraans';

    protected $fillable = [
        'nama',
        'mulai_tanggal',
        'akhir_tanggal',
        'kendaraan_id', // Tambahkan kendaraan_id ke fillable
        'harga',
        'metode',
        'keterangan'
    ];

    // Mendefinisikan relasi many-to-one dengan Kendaraan
    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class);
    }
}
