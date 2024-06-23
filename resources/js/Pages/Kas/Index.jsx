import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    IoAddOutline,
    IoPencil,
    IoTrash,
    IoSearch,
    IoCloseOutline,
} from "react-icons/io5";
import FormatDateRange from "@/Utils/FormatDateRange";
import RupiahFormat from "@/Utils/RupiahFormat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function Index({
    auth,
    kases,
    searchTerm: initialSearchTerm,
    startDate: initialStartDate,
    endDate: initialEndDate,
    totalBiayaMasuk,
    totalBiayaKeluar,
}) {
    console.log(totalBiayaKeluar);
    const totalLaba = totalBiayaMasuk - totalBiayaKeluar;
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
    const [state, setState] = useState([
        {
            startDate: initialStartDate ? new Date(initialStartDate) : null,
            endDate: initialEndDate ? new Date(initialEndDate) : null,
            key: "selection",
        },
    ]);
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            Inertia.delete(route("kas.destroy", id));
        }
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

    const handleResetDateRange = () => {
        setState([
            {
                startDate: null,
                endDate: null,
                key: "selection",
            },
        ]);

        setShowDateRangePicker(false);

        Inertia.get(
            route("kas.index"),
            {
                search: searchTerm,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const startDate = state[0].startDate
            ? format(state[0].startDate, "yyyy-MM-dd")
            : null;
        const endDate = state[0].endDate
            ? format(state[0].endDate, "yyyy-MM-dd")
            : null;

        const query = {
            search: searchTerm,
        };

        if (startDate && endDate) {
            query.startDate = startDate;
            query.endDate = endDate;
        }

        Inertia.get(route("kas.index"), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const startDate = state[0].startDate
        ? format(state[0].startDate, "yyyy-MM-dd")
        : "";
    const endDate = state[0].endDate
        ? format(state[0].endDate, "yyyy-MM-dd")
        : "";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-gray-800 leading-tight w-full">
                    Tabel Kas
                </h2>
            }
        >
            <Head title="Kas" />

            <div className="py-8">
                <div className="flex justify-between mb-4">
                    {/* <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            className="w-full border-gray-300 dark:bg-gray-800 dark:text-gray-100 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form> */}

                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col w-full space-y-2"
                    >
                        <div className="flex flex-row space-x-2 items-center">
                            <input
                                type="text"
                                className="sm:text-xs md:text-sm w-64 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-100 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex flex-row sm:text-xs md:text-sm text-gray-700">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDateRangePicker(
                                            !showDateRangePicker
                                        )
                                    }
                                    className="mb-2 px-2 py-1 flex items-center space-x-2"
                                >
                                    {startDate && endDate ? (
                                        <>
                                            <span className="mr-1">
                                                Laporan Priode
                                            </span>
                                            <div className="py-1 px-2 rounded-lg border border-green-400">
                                                <FormatDateRange
                                                    startDateString={startDate}
                                                    endDateString={endDate}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <span>Laporan Priode ... </span>
                                    )}
                                </button>
                                {startDate && endDate ? (
                                    <IoCloseOutline
                                        onClick={handleResetDateRange}
                                        className="text-red-600 text-xl mt-2 cursor-pointer"
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>

                            {showDateRangePicker && (
                                <div className="flex">
                                    <DateRange
                                        editableDateInputs={false}
                                        onChange={(item) =>
                                            setState([item.selection])
                                        }
                                        moveRangeOnFirstSelection={false}
                                        ranges={state}
                                        locale={id}
                                        startDatePlaceholder={"Tanggal Mulai"}
                                        endDatePlaceholder={"Tanggal Akhir"}
                                    />
                                    <div>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 mt-3 border rounded-md"
                                        >
                                            <IoSearch className="text-xl" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>

                    <a
                        href={route("kas.create")}
                        className="flex items-center text-xl px-2 py-1 text-slate-900 hover:text-blue-600"
                    >
                        <IoAddOutline />
                    </a>
                </div>
                <div>
                    {startDate && endDate ? (
                        <>
                            <div className="flex flex-row text-sm text-gray-700 m-1">
                                <span className="p-2 m-1 mb-4 bg-green-300 rounded-md">
                                    Total Pemasukan :{" "}
                                    <RupiahFormat value={totalBiayaMasuk} />
                                </span>
                                <span className="p-2 m-1 mb-4 bg-red-300 rounded-md">
                                    Total Pengeluaran :{" "}
                                    <RupiahFormat value={totalBiayaKeluar} />
                                </span>
                                <span className="p-2 m-1 mb-4 bg-gray-200 rounded-md">
                                    Total Laba :{" "}
                                    <RupiahFormat value={totalLaba} />
                                </span>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
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
                                        Jenis
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Tanggal
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Biaya
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Keterangan
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
                                {kases.data.map((kas, index) => (
                                    <tr
                                        key={kas.id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-4 py-4">
                                            {kases.from + index}
                                        </td>
                                        <td className="px-6 py-4">
                                            {kas.nama}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`${
                                                    kas.jenis === "Masuk"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {kas.jenis}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <FormatDateRange
                                                startDateString={kas.tanggal}
                                                endDateString={kas.tanggal}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <RupiahFormat value={kas.biaya} />{" "}
                                            <br /> ( {kas.pembayaran} )
                                        </td>
                                        <td className="px-6 py-4">
                                            {kas.keterangan}
                                        </td>
                                        <td className="px-1 py-4 flex justify-center space-x-2">
                                            <a
                                                href={route("kas.edit", kas.id)}
                                                className={`px-2 py-1 text-center hover:text-yellow-600 ${
                                                    kas.nama.includes(
                                                        "Sewa Kendaraan"
                                                    )
                                                        ? "pointer-events-none text-gray-400"
                                                        : ""
                                                }`}
                                                aria-disabled={kas.nama.includes(
                                                    "Sewa Kendaraan"
                                                )}
                                            >
                                                <IoPencil />
                                            </a>
                                            <button
                                                onClick={() =>
                                                    handleDelete(kas.id)
                                                }
                                                className={`px-2 py-1 text-center hover:text-red-600 ${
                                                    kas.nama.includes(
                                                        "Sewa Kendaraan"
                                                    )
                                                        ? "pointer-events-none text-gray-400"
                                                        : ""
                                                }`}
                                                disabled={kas.nama.includes(
                                                    "Sewa Kendaraan"
                                                )}
                                            >
                                                <IoTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Menampilkan {kases.from}-{kases.to} dari{" "}
                            {kases.total} total data
                        </p>
                    </div>
                    <div>
                        {kases.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`mx-1 px-3 py-1 border rounded ${
                                    link.active
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-blue-500"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
                <ToastContainer autoClose={7000} />
            </div>
        </AuthenticatedLayout>
    );
}
