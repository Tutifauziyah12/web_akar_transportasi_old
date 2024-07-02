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
        Schema::create('sewa_lainnya', function (Blueprint $table) {
            $table->id();
            $table->string('kode_sewa');
            $table->string('nama');
            $table->bigInteger('total');
            $table->integer('jumlah');
            $table->string('metode');
            $table->timestamps();

            $table->foreign('kode_sewa')->references('kode')->on('sewa')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sewa_lainnya');
    }
};
