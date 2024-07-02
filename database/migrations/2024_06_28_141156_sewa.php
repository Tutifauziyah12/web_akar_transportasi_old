<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::create('sewa', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('kode')->unique();
        //     $table->date('mulai_tanggal');
        //     $table->date('akhir_tanggal');
        //     $table->bigInteger('total');
        //     $table->string('metode');
        //     $table->timestamps();

        //     $table->foreign('kode')->references('kode')->on('kas')->onDelete('cascade');
        // });

        Schema::create('sewa', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique(); // Kolom kode yang merujuk ke tabel kas
            $table->date('mulai_tanggal');
            $table->date('akhir_tanggal');
            $table->bigInteger('total');
            $table->string('metode');
            $table->timestamps();
        
            // Tambahkan foreign key ke kolom 'kode' di tabel 'kas'
            $table->foreign('kode')->references('kode')->on('kas')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sewa');
    }
};
