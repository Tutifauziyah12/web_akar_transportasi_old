<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKendaraanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nama' => 'required|string|max:100|not_regex:/^\s*$/',
            'no_registrasi' => 'required|string|max:15|not_regex:/^\s*$/',
            'jenis' => 'required|string|max:100|not_regex:/^\s*$/',
            'tahun_pembuatan' => 'required|string|date_format:Y|max:' . date('Y'),
            'warna' => 'required|string|max:50|not_regex:/^\s*$/',
            'status' => 'required|string|in:Aktif, Perbaikan, Tidak aktif', // Tambahkan validasi untuk status
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
            'nama.required' => 'Nama harus diisi...',
            'nama.string' => 'Nama harus berupa teks.',
            'nama.max' => 'Nama tidak boleh lebih dari :max karakter.',
            'nama.not_regex' => 'Format nama tidak valid.',
            'no_registrasi.required' => 'Nomor registrasi harus diisi...',
            'no_registrasi.string' => 'Nomor registrasi harus berupa teks.',
            'no_registrasi.max' => 'Nomor registrasi tidak boleh lebih dari :max karakter.',
            'no_registrasi.not_regex' => 'Format nomor registrasi tidak valid.',
            'jenis.required' => 'Jenis harus diisi...',
            'jenis.string' => 'Jenis harus berupa teks.',
            'jenis.max' => 'Jenis tidak boleh lebih dari :max karakter.',
            'jenis.not_regex' => 'Format jenis tidak valid.',
            'tahun_pembuatan.required' => 'Tahun pembuatan harus diisi...',
            'tahun_pembuatan.string' => 'Tahun pembuatan harus berupa teks.',
            'tahun_pembuatan.date_format' => 'Tahun pembuatan harus dalam format :format.',
            'tahun_pembuatan.max' => 'Tahun pembuatan tidak boleh lebih dari :max.',
            'warna.required' => 'Warna harus diisi...',
            'warna.string' => 'Warna harus berupa teks.',
            'warna.max' => 'Warna tidak boleh lebih dari :max karakter.',
            'warna.not_regex' => 'Format warna tidak valid.',
            'status.required' => 'Status harus diisi...',
            'status.string' => 'Status harus berupa teks.',
            'status.in' => 'Status harus salah satu dari: :values.', // Pesan error untuk status
        ];
    }
}
