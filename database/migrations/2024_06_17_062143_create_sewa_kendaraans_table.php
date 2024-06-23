<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi.
     */
    public function up(): void
    {
        Schema::create('sewa_kendaraans', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100);
            $table->date('mulai_tanggal');
            $table->date('akhir_tanggal');
            $table->unsignedBigInteger('kendaraan_id'); // Foreign key ke tabel kendaraans
            $table->string('harga', 30);
            $table->string('metode', 20);
            $table->string('keterangan', 100)->nullable();
            $table->timestamps();

            // Menambahkan foreign key constraint
            $table->foreign('kendaraan_id')->references('id')->on('kendaraans')->onDelete('cascade');
        });
    }

    /**
     * Batalkan migrasi.
     */
    public function down(): void
    {
        Schema::dropIfExists('sewa_kendaraans');
    }
};
