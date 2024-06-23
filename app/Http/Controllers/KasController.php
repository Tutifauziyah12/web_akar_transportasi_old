<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Http\Requests\StoreKasRequest;
use App\Http\Requests\UpdateKasRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Kas::query();

        // Search by term
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $searchTerm = $request->input('search');
                $q->where('jenis', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('nama', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('tanggal', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('biaya', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('pembayaran', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('keterangan', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by date range
        if ($request->has('startDate') && $request->has('endDate')) {
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));
            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }

        $totalsQuery = clone $query;

        $totalBiayaMasuk = $totalsQuery->where('jenis', 'Masuk')->sum('biaya');
    
        $totalsQuery = clone $query;
        $totalBiayaKeluar = $totalsQuery->where('jenis', 'Keluar')->sum('biaya');

        $kases = $query->paginate(10);

        return Inertia::render('Kas/Index', [
            'kases' => $kases,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'totalBiayaMasuk' => $totalBiayaMasuk,
            'totalBiayaKeluar' => $totalBiayaKeluar,
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Kas/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKasRequest $request)
    {
        $validated = $request->validated();

        $kas = new Kas($validated);

        $kas->save();

        $namaKas = $kas->nama;


        return redirect()->route('kas.index')->with('message', sprintf("Kas atas nama %s berhasil dibuat!", $namaKas));
    }

    /**
     * Display the specified resource.
     */
    public function show(Kas $kas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kas $kas)
    {
        return Inertia::render('Kas/Edit', [
            'kas' => $kas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKasRequest $request, Kas $kas)
    {
        $validated = $request->validated();

        $kas->update($validated);

        $namaKas = $kas->nama;

        return redirect()->route('kas.index')->with('message', sprintf("Kas atas nama %s berhasil diupdate!", $namaKas));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kas $kas)
    {
        $kas->delete();
        $namaKas = $kas->nama;

        return redirect()->back()->with('message', sprintf("Kas atas nama %s berhasil dihapus!", $namaKas));
    }
}
