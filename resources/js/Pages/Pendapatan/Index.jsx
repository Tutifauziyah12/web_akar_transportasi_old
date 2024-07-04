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
import "react-date-range/dist/theme/default.css";

export default function Index({
    auth,
    sewa,
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
            Inertia.delete(route("sewa.destroy", id));
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

        Inertia.get(route("sewa.index"), query, {
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
                <h2 className="font-semibold text-2xl 2xl:text-4xl text-gray-800 leading-tight w-full">
                    Tabel Sewa Kendaraan
                </h2>
            }
        >
            <Head title="Sewa Kendaraan" />

            <div className="py-4 2xl:py-8 text-xs 2xl:text-base">
                <div className="flex justify-between mb-2 2xl:mb-4">
                    <div className="w-fit p-3 2xl:p-4 mb-4 bg-white rounded-md 2xl:rounded-xl shadow-md 2xl:shadow-lg">
                        <form onSubmit={handleSearch} className="">
                            <div className="flex items-end space-x-4">
                                <div className="w-fit">
                                    <label
                                        htmlFor="cari"
                                        className="block mb-2 font-semibold text-gray-700"
                                    >
                                        Filter
                                    </label>
                                    <input
                                        type="text"
                                        id="cari"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-base rounded-md 2xl:rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2"
                                        placeholder="Cari"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="w-fit">
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-base rounded-md 2xl:rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2"
                                            placeholder="Tanggal"
                                        />
                                    </div>
                                    {showDateRangePicker && (
                                        <div className="absolute z-10 mt-2 drop-shadow-lg shadow-slate-500 ">
                                            <div className="flex">
                                                <DateRange
                                                    showDateDisplay={false}
                                                    editableDateInputs={false}
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
                                                    value={formattedDateRange}
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
                                                        className="text-4xl mt-4 ml-3 text-red-500 bg-white rounded-full"
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
                                        className="bg-red-400 hover:bg-red-500 text-white font-medium py-2 px-2 2xl:px-4 rounded-md"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-400 hover:bg-green-500 text-white font-medium py-2 px-2 2xl:px-4 rounded-md"
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
                                href={route("sewa.create")}
                                className="flex items-center text-xl px-2 py-1 text-blue-500 hover:text-blue-700"
                            >
                                <IoAddOutline />
                            </a>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-left rtl:text-right text-gray-500">
                            <thead className="text-gray-700 uppercase bg-gray-200">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-8 py-3 w-[1%]"
                                    >
                                        No
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Kode
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Tanggal
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Nama Penyewa
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Nama Kendaraan
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Total
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 px-8 text-center w-[1%]"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sewa.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center bg-white border-b hover:bg-gray-50"
                                        >
                                            Sewa Kendaraan tidak ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    sewa.data.map((swa, index) => (
                                        <tr
                                            key={swa.id}
                                            className="bg-white border-b hover:bg-gray-50"
                                        >
                                            <td className="px-8 py-2">
                                                {sewa.from + index}
                                            </td>
                                            <td className="px-3 py-2">
                                                {swa.kode}
                                            </td>
                                            <td className="px-3 py-2">
                                                <FormatDateRange
                                                    startDateString={
                                                        swa.mulai_tanggal
                                                    }
                                                    endDateString={
                                                        swa.akhir_tanggal
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">{swa.nama}</td>
                                            <td className="px-3 py-2">
                                                <ul>
                                                    {swa.sewa_kendaraan.map(
                                                        (sk) => (
                                                            <li key={sk.id}>
                                                                {"- "}
                                                                {
                                                                    sk.kendaraan
                                                                        .nama
                                                                }{" "}
                                                                (
                                                                {
                                                                    sk.kendaraan
                                                                        .no_registrasi
                                                                }
                                                                )
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </td>
                                            <td className="px-3 py-2">
                                                <RupiahFormat
                                                    value={swa.total}
                                                />{" "}
                                                <br /> ({swa.metode} )
                                            </td>
                                            <td className="px-1 py-4 flex justify-center space-x-2">
                                                <a
                                                    href={route(
                                                        "sewa.edit",
                                                        swa.id
                                                    )}
                                                    className="px-2 py-1 text-center hover:text-yellow-600"
                                                >
                                                    <IoPencil />
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            swa.id
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
                <div className="mt-6 flex justify-between">
                    <div>
                        <p className="text-gray-700">
                            Menampilkan {sewa.from}-{sewa.to} dari {sewa.total}{" "}
                            total data sewa kendaraan
                        </p>
                    </div>
                    <div>
                        {sewa.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`mx-1 px-3 py-2 hover:bg-slate-200 border rounded ${
                                    link.active
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-blue-500"
                                }`}
                            >
                                {" "}
                                {link.label === "&laquo; Previous"
                                    ? "Sebelumnya"
                                    : link.label === "Next &raquo;"
                                    ? "Selanjutnya"
                                    : link.label}
                            </Link>
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
