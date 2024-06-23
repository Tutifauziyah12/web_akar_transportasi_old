<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSewaKendaraanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules()
    {
        return [
            'mulai_tanggal' => 'required|date',
            'akhir_tanggal' => 'required|date|after_or_equal:mulai_tanggal',
            'nama' => 'required|string|max:100|not_regex:/^\s*$/',
            'kendaraan_id' => 'required|exists:kendaraans,id',
            'harga' => 'required|numeric|min:0',
            'metode' => 'required|string|in:Cash,Debit,Kredit',
            'keterangan' => 'nullable|string|max:255|not_regex:/^\s*$/',
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'mulai_tanggal.required' => 'Tanggal mulai harus diisi.',
            'mulai_tanggal.date' => 'Format tanggal mulai tidak valid.',
            'akhir_tanggal.required' => 'Tanggal akhir harus diisi.',
            'akhir_tanggal.date' => 'Format tanggal akhir tidak valid.',
            'akhir_tanggal.after_or_equal' => 'Tanggal akhir harus setelah atau sama dengan tanggal mulai.',

            'nama.required' => 'Nama harus diisi.',
            'nama.string' => 'Nama harus berupa teks.',
            'nama.max' => 'Nama tidak boleh lebih dari :max karakter.',
            'nama.not_regex' => 'Format nama tidak valid.',

            'kendaraan_id.required' => 'Kendaraan harus dipilih.',
            'kendaraan_id.exists' => 'Kendaraan yang dipilih tidak valid.',

            'harga.required' => 'Harga harus diisi.',
            'harga.numeric' => 'Harga harus berupa angka.',
            'harga.min' => 'Harga tidak boleh kurang dari :min.',

            'metode.required' => 'Metode pembayaran harus dipilih.',
            'metode.string' => 'Metode pembayaran harus berupa teks.',
            'metode.in' => 'Metode pembayaran harus salah satu dari: cash, debit, kredit.',

            'keterangan.string' => 'Keterangan harus berupa teks.',
            'keterangan.max' => 'Keterangan tidak boleh lebih dari :max karakter.',
            'keterangan.not_regex' => 'Format keterangan tidak valid.',
        ];
    }
}
