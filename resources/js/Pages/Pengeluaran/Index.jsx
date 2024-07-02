import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    IoAddOutline,
    IoPencil,
    IoTrash,
    IoCloseCircleOutline,
} from "react-icons/io5";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css"; // theme css file

export default function Index({
    auth,
    pengeluaran,
    searchTerm: initialSearchTerm,
    startDate: initialStartDate,
    endDate: initialEndDate,
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
    const [formattedDateRange, setFormattedDateRange] = useState("");
    const [state, setState] = useState([
        {
            startDate: initialStartDate ? new Date(initialStartDate) : null,
            endDate: initialEndDate ? new Date(initialEndDate) : null,
            key: "selection",
        },
    ]);
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);

    const handleDelete = (id) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus data sewa kendaraan ini?"
            )
        ) {
            Inertia.delete(route("pengeluaran.destroy", id));
        }
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

        Inertia.get(route("pengeluaran.index"), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchTerm("");
        setState([
            {
                startDate: null,
                endDate: null,
                key: "selection",
            },
        ]);
    };

    const handleXDateRange = () => {
        setShowDateRangePicker(false);
    };

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash && flash.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    //   toast.success('Pesan sukses!');
    const startDate = state[0].startDate
        ? format(state[0].startDate, "yyyy-MM-dd")
        : "";
    const endDate = state[0].endDate
        ? format(state[0].endDate, "yyyy-MM-dd")
        : "";

    useEffect(() => {
        if (startDate && endDate) {
            const formattedRange = FormatDateRange({
                startDateString: startDate,
                endDateString: endDate,
            });
            setFormattedDateRange(formattedRange);
        } else {
            setFormattedDateRange("");
        }
    }, [startDate, endDate]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-gray-800 leading-tight w-full">
                    Tabel Pengeluaran
                </h2>
            }
        >
            <Head title="Pengeluaran" />

            <div className="py-8 w-full">
                <div className="flex mb-2 w-full justify-between items-center">
                    <div className="flex mb-2 w-full justify-between">
                        <div className="w-fit p-4 mb-4 text-sm bg-white rounded-xl shadow-md">
                            <form onSubmit={handleSearch} className="">
                                <div className="flex items-end space-x-4">
                                    <div className="w-52">
                                        <label
                                            htmlFor="cari"
                                            className="block mb-2 font-semibold text-gray-700"
                                        >
                                            Cari
                                        </label>
                                        <input
                                            type="text"
                                            id="cari"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            placeholder="Cari"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="w-52">
                                        <label
                                            htmlFor="tanggal"
                                            className="block mb-2 font-semibold text-gray-700"
                                        >
                                            Tanggal
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                onClick={() =>
                                                    setShowDateRangePicker(
                                                        !showDateRangePicker
                                                    )
                                                }
                                                value={formattedDateRange}
                                                readOnly
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder="Tanggal"
                                            />
                                        </div>
                                        {showDateRangePicker && (
                                            <div className="absolute z-10 mt-2 drop-shadow-lg shadow-slate-500 ">
                                                <div className="flex">
                                                    <DateRange
                                                        showDateDisplay={false}
                                                        editableDateInputs={
                                                            false
                                                        }
                                                        onChange={(item) =>
                                                            setState([
                                                                item.selection,
                                                            ])
                                                        }
                                                        moveRangeOnFirstSelection={
                                                            false
                                                        }
                                                        ranges={state}
                                                        locale={id}
                                                        value={
                                                            formattedDateRange
                                                        }
                                                        startDatePlaceholder={
                                                            "Tanggal Mulai"
                                                        }
                                                        endDatePlaceholder={
                                                            "Tanggal Akhir"
                                                        }
                                                    />
                                                    <div>
                                                        <IoCloseCircleOutline
                                                            onClick={
                                                                handleXDateRange
                                                            }
                                                            className="text-4xl mt-4 ml-3 text-red-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md border"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md border"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {!showDateRangePicker && (
                            <div className="flex items-end">
                                <a
                                    href={route("pengeluaran.create")}
                                    className=" text-xl px-2 py-1 text-slate-900 hover:text-blue-600"
                                >
                                    <IoAddOutline />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="sm:text-xs md:text-sm text-gray-700 uppercase bg-gray-200">
                                <tr>
                                    <th scope="col" className="px-8 py-2">
                                        No
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Kode
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Tanggal
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Nama
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Total
                                    </th>
                                    <th scope="col" className="px-3 py-2">
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
                                {pengeluaran.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center bg-white border-b hover:bg-gray-50"
                                        >
                                            Sewa Kendaraan tidak ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    pengeluaran.data.map((kendaraan, index) => (
                                        <tr
                                            key={kendaraan.id}
                                            className="bg-white border-b hover:bg-gray-50"
                                        >
                                            <td className="px-8 py-2">
                                                {pengeluaran.from + index}
                                            </td>
                                            <td className="px-3 py-2">
                                                {kendaraan.kode}
                                            </td>
                                            <td className="px-3 py-2">
                                                <FormatDateRange
                                                    startDateString={
                                                        kendaraan.tanggal
                                                    }
                                                    endDateString={
                                                        kendaraan.tanggal
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                {kendaraan.nama}
                                            </td>
                                            <td className="px-3 py-2">
                                                <RupiahFormat
                                                    value={kendaraan.total}
                                                />{" "}
                                                <br /> ({kendaraan.metode} )
                                            </td>
                                            <td className="px-3 py-2">
                                                {kendaraan.keterangan}
                                            </td>
                                            <td className="px-1 py-4 flex justify-center space-x-2">
                                                <a
                                                    href={route(
                                                        "pengeluaran.edit",
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
                        <p className="text-sm text-gray-700">
                            Menampilkan {pengeluaran.from}-{pengeluaran.to} dari{" "}
                            {pengeluaran.total} total data
                        </p>
                    </div>
                    <div>
                        {pengeluaran.links.map((link, index) => (
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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </AuthenticatedLayout>
    );
}
