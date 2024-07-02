<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Http\Requests\StoreKasRequest;
use App\Http\Requests\UpdateKasRequest;
use App\Models\Pengeluaran;
use App\Models\Sewa;
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

    public function indexPendapatan(Request $request)
    {
        $query = Sewa::query();

        // Filter by date range
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $startDate = $request->input('startDate');
            $endDate = $request->input('endDate');
            $query->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('mulai_tanggal', [$startDate, $endDate])
                    ->orWhereBetween('akhir_tanggal', [$startDate, $endDate]);
            });
        }

        // Filter by search term if provided
        $searchTerm = $request->input('search', '');
        if ($searchTerm !== '') {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('kode', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('sewaKendaraan.kendaraan', function ($q) use ($searchTerm) {
                        $q->where('nama', 'like', '%' . $searchTerm . '%')
                            ->orWhere('no_registrasi', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('pendapatanLainnya', function ($q) use ($searchTerm) {
                        $q->where('nama', 'like', '%' . $searchTerm . '%')
                            ->orWhere('metode', 'like', '%' . $searchTerm . '%')
                            ->orWhere('total', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        // Filter by pendapatan type
        if ($request->filled('category') && $request->input('category') !== 'semua') {
            $category = $request->input('category');
            if ($category === 'pendapatan_sewa') {
                // $query->whereHas('sewaKendaraans');
                $query->whereHas('sewaKendaraan', function ($q) use ($searchTerm) {
                    if ($searchTerm !== '') {
                        $q->where(function ($q) use ($searchTerm) {
                            $q->orWhere('metode', 'like', '%' . $searchTerm . '%')
                                ->orWhere('total', 'like', '%' . $searchTerm . '%');
                        });
                    }
                });
            } elseif ($category === 'pendapatan_lainnya') {
                // Filter only pendapatan_lainnya, optionally filtered by $searchTerm
                $query->whereHas('pendapatanLainnya', function ($q) use ($searchTerm) {
                    if ($searchTerm !== '') {
                        $q->where(function ($q) use ($searchTerm) {
                            $q->where('nama', 'like', '%' . $searchTerm . '%')
                                ->orWhere('metode', 'like', '%' . $searchTerm . '%')
                                ->orWhere('total', 'like', '%' . $searchTerm . '%');
                        });
                    }
                });
            }
        }

        $sewa = $query->with(['sewaKendaraan.kendaraan', 'pendapatanLainnya' => function ($q) use ($searchTerm) {
            if ($searchTerm !== '') {
                $q->where(function ($q) use ($searchTerm) {
                    $q->where('nama', 'like', '%' . $searchTerm . '%')
                        ->orWhere('metode', 'like', '%' . $searchTerm . '%')
                        ->orWhere('total', 'like', '%' . $searchTerm . '%');
                });
            }
        }])->get();

        return Inertia::render('Kas/IndexPendapatan', [
            'status' => session('status'),
            'searchTerm' => $searchTerm,
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'category' => $request->input('category'),
            'sewa' => $sewa
        ]);
    }

    public function indexPengeluaran(Request $request)
    {
        $query = Pengeluaran::query();

        // Filter by search term
        if ($request->filled('search')) {
            $query->where('kode', 'like', '%' . $request->input('search') . '%');
        }

        // Filter by date range
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));

            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }

        // Order by kode descending
        $query->orderByDesc('kode');

        // Retrieve pengeluaran data
        $pengeluaran = $query->get();

        return Inertia::render('Kas/IndexPengeluaran', [
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'pengeluaran' => $pengeluaran
        ]);
    }


    public function indexBukuBesar(Request $request)
    {
        $query = Kas::with('sewa', 'pengeluaran', 'sewa.sewaKendaraan', 'sewa.sewaKendaraan.kendaraan', 'sewa.pendapatanLainnya');

        // Filter by date range
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $startDate = $request->input('startDate');
            $endDate = $request->input('endDate');
            $query->whereHas('sewa', function ($q) use ($startDate, $endDate) {
                $q->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('mulai_tanggal', [$startDate, $endDate])
                        ->orWhereBetween('akhir_tanggal', [$startDate, $endDate]);
                });
            });
            $query->orWhereHas('pengeluaran', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal', [$startDate, $endDate]);
            });
        }

        // Execute query to get the filtered data
        $kasList = $query->get();

        return Inertia::render('Kas/IndexBukuBesar', [
            'status' => session('status'),
            'kasList' => $kasList,
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function createSewa()
    {
        return Inertia::render('Sewa_Kendaraan/Index');
    }

    public function createLainnya()
    {
        return Inertia::render('Kas/CreateLainnya');
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
