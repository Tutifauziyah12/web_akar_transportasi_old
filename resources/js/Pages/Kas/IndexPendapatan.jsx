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
            category: categoryInput,
        };

        Inertia.get(route("kasPendapatan.index"), filterParams);
    };

    const handleReset = () => {
        setSearchTerm("");
        setCategoryInput("semua");
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
                    <h2 className="font-semibold text-2xl 2xl:text-4xl text-gray-800 leading-tight w-full">
                        Pendapatan Kas
                    </h2>
                    <button
                        onClick={handlePrint}
                        className="flex bg-slate-500 hover:bg-slate-700 text-sm 2xl:md text-white font-medium py-1.5 px-2 2xl:py-2 2xl:px-4 rounded"
                    >
                        <IoPrintSharp className="text-lg 2xl:text-lg mr-2" />Cetak
                    </button>
                </div>
            }
        >
            <Head title="Pendapatan Kas" />

            <div className="pt-4 2xl:pt-8 text-xs 2xl:text-base">
                <div className="flex justify-between">
                    <div className="w-fit p-3 2xl:p-4 mb-4 bg-white rounded-md 2xl:rounded-xl shadow-md 2xl:shadow-lg">
                        <form onSubmit={handleSubmit} className="">
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
                                        <div className="absolute z-10 mt-2 drop-shadow-lg shadow-slate-500">
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

                                <div className="w-36 2xl:w-48">
                                    <select
                                        id="category"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-base rounded-md 2xl:rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2"
                                        value={categoryInput}
                                        onChange={(e) =>
                                            setCategoryInput(e.target.value)
                                        }
                                    >
                                        <option value="semua">
                                            Semua Kategori
                                        </option>
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
                </div>
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
