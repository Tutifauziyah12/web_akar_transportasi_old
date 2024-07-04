<?php

namespace App\Http\Controllers;

use App\Models\SewaKendaraan;
use App\Http\Requests\StoreSewaKendaraanRequest;
use App\Http\Requests\UpdateSewaKendaraanRequest;
use App\Http\Requests\UpdateSewaRequest;
use App\Models\Kas;
use App\Models\Kendaraan;
use App\Models\Sewa;
use App\Models\SewaLainnya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class SewaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Sewa::query();

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('kode', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('sewaKendaraan.kendaraan', function ($q) use ($searchTerm) {
                        $q->where('nama', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('sewaKendaraan.kendaraan', function ($q) use ($searchTerm) {
                        $q->where('no_registrasi', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhere('total', 'like', '%' . $searchTerm . '%')
                    ->orWhere('nama', 'like', '%' . $searchTerm . '%')
                    ->orWhere('metode', 'like', '%' . $searchTerm . '%');
            });
        }

        $query->orderByDesc('kode');


        if ($request->has('startDate') && $request->has('endDate')) {
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));

            $query->whereBetween('mulai_tanggal', [$startDate, $endDate]);
        }



        $sewa = $query->with('sewaKendaraan.kendaraan')->paginate(10);

        return Inertia::render('Pendapatan/Index', [
            'sewa' => $sewa,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
        ]);
    }

    public function indexLainnya(Request $request)
    {
        $query = SewaLainnya::query();

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('kode_sewa', 'like', '%' . $searchTerm . '%')
                  ->orWhere('nama', 'like', '%' . $searchTerm . '%')
                  ->orWhere('jumlah', 'like', '%' . $searchTerm . '%')
                  ->orWhere('total', 'like', '%' . $searchTerm . '%')
                  ->orWhere('metode', 'like', '%' . $searchTerm . '%');
            });
        }

        $query->orderByDesc('kode_sewa');


        if ($request->has('startDate') && $request->has('endDate')) {
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));

            $query->whereHas('sewa', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('mulai_tanggal', [$startDate, $endDate]);
            });
        }



        $sewa = $query->with('sewa')->paginate(10);

        return Inertia::render('Pendapatan/IndexLainnya', [
            'sewa' => $sewa,
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
        $sewa = Sewa::all();

        $lastSewa = Sewa::where('kode', 'like', 'PS24%')->orderBy('kode', 'desc')->first();
        $lastKode = $lastSewa ? $lastSewa->kode : "PS24000";

        return Inertia::render('Pendapatan/Create', [
            'kendaraans' => $kendaraans,
            'sewa' => $sewa,
            'lastKode' => $lastKode
        ]);
    }

    public function store(StoreSewaKendaraanRequest $request)
    {
        try {

            DB::beginTransaction();

            $validated = $request->validated();

            $kas = Kas::create([
                'kode' => $request['kode'], // Metode untuk menghasilkan kode kas unik
            ]);

            $sewa = Sewa::create($validated);

            foreach ($request->input('kendaraan_ids') as $kendaraanId) {
                SewaKendaraan::create([
                    'kode' => $sewa->kode,
                    'kendaraan_id' => $kendaraanId,
                ]);
            }

            $errors = [];
            foreach ($request->input('pendapatanLainnya') as $index => $sewaLainnyaItem) {
                $validator = Validator::make($sewaLainnyaItem, [
                    'nama' => 'required|string|max:255',
                    'total' => 'required|numeric|min:0',
                    'jumlah' => 'required|integer|min:0',
                    'metode' => 'required|string|in:Cash,Debit,Kredit',
                ]);

                if ($validator->fails()) {
                    $errorMessage = implode(' ', $validator->errors()->all());
                    return back()->withInput()->withErrors($errorMessage);
                } else {
                    SewaLainnya::create([
                        'kode_sewa' => $sewa->kode,
                        'nama' => $sewaLainnyaItem['nama'],
                        'total' => $sewaLainnyaItem['total'],
                        'jumlah' => $sewaLainnyaItem['jumlah'],
                        'metode' => $sewaLainnyaItem['metode'],
                    ]);
                }
            }

            if (!empty($errors)) {
                DB::rollback();
                return back()->withInput()->withErrors($errors);
            }

            DB::commit();

            return redirect()->route('sewa.index')->with('message', sprintf(
                "Sewa dengan code %s berhasil dibuat!",
                $request['kode']
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }




    /**
     * Display the specified resource.
     */
    public function show(Sewa $sewa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sewa $sewa)
    {
        $sewa->load('sewaKendaraan.kendaraan', 'pendapatanLainnya');
        $kendaraan_ids = $sewa->sewaKendaraan->pluck('kendaraan_id')->toArray();

        $kendaraans = Kendaraan::all();

        return Inertia::render('Pendapatan/Edit', [
            'sewa' => $sewa,
            'kendaraans' => $kendaraans,
            'kendaraan_ids' => $kendaraan_ids,
            'pendapatanLainnya' => $sewa->pendapatanLainnya,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Sewa $sewa, UpdateSewaRequest $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            // dd($request);

            $sewa->update($validated);

            SewaKendaraan::where('kode', $sewa->kode)->delete();

            foreach ($request->input('kendaraan_ids') as $kendaraanId) {
                SewaKendaraan::create([
                    'kode' => $sewa->kode,
                    'kendaraan_id' => $kendaraanId,
                ]);
            }

            SewaLainnya::where('kode_sewa', $sewa->kode)->delete();

            $errors = [];
            foreach ($request->input('pendapatanLainnya') as $index => $sewaLainnyaItem) {
                $validator = Validator::make($sewaLainnyaItem, [
                    'nama' => 'required|string|max:255',
                    'total' => 'required|numeric|min:0',
                    'jumlah' => 'required|integer|min:0',
                    'metode' => 'required|string|in:Cash,Debit,Kredit',
                ]);

                if ($validator->fails()) {
                    $errors[$index] = $validator->errors()->all();
                } else {
                    SewaLainnya::create([
                        'kode_sewa' => $sewa->kode,
                        'nama' => $sewaLainnyaItem['nama'],
                        'total' => $sewaLainnyaItem['total'],
                        'jumlah' => $sewaLainnyaItem['jumlah'],
                        'metode' => $sewaLainnyaItem['metode'],
                    ]);
                }
            }

            if (!empty($errors)) {
                DB::rollback();
                return back()->withInput()->withErrors($errors);
            }

            DB::commit();

            return redirect()->route('sewa.index', ['page' => $request->currentPage])->with('message', sprintf(
                "Sewa dengan code %s berhasil diperbarui!",
                $sewa->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()]);
        }
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sewa $sewa)
    {
        try {
            DB::beginTransaction();

            SewaKendaraan::where('kode', $sewa->kode)->delete();

            SewaLainnya::where('kode_sewa', $sewa->kode)->delete();

            Kas::where('kode', $sewa->kode)->delete();

            $sewa->delete();

            DB::commit();

            return redirect()->route('sewa.index')->with('message', sprintf(
                "Sewa dengan code %s berhasil dihapus!",
                $sewa->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }
}
