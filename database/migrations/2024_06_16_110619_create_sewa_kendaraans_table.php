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
        Schema::create('sewa_kendaraans', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100);
            $table->date('tanggal');
            $table->integer('jenis_kendaraan');
            $table->string('biaya', 30);
            $table->string('keterangan', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sewa_kendaraans');
    }
};
