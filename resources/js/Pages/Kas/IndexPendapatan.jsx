import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintPendapatanTable from "./PrintPendapatanTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import { id } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { IoPrintSharp, IoCloseCircleOutline } from "react-icons/io5";
import FormatDateRange from "@/Utils/FormatDateRange";

export default function IndexPendapatan({
    sewa,
    auth,
    searchTerm: initialSearchTerm,
    startDate: initialStartDate,
    endDate: initialEndDate,
    category: initialCategory,
}) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [formattedDateRange, setFormattedDateRange] = useState("");
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
    const [state, setState] = useState([
        {
            startDate: initialStartDate ? new Date(initialStartDate) : null,
            endDate: initialEndDate ? new Date(initialEndDate) : null,
            key: "selection",
        },
    ]);
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [categoryInput, setCategoryInput] = useState(
        initialCategory || "semua"
    );

    useEffect(() => {
        setSearchTerm(initialSearchTerm || "");
        setState([
            {
                startDate: initialStartDate ? new Date(initialStartDate) : null,
                endDate: initialEndDate ? new Date(initialEndDate) : null,
                key: "selection",
            },
        ]);
        setCategoryInput(initialCategory || "semua");
    }, [initialSearchTerm, initialStartDate, initialEndDate, initialCategory]);

    const handleXDateRange = () => {
        setShowDateRangePicker(false);
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const filterParams = {
            search: searchTerm,
            startDate,
            endDate,
            category: categoryInput, // Menggunakan categoryInput
        };

        Inertia.get(route("kasPendapatan.index"), filterParams);
    };

    const handleReset = () => {
        setSearchTerm("");
        setCategoryInput("semua"); // Mengembalikan categoryInput ke "semua"
        setState([
            {
                startDate: null,
                endDate: null,
                key: "selection",
            },
        ]);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-semibold text-4xl text-gray-800 leading-tight">
                        Pendapatan Kas
                    </h2>
                    <button
                        onClick={handlePrint}
                        className="flex bg-slate-500 hover:bg-slate-700 text-sm text-white font-bold py-2 px-4 rounded"
                    >
                        <IoPrintSharp className="text-xl mr-2" /> Cetak
                    </button>
                </div>
            }
        >
            <Head title="Pendapatan Kas" />

            <div className="w-fit my-10 p-4 text-sm bg-white rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="">
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
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                <div className="absolute z-10 mt-2 drop-shadow-lg shadow-slate-500">
                                    <div className="flex">
                                        <DateRange
                                            showDateDisplay={false}
                                            editableDateInputs={false}
                                            onChange={(item) =>
                                                setState([item.selection])
                                            }
                                            moveRangeOnFirstSelection={false}
                                            ranges={state}
                                            locale={id}
                                            value={formattedDateRange}
                                            startDatePlaceholder={
                                                "Tanggal Mulai"
                                            }
                                            endDatePlaceholder={"Tanggal Akhir"}
                                        />
                                        <div>
                                            <IoCloseCircleOutline
                                                onClick={handleXDateRange}
                                                className="text-4xl mt-4 ml-3 text-red-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-52">
                            <label
                                htmlFor="category"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Kategori
                            </label>
                            <select
                                id="category"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={categoryInput} // Menggunakan categoryInput
                                onChange={(e) =>
                                    setCategoryInput(e.target.value)
                                } // Mengupdate categoryInput
                            >
                                <option value="semua">Semua</option>
                                <option value="pendapatan_sewa">
                                    Pendapatan Sewa
                                </option>
                                <option value="pendapatan_lainnya">
                                    Pendapatan Lainnya
                                </option>
                            </select>
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

            <div className="mt-4">
                <PrintPendapatanTable
                    ref={componentRef}
                    sewa={sewa}
                    category={categoryInput}
                    formattedDateRange={formattedDateRange}
                />{" "}
                {/* Menggunakan categoryInput */}
            </div>
        </AuthenticatedLayout>
    );
}
