import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { IoArrowBack } from "react-icons/io5";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import RupiahInput from "@/Utils/RupiahInput";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar } from "react-date-range";
import { id } from "date-fns/locale";
import { format } from "date-fns";

export default function Create({ auth }) {
    const { errors } = usePage().props;
    const { data, setData } = useForm({
        nama: "",
        jenis: "",
        tanggal: "",
        biaya: "",
        pembayaran: "",
        keterangan: "",
    });

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

    const storeKas = (e) => {
        e.preventDefault();
        router.post("/kas", data);
    };

    const handleSelect = (date) => {
        const formattedDate = format(date, "yyyy/MM/dd");
        const displayedDate = format(date, "d MMMM yyyy", { locale: id });
        handleChange("tanggal", formattedDate);
        setDisplayedDate(displayedDate);
        setShowCalendar(false);
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-gray-800 leading-tight w-full">
                    <a
                        href={route("kas.index")}
                        className="flex items-center pr-4"
                    >
                        <IoArrowBack className="text-2xl mr-4" />
                        Tambah Kas
                    </a>
                </h2>
            }
        >
            <Head title="Tambah Kas" />

            <div className="py-6 my-6 px-10 bg-slate-200 bg-opacity-70 rounded-lg">
                <form onSubmit={storeKas} className="space-y-6">
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="nama"
                                className="block mb-2 font-semibold text-gray-900 dark:text-white"
                            >
                                Nama
                            </label>
                            <input
                                type="text"
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                value={data.nama}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    errors.nama && "border-red-500"
                                }`}
                                placeholder={
                                    errors.nama
                                        ? errors.nama
                                        : data.nama
                                        ? ""
                                        : "Nama"
                                }
                            />
                            {errors.nama && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="jenis"
                                className="block text-gray-700 font-semibold"
                            >
                                Jenis
                            </label>
                            <div className="mt-1">
                                <div className="flex items-center space-x-4 pt-3">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            id="Masuk"
                                            name="jenis"
                                            value="Masuk"
                                            checked={data.jenis === "Masuk"}
                                            onChange={(e) =>
                                                setData("jenis", e.target.value)
                                            }
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Masuk</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            id="Keluar"
                                            name="jenis"
                                            value="Keluar"
                                            checked={data.jenis === "Keluar"}
                                            onChange={(e) =>
                                                setData("jenis", e.target.value)
                                            }
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Keluar</span>
                                    </label>
                                </div>
                                {errors.jenis && (
                                    <p className="text-red-700 text-xs mt-1 ml-1">
                                        {errors.jenis}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="tanggal"
                                className="block mb-2 font-semibold text-gray-700 dark:text-white"
                            >
                                Tanggal
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    value={displayedDate}
                                    readOnly
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                        errors.tanggal && "border-red-500"
                                    }`}
                                    placeholder={
                                        errors.tanggal
                                            ? errors.tanggal
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
                            {errors.tanggal && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {errors.tanggal}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="biaya"
                                className="block mb-2 font-semibold text-gray-900 dark:text-white"
                            >
                                Biaya
                            </label>
                            <RupiahInput
                                value={data.biaya}
                                onChange={(value) => setData("biaya", value)}
                                placeholder="Biaya"
                                error={errors.biaya}
                            />
                            <div className="flex items-center space-x-4 pt-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Cash"
                                        name="pembayaran"
                                        value="Cash"
                                        checked={data.pembayaran === "Cash"}
                                        onChange={(e) =>
                                            setData(
                                                "pembayaran",
                                                e.target.value
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Cash</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Debit"
                                        name="pembayaran"
                                        value="Debit"
                                        checked={data.pembayaran === "Debit"}
                                        onChange={(e) =>
                                            setData(
                                                "pembayaran",
                                                e.target.value
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Debit</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Credit"
                                        name="pembayaran"
                                        value="Credit"
                                        checked={data.pembayaran === "Credit"}
                                        onChange={(e) =>
                                            setData(
                                                "pembayaran",
                                                e.target.value
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Credit</span>
                                </label>
                            </div>
                            {errors.pembayaran && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {errors.pembayaran}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="keterangan"
                                className="block mb-2 font-semibold text-gray-900 dark:text-white"
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
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    errors.keterangan && "border-red-500"
                                }`}
                                placeholder={
                                    errors.keterangan
                                        ? errors.keterangan
                                        : "Keterangan"
                                }
                            />
                            {errors.keterangan && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {errors.keterangan}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <button
                            type="submit"
                            className="inline-flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
