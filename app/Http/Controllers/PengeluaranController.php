<?php

namespace App\Http\Controllers;

use App\Models\Pengeluaran;
use App\Http\Requests\StorePengeluaranRequest;
use App\Http\Requests\UpdatePengeluaranRequest;
use App\Models\Kas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;



class PengeluaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Pengeluaran::query();

        if ($request->has('search')) {
            $query->where('kode', 'like', '%' . $request->input('search') . '%');
        }

        $query->orderByDesc('kode');

        if ($request->has('startDate') && $request->has('endDate')) {
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));

            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }



        $pengeluaran = $query->paginate(10);

        return Inertia::render('Pengeluaran/Index', [
            'pengeluaran' => $pengeluaran,
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
        $lastPengeluaran = Pengeluaran::where('kode', 'like', 'P24%')->orderBy('kode', 'desc')->first();
        $lastKode = $lastPengeluaran ? $lastPengeluaran->kode : "P24000";

        return Inertia::render('Pengeluaran/Create', [
            'lastKode' => $lastKode
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePengeluaranRequest $request)
    {

        try {
            DB::beginTransaction();
            $validated = $request->validated();

            $kas = Kas::create([
                'kode' => $request['kode'], // Metode untuk menghasilkan kode kas unik
            ]);

            $pengeluaran = new Pengeluaran();
            $pengeluaran->kode = $validated['kode'];
            $pengeluaran->tanggal = $validated['tanggal'];
            $pengeluaran->total = $validated['total'];
            $pengeluaran->metode = $validated['metode'];
            $pengeluaran->keterangan = $validated['keterangan'];
            $pengeluaran->nama = $validated['nama'];

            $pengeluaran->save();

            DB::commit();
            return Redirect::route('pengeluaran.index')
                ->with('message', 'Data pengeluaran berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pengeluaran $pengeluaran)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pengeluaran $pengeluaran)
    {
        return Inertia::render('Pengeluaran/Edit', [
            'pengeluaran' => $pengeluaran,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePengeluaranRequest $request, Pengeluaran $pengeluaran)
    {
        $validated = $request->validated();


        $pengeluaran->update([
            'kode' => $validated['kode'],
            'tanggal' => $validated['tanggal'],
            'nama' => $validated['nama'],
            'total' => $validated['total'],
            'metode' => $validated['metode'],
            'keterangan' => $validated['keterangan'],
        ]);

        return redirect()->route('pengeluaran.index')->with('message', 'Data pengeluaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengeluaran $pengeluaran)
    {
        try {
            DB::beginTransaction();

            Kas::where('kode', $pengeluaran->kode)->delete();
            $pengeluaran->delete();

            DB::commit();

            return redirect()->route('sewa.index')->with('message', sprintf(
                "Data pengeluaran dengan code %s berhasil dihapus!",
                $pengeluaran->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }
}
