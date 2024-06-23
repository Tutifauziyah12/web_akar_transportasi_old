<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Models\Kendaraan;
use App\Models\SewaKendaraan;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today('Asia/Jakarta');
        $totalSewaHariIni = SewaKendaraan::whereDate('mulai_tanggal', $today)->count();

        $endOfMonth = Carbon::now()->endOfMonth();
        $sewaAktifSampaiAkhirBulan = SewaKendaraan::whereDate('akhir_tanggal', '>=', $today)
            ->whereDate('akhir_tanggal', '<=', $endOfMonth)
            ->count();
        $startOfMonth = Carbon::now()->startOfMonth();
        $totalSewaBulanIni = SewaKendaraan::where(function ($query) use ($startOfMonth, $endOfMonth) {
            $query->whereDate('mulai_tanggal', '>=', $startOfMonth)
                ->orWhereDate('akhir_tanggal', '<=', $endOfMonth);
        })
            ->count();

        $totalUangMasukHariIni = Kas::whereDate('tanggal', $today)
            ->where('jenis', 'Masuk')
            ->sum('biaya');
        $totalUangKeluarHariIni = Kas::whereDate('tanggal', $today)
            ->where('jenis', 'Keluar')
            ->sum('biaya');

        $totalUangMasukBulanIni = Kas::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->where('jenis', 'Masuk')
            ->sum('biaya');

        $totalUangKeluarBulanIni = Kas::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->where('jenis', 'Keluar')
            ->sum('biaya');


        $aktifCount = Kendaraan::where('status', 'Aktif')->count();

        // Mendapatkan jumlah kendaraan dalam perbaikan
        $perbaikanCount = Kendaraan::where('status', 'Perbaikan')->count();

        // Mendapatkan jumlah kendaraan non-aktif
        $nonAktifCount = Kendaraan::where('status', '!=', 'Aktif')
            ->where('status', '!=', 'Perbaikan')
            ->count();
        return Inertia::render('Dashboard', [
            'totalSewaHariIni' => $totalSewaHariIni,
            'aktifCount' => $aktifCount,
            'perbaikanCount' => $perbaikanCount,
            'nonAktifCount' => $nonAktifCount,
            'sewaAktifSampaiAkhirBulan' => $sewaAktifSampaiAkhirBulan,
            'totalSewaBulanIni' => $totalSewaBulanIni,
            'totalUangMasukHariIni' => $totalUangMasukHariIni,
            'totalUangKeluarHariIni' => $totalUangKeluarHariIni,
            'totalUangMasukBulanIni' => $totalUangMasukBulanIni,
            'totalUangKeluarBulanIni' => $totalUangKeluarBulanIni,
        ]);
    }
}
