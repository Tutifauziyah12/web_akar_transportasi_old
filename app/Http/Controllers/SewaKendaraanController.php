<?php

namespace App\Http\Controllers;

use App\Models\SewaKendaraan;
use App\Http\Requests\StoreSewaKendaraanRequest;
use App\Http\Requests\UpdateSewaKendaraanRequest;
use App\Models\Kas;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Inertia\Inertia;



class SewaKendaraanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = SewaKendaraan::with('kendaraan');

        if ($request->has('search')) {
            $query->where('nama', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->has('startDate') && $request->has('endDate')) {
            // Ubah format tanggal yang diterima dari JavaScript ke format Y-m-d
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));

            $query->whereBetween('mulai_tanggal', [$startDate, $endDate]);
        }

        $sewaKendaraans = $query->paginate(10);

        return Inertia::render('Sewa_Kendaraan/Index', [
            'sewaKendaraans' => $sewaKendaraans,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kendaraans = Kendaraan::all();

        return Inertia::render('Sewa_Kendaraan/Create', [
            'kendaraans' => $kendaraans
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSewaKendaraanRequest $request)
    {
        $validated = $request->validated();

        $sewaKendaraan = new SewaKendaraan($validated);

        $sewaKendaraan->save();

        $kasData = [
            'nama' => 'Sewa Kendaraan - ' . $sewaKendaraan->nama,
            'jenis' => 'Masuk',
            'tanggal' => $sewaKendaraan->mulai_tanggal,
            'biaya' => $sewaKendaraan->harga,
            'pembayaran' => $sewaKendaraan->metode,
            'keterangan' => $sewaKendaraan->keterangan,
        ];

        Kas::create($kasData);

        $namaPenyewa = $sewaKendaraan->nama;

        return redirect()->route('sewa_kendaraan.index')->with('message', sprintf("Sewa atas nama %s berhasil dibuat!", $namaPenyewa));
    }

    /**
     * Display the specified resource.
     */
    public function show(SewaKendaraan $sewaKendaraan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SewaKendaraan $sewaKendaraan)
    {
        $kendaraans = Kendaraan::all();
        return Inertia::render('Sewa_Kendaraan/Edit', [
            'sewaKendaraan' => $sewaKendaraan,
            'kendaraans' => $kendaraans
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSewaKendaraanRequest $request, SewaKendaraan $sewaKendaraan)
    {
        $validated = $request->validated();

        // Simpan nilai tanggal sebelum update
        $tanggalSebelumUpdate = $sewaKendaraan->mulai_tanggal;
        // Debug: Cetak tanggal sebelum update
        // dd('Tanggal Sebelum Update: ', $tanggalSebelumUpdate);

        // Update sewa kendaraan
        $updateResult = $sewaKendaraan->update($validated);
        // Debug: Cetak hasil update
        // dd('Sewa Kendaraan - ' . $sewaKendaraan->nama);

        // Cari kas yang sesuai dengan nama dan tanggal sebelum update
        $kas = Kas::where('nama', 'Sewa Kendaraan - ' . $sewaKendaraan->nama)
            ->where('tanggal', $tanggalSebelumUpdate)
            ->first();

        // Debug: Cetak query untuk menemukan kas
        // dd('Kas yang ditemukan: ', $kas);

        // Jika ada kas yang sesuai, update kas tersebut
        if ($kas) {
            $kasUpdateResult = $kas->update([
                'nama' => 'Sewa Kendaraan - ' . $sewaKendaraan->nama,
                'jenis' => 'Masuk',
                'tanggal' => $sewaKendaraan->mulai_tanggal,
                'biaya' => $sewaKendaraan->harga,
                'pembayaran' => $sewaKendaraan->metode,
                'keterangan' => $sewaKendaraan->keterangan,
            ]);
            // Debug: Cetak hasil update kas
            // dd('Hasil Update Kas: ', $kasUpdateResult);
        }

        $namaPenyewa = $sewaKendaraan->nama;

        return redirect()->route('sewa_kendaraan.index')->with('message', sprintf("Sewa Kendaraan atas nama %s berhasil diupdate!", $namaPenyewa));
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SewaKendaraan $sewaKendaraan)
    {
        $namaPenyewa = $sewaKendaraan->nama;
        $sewaKendaraan->delete();

        $kas = Kas::where('nama', 'Sewa Kendaraan - ' . $sewaKendaraan->nama)
            ->where('tanggal', $sewaKendaraan->mulai_tanggal)
            ->first();

        if ($kas) {
            $kas->delete();
        }

        return redirect()->back()->with('message', sprintf('Sewa atas nama %s berhasil dihapus!', $namaPenyewa));
    }
}
