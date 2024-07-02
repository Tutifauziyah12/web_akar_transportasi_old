import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    IoCloseSharp,
    IoArrowBack,
    IoCloseCircleOutline,
} from "react-icons/io5";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import RupiahInput from "@/Utils/RupiahInput";
import FormatDateRange from "@/Utils/FormatDateRange";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "react-date-range";
import { id } from "date-fns/locale";
import { format } from "date-fns";

import { validationSchemaPengeluaran } from "@/Utils/validationSchema";

export default function Create({
    auth,
    lastKode,
}) {
    // Default Code
    const modifyString = (str) => {
        let lastThreeDigits = str.slice(-3);
        let incrementedDigits = (parseInt(lastThreeDigits) + 1)
            .toString()
            .padStart(3, "0");
        let newStr = str.slice(0, -3) + incrementedDigits;
        return newStr;
    };
    let originalString = lastKode;
    let modifiedString = modifyString(originalString);

    const { data, setData, post, processing, reset } = useForm({
        kode: modifiedString,
        nama: "",
        tanggal: "",
        total: 0,
        metode: "",
        keterangan: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const { flash } = usePage().props;

    // DateRange
    const [showCalendar, setShowCalendar] = useState(false);
    const [displayedDate, setDisplayedDate] = useState("");

    const handleChange = (field, value) => {
        if (field === "tanggal") {
            const date = new Date(value);
            value = format(date, 'yyyy/MM/dd');
        }
        setData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    useEffect(() => {
        if (flash.message) {
            if (flash.success) {
                toast.success(flash.message);
            } else if (flash.error) {
                toast.error(flash.message);
            }
        }
    }, [flash]);

    const handleSelect = (date) => {
        const formattedDate = format(date, "yyyy/MM/dd");
        const displayedDate = format(date, "d MMMM yyyy", { locale: id });
        handleChange("tanggal", formattedDate);
        setDisplayedDate(displayedDate);
        setShowCalendar(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchemaPengeluaran.validate(data, { abortEarly: false });
            post("/pengeluaran", {
                onSuccess: () => reset(),
            });
        } catch (err) {
            console.log(err)
            if (err.inner) {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setValidationErrors(newErrors);
            } else {
                toast.error("Terjadi kesalahan dalam validasi data.");
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-gray-800 leading-tight w-full">
                    <a
                        href={route("pengeluaran.index")}
                        className="flex items-center pr-4"
                    >
                        <IoArrowBack className="text-2xl mr-4" />
                        Tambah Pengeluaran
                    </a>
                </h2>
            }
        >
            <Head title="Tambah Pengeluaran" />
            <div className="py-6 my-6 px-10 bg-slate-200 bg-opacity-70 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 mb-14 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="kode"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Kode
                            </label>
                            <input
                                type="text"
                                name="kode"
                                value={data.kode}
                                onChange={handleChange}
                                readOnly
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                    validationErrors.kode && "border-red-500"
                                }`}
                                placeholder="Kode"
                            />
                            {validationErrors.kode && (
                                <div className="text-red-700 text-xs mt-1 ml-1">
                                    {validationErrors.kode}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="nama"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Nama
                            </label>
                            <input
                                type="text"
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                value={data.nama}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                    validationErrors.nama && "border-red-500"
                                }`}
                                placeholder={
                                    validationErrors.nama
                                        ? validationErrors.nama
                                        : data.nama
                                        ? ""
                                        : "Nama"
                                }
                            />
                            {validationErrors.nama && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {validationErrors.nama}
                                </p>
                            )}
                        </div>

                        <div>
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
                                        setShowCalendar(!showCalendar)
                                    }
                                    value={displayedDate}
                                    readOnly
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                        validationErrors.tanggal && "border-red-500"
                                    }`}
                                    placeholder={
                                        validationErrors.tanggal
                                            ? validationErrors.tanggal
                                            : data.tanggal
                                            ? ""
                                            : "Tanggal"
                                    }
                                />
                                {showCalendar && (
                                    <div className="absolute z-10 mt-2 drop-shadow-lg shadow-slate-500">
                                        <Calendar
                                            date={new Date()}
                                            onChange={handleSelect}
                                            locale={id}
                                            minDate={new Date()}
                                        />
                                    </div>
                                )}
                            </div>
                            {validationErrors.tanggal && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {validationErrors.tanggal}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="total"
                                className="block mb-2 font-semibold text-gray-900 "
                            >
                                Total
                            </label>
                            <RupiahInput
                                value={data.total.toString()}
                                onChange={(value) => setData("total", value)}
                                placeholder="Total"
                                error={validationErrors.total}
                            />
                            {validationErrors.total && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {validationErrors.total}
                                </p>
                            )}
                            <div className="flex items-center space-x-4 pt-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Cash"
                                        name="metodeSewa"
                                        value="Cash"
                                        onChange={(e) =>
                                            setData("metode", e.target.value)
                                        }
                                        checked={data.metode === "Cash"}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Cash</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Debit"
                                        name="metodeSewa"
                                        value="Debit"
                                        onChange={(e) =>
                                            setData("metode", e.target.value)
                                        }
                                        checked={data.metode === "Debit"}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Debit</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Credit"
                                        name="metodeSewa"
                                        value="Credit"
                                        onChange={(e) =>
                                            setData("metode", e.target.value)
                                        }
                                        checked={data.metode === "Credit"}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Credit</span>
                                </label>
                            </div>
                            {validationErrors.metode && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {validationErrors.metode}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="keterangan"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Keterangan
                            </label>
                            <textarea
                                id="keterangan"
                                onChange={(e) =>
                                    setData("keterangan", e.target.value)
                                }
                                value={data.keterangan}
                                style={{ minHeight: "120px" }}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                    validationErrors.keterangan && "border-red-500"
                                }`}
                                placeholder={
                                    validationErrors.keterangan
                                        ? validationErrors.keterangan
                                        : "Keterangan"
                                }
                            />
                            {validationErrors.keterangan && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {validationErrors   .keterangan}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </form>
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
