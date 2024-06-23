import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, usePage } from "@inertiajs/react";
import { IoAddOutline, IoPencil, IoTrash } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Index({
    auth,
    kendaraans,
    searchTerm: initialSearchTerm,
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) {
            Inertia.delete(route("kendaraan.destroy", id));
        }
    };

    console.log(kendaraans);

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get(
            route("kendaraan.index"),
            { search: searchTerm },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash]);

    useEffect(() => {
        if (flash.success) {
            toast("Kendaraan berhasil dihapus");
        }
    }, [flash.success]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-gray-800 leading-tight w-full">
                    Tabel Kendaraan
                </h2>
            }
        >
            <Head title="Kendaraan" />

            <div className="py-8">
                <div className="flex justify-between mb-4">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            className="w-full border-gray-300 dark:bg-gray-800 dark:text-gray-100 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    <a
                        href={route("kendaraan.create")}
                        className="flex items-center text-xl px-2 py-1 text-slate-900 hover:text-blue-600"
                    >
                        <IoAddOutline />
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="sm:text-xs md:text-sm text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">
                                        No
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Nama
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Nomor Registrasi
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Tahun Pembuatan
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Jenis
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Warna
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 px-1 text-center"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {kendaraans.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-4 text-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            Kendaraan tidak ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    kendaraans.data.map((kendaraan, index) => (
                                        <tr
                                            key={kendaraan.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <td className="px-4 py-4">
                                                {kendaraans.from + index}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.nama}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.no_registrasi}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.tahun_pembuatan}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.jenis}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.warna}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.status}
                                            </td>
                                            <td className="px-1 py-4 flex justify-center space-x-2">
                                                <a
                                                    href={route(
                                                        "kendaraan.edit",
                                                        kendaraan.id
                                                    )}
                                                    className="px-2 py-1 text-center hover:text-yellow-600"
                                                >
                                                    <IoPencil />
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            kendaraan.id
                                                        )
                                                    }
                                                    className="px-2 py-1 text-center hover:text-red-600"
                                                >
                                                    <IoTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Menampilkan {kendaraans.from}-{kendaraans.to} dari{" "}
                            {kendaraans.total} total data
                        </p>
                    </div>
                    <div>
                        {kendaraans.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`mx-1 px-3 py-1 border rounded ${
                                    link.active
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-blue-500"
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={7000} />
        </AuthenticatedLayout>
    );
}
