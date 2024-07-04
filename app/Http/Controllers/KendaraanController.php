<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Http\Requests\StoreKendaraanRequest;
use App\Http\Requests\UpdateKendaraanRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\QueryException;


class KendaraanController extends Controller
{
    public function index(Request $request): Response
    {
        $searchTerm = $request->input('search');

        $query = Kendaraan::query();

        if ($searchTerm) {
            $query->where('nama', 'LIKE', "%{$searchTerm}%")
                ->orWhere('no_registrasi', 'LIKE', "%{$searchTerm}%")
                ->orWhere('jenis', 'LIKE', "%{$searchTerm}%")
                ->orWhere('warna', 'LIKE', "%{$searchTerm}%")
                ->orWhere('status', 'LIKE', "%{$searchTerm}%")
                ->orWhere('tahun_pembuatan', 'LIKE', "%{$searchTerm}%");
        }

        $query->orderBy('nama', 'asc');

        $kendaraans = $query->paginate(5);

        return Inertia::render('Kendaraan/Index', [
            'kendaraans' => $kendaraans,
            'status' => session('status'),
            'searchTerm' => $searchTerm
        ]);
    }

    public function create()
    {
        return Inertia::render('Kendaraan/Create');
    }

    public function store(StoreKendaraanRequest $request)
    {
        $namaKendaraan = $request->nama;
        try {
            $validated = $request->validated();

            $kendaraan = new Kendaraan($validated);
            $kendaraan->save();

            return redirect()->route('kendaraan.index')->with('message', sprintf("Kendaraan atas nama %s berhasil dibuat!", $namaKendaraan));
        } catch (\Illuminate\Database\QueryException $exception) {
            if ($exception->errorInfo[1] === 1062) {
                return redirect()->back()->withInput()->withErrors(['no_registrasi' => 'Nomor registrasi sudah ada']);
            }

            return redirect()->back()->withInput()->withErrors(['general' => 'Terjadi kesalahan saat menyimpan kendaraan']);
        }
    }

    public function show(Kendaraan $kendaraan)
    {
        //
    }

    public function edit(Kendaraan $kendaraan)
    {
        return Inertia::render('Kendaraan/Edit', [
            'kendaraan' => $kendaraan
        ]);
    }

    public function update(UpdateKendaraanRequest $request, Kendaraan $kendaraan)
    {
        $namaKendaraan = $kendaraan->nama;
        try {
            $validated = $request->validated();
            
            if ($validated['no_registrasi'] !== $kendaraan->no_registrasi) {
                $existingKendaraan = Kendaraan::where('no_registrasi', $validated['no_registrasi'])
                    ->exists();
    
                if ($existingKendaraan) {
                    return redirect()->back()->withInput()->withErrors(['no_registrasi' => 'Nomor registrasi sudah ada']);
                }
            }
    
            $kendaraan->update($validated);
    
            return redirect()->route('kendaraan.index')->with('message', sprintf("Kendaraan atas nama %s berhasil diupdate!", $namaKendaraan));
        } catch (QueryException $exception) {
            if ($exception->errorInfo[1] === 1062) {
                if (strpos($exception->getMessage(), 'kendaraans_no_registrasi_unique') !== false) {
                    return redirect()->back()->withInput()->withErrors(['no_registrasi' => 'Nomor registrasi sudah ada']);
                }
            }
    
            return redirect()->back()->withInput()->withErrors(['general' => 'Terjadi kesalahan saat mengupdate kendaraan']);
        }
    }
    


    public function destroy(Kendaraan $kendaraan)
    {
        $kendaraan->delete();
        $namaKendaraan = $kendaraan->nama;

        return redirect()->back()->with('message', sprintf("Kendaraan atas nama %s berhasil dihapus!", $namaKendaraan));
    }
}
