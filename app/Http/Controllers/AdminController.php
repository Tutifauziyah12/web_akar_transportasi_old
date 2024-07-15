<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;



class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('Owner');
    }

    public function index(Request $request)
    {
        $searchTerm = $request->input('search');

        $users = User::query()
        ->when($searchTerm, function ($query, $searchTerm) {
            return $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('level', 'like', "%{$searchTerm}%");
            });
        })
        ->get();

        return Inertia::render('Admin/Index', [
            'users' => $users,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Create');
    }

    public function store(Request $request)
    {
        try {

            DB::beginTransaction();
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'level' => 'required|string|max:100',
                'password' => 'required|string|min:8|confirmed',
            ]);

            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'level' => $request->level,
                'password' => Hash::make($request->password),
            ]);

            DB::commit();

            return redirect()->route('admin.index')->with('message', sprintf(
                "User dengan nama %s berhasil dibuat!",
                $request['name']
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        try {
            DB::beginTransaction();
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'level' => 'required|string|max:255',
                'password' => 'nullable|string|min:8|confirmed',
            ]);

            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'level' => $request->level,
                'password' => $request->password ? bcrypt($request->password) : $user->password,
            ]);

            DB::commit();

            return redirect()->route('admin.index', ['page' => $request->currentPage])->with('message', sprintf(
                "User dengan nama %s berhasil diperbarui!",
                $user->name
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy(User $user)
    {
        try {
            DB::beginTransaction();
            $user->delete();

            DB::commit();
            return redirect()->route('admin.index')->with('message', sprintf(
                "User dengan nama %s berhasil dihapus!",
                $user->name
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }
}
