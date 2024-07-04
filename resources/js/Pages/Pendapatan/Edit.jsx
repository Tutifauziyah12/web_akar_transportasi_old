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
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validationSchema } from "@/Utils/validationSchema";

export default function Edit({
    auth,
    kendaraans,
    sewa,
    startDate: initialStartDate,
    endDate: initialEndDate,
    kendaraan_ids,
    pendapatanLainnya,
}) {
    const { data, setData, put, processing, reset } = useForm({
        kode: sewa.kode,
        nama: sewa.nama,
        mulai_tanggal: sewa.mulai_tanggal,
        akhir_tanggal: sewa.akhir_tanggal,
        kendaraan_ids: kendaraan_ids,
        total: sewa.total,
        metode: sewa.metode,
        pendapatanLainnya: pendapatanLainnya || [],
    });

    const [validationErrors, setValidationErrors] = useState({});
    const { flash } = usePage().props;

    // DateRange
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [formattedDateRange, setFormattedDateRange] = useState("");

    const [state, setState] = useState([
        {
            startDate: data.mulai_tanggal ? new Date(data.mulai_tanggal) : null,
            endDate: data.akhir_tanggal ? new Date(data.akhir_tanggal) : null,
            key: "selection",
        },
    ]);

    const startDate = state[0].startDate
        ? format(state[0].startDate, "yyyy-MM-dd")
        : "";
    data.mulai_tanggal = startDate;
    const endDate = state[0].endDate
        ? format(state[0].endDate, "yyyy-MM-dd")
        : "";
    data.akhir_tanggal = endDate;

    const handleXDateRange = () => {
        setShowDateRangePicker(false);
    };

    useEffect(() => {
        if (data.mulai_tanggal && data.akhir_tanggal) {
            const formattedRange = FormatDateRange({
                startDateString: data.mulai_tanggal,
                endDateString: data.akhir_tanggal,
            });
            setFormattedDateRange(formattedRange);
        } else {
            setFormattedDateRange("");
        }
    }, [data.mulai_tanggal, data.akhir_tanggal]);

    const handlePendapatanLainnyaChange = (index, e) => {
        const { name, value } = e.target;

        if (name.startsWith("nama")) {
            const metodeIndex = name.split("-")[1];
            const updatedPendapatanLainnya = [...data.pendapatanLainnya];
            updatedPendapatanLainnya[index].nama = value;
            setData({ ...data, pendapatanLainnya: updatedPendapatanLainnya });
        } else if (name.startsWith("metode")) {
            const metodeIndex = name.split("-")[1];
            const updatedPendapatanLainnya = [...data.pendapatanLainnya];
            updatedPendapatanLainnya[index].metode = value;
            setData({ ...data, pendapatanLainnya: updatedPendapatanLainnya });
        } else {
            const updatedPendapatanLainnya = [...data.pendapatanLainnya];
            updatedPendapatanLainnya[index][name] = value;
            setData({ ...data, pendapatanLainnya: updatedPendapatanLainnya });
        }
    };

    const addPendapatanLainnya = () => {
        if (data.pendapatanLainnya.length === 0) {
            setData("pendapatanLainnya", [
                ...data.pendapatanLainnya,
                { nama: "", jumlah: 0, total: 0, metode: "" },
            ]);
        } else {
            const isAnyFieldEmpty = data.pendapatanLainnya.some(
                (pendapatan) => {
                    return (
                        !pendapatan.nama ||
                        pendapatan.jumlah <= 0 ||
                        pendapatan.total <= 0 ||
                        !pendapatan.metode
                    );
                }
            );

            if (isAnyFieldEmpty) {
                toast.error(
                    "Silakan lengkapi semua kolom sebelum menambahkan entri baru."
                );
                return;
            }

            setData("pendapatanLainnya", [
                ...data.pendapatanLainnya,
                { nama: "", jumlah: 0, total: 0, metode: "" },
            ]);
        }
    };

    const deletePendapatanLainnya = (index) => {
        setData(
            "pendapatanLainnya",
            data.pendapatanLainnya.filter((_, i) => i !== index)
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mulai_tanggal" || name === "akhir_tanggal") {
            value = value.value;
        }
        setData(name, value);
    };

    const handleCheckboxChange = (e) => {
        const id = parseInt(e.target.value, 10);
        const isChecked = e.target.checked;

        const newKendaraanIds = isChecked
            ? [...data.kendaraan_ids, id]
            : data.kendaraan_ids.filter((kendaraanId) => kendaraanId !== id);

        setData("kendaraan_ids", newKendaraanIds);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(data, { abortEarly: false });
            put(`/pendapatan/sewa_kendaraan/${sewa.id}`, {
                onSuccess: () => reset(),
            });
        } catch (err) {
            const newErrors = {};
            if (err.inner && Array.isArray(err.inner)) {
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
            } else {
                newErrors.general = "Terjadi kesalahan dalam validasi data.";
            }
            setValidationErrors(newErrors);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-2xl 2xl:text-4xl text-gray-800 leading-tight">
                    <a
                        href={route("sewa.index")}
                        className="flex items-center pr-4"
                    >
                        <IoArrowBack className="text-2xl 2xl:text-4xl mr-4" />
                        Edit Sewa Kendaraan
                    </a>
                </h2>
            }
        >
            <Head title="Edit Sewa Kendaraan" />
            <div className="py-4 2xl:py-6 my-8 2xl:my-10 px-6 2xl:px-10 bg-slate-200 bg-opacity-70 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-10 mb-6 md:grid-cols-3">
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
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.kode && "border-red-500"
                                }`}
                                placeholder="Kode"
                            />
                            {validationErrors.kode && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.kode}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="nama"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Nama Penyewa
                            </label>
                            <input
                                type="text"
                                name="nama"
                                value={data.nama}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.nama && "border-red-500"
                                }`}
                                placeholder="Nama"
                            />

                            {validationErrors.nama && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.nama}
                                </div>
                            )}
                        </div>
                        <div></div>

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
                                        setShowDateRangePicker(
                                            !showDateRangePicker
                                        )
                                    }
                                    value={formattedDateRange}
                                    readOnly
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5  ${
                                        (validationErrors.mulai_tanggal ||
                                            validationErrors.akhir_tanggal) &&
                                        "border-red-500"
                                    }`}
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
                                            minDate={new Date()}
                                            startDatePlaceholder={
                                                "Tanggal Mulai"
                                            }
                                            endDatePlaceholder={"Tanggal Akhir"}
                                        />
                                        <div>
                                            <IoCloseCircleOutline
                                                onClick={handleXDateRange}
                                                className="text-4xl mt-4 ml-3 text-red-500 bg-white rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(validationErrors.mulai_tanggal ||
                                validationErrors.akhir_tanggal) && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.mulai_tanggal ||
                                        validationErrors.akhir_tanggal}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="kendaraan_id"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Pilih Kendaraan
                            </label>
                            <div
                                className="border-2 border-gray-400 rounded-md p-2"
                                style={{
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                }}
                            >
                                 {kendaraans.map((kendaraan) => (
                                    <div key={kendaraan.id} className="p-1">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="kendaraan_ids"
                                                value={kendaraan.id}
                                                onChange={handleCheckboxChange}
                                                checked={data.kendaraan_ids.includes(
                                                    kendaraan.id
                                                )}
                                                className="mr-2"
                                            />
                                            <span>
                                                {kendaraan.nama} (
                                                {kendaraan.no_registrasi})
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {data.kendaraan_ids.length > 0 && (
                                <div className="mt-4">
                                    <label className="block mb-2 font-semibold text-gray-900">
                                        Kendaraan Dipilih
                                    </label>
                                    <ul className="list-disc list-inside">
                                        {data.kendaraan_ids.map((id) => {
                                            const kendaraan = kendaraans.find(
                                                (k) => k.id === id
                                            );
                                            return (
                                                <li key={id}>
                                                    {kendaraan &&
                                                        `${kendaraan.nama} (${kendaraan.no_registrasi})`}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                            {validationErrors.kendaraan_ids && (
                                <div className="text-red-700 text-xs mt-1 ml-1">
                                    {validationErrors.kendaraan_ids}
                                </div>
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
                                <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
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
                                    <span className="text-xs 2xl:text-sm">
                                        Cash
                                    </span>
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
                                    <span className="text-xs 2xl:text-sm">
                                        Debit
                                    </span>
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
                                    <span className="text-xs 2xl:text-sm">
                                        Credit
                                    </span>
                                </label>
                            </div>
                            {validationErrors.metode && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.metode}
                                </p>
                            )}
                        </div>
                    </div>

                    {data.pendapatanLainnya.map((pendapatan, index) => (
                        <div key={index}>
                            <IoCloseSharp
                                className="text-xl 2xl:text-2xl my-2 text-red-400 hover:text-red-600"
                                onClick={() => deletePendapatanLainnya(index)}
                            />
                            <div className="grid gap-6 p-2 md:grid-cols-2 border-2 border-dashed border-slate-300 relative">
                                <div className="flex">
                                    <div className="w-full mr-3">
                                        <label
                                            htmlFor={`nama-${index}`}
                                            className="block mb-2 text-gray-900"
                                        >
                                            Nama Pendapatan Lainnya
                                        </label>
                                        <input
                                            type="text"
                                            name="nama"
                                            placeholder="Pendapatan Lainnya"
                                            value={pendapatan.nama}
                                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                                validationErrors[
                                                    `pendapatanLainnya[${index}].nama`
                                                ] && "border-red-500"
                                            }`}
                                            onChange={(e) =>
                                                handlePendapatanLainnyaChange(
                                                    index,
                                                    e
                                                )
                                            }
                                        />
                                        {validationErrors[
                                            `pendapatanLainnya[${index}].nama`
                                        ] && (
                                            <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                                {
                                                    validationErrors[
                                                        `pendapatanLainnya[${index}].nama`
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex flex-col items-center max-w-[5rem]">
                                        <div className="w-full mr-3">
                                            <label
                                                htmlFor={`jumlah-${index}`}
                                                className="block mb-2 text-gray-900"
                                            >
                                                Jumlah
                                            </label>
                                            <input
                                                type="number"
                                                name="jumlah"
                                                value={pendapatan.jumlah}
                                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                                    validationErrors[
                                                        `pendapatanLainnya[${index}].jumlah`
                                                    ] && "border-red-500"
                                                }`}
                                                onChange={(e) =>
                                                    handlePendapatanLainnyaChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                            />
                                            {validationErrors[
                                                `pendapatanLainnya[${index}].jumlah`
                                            ] && (
                                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                                    {
                                                        validationErrors[
                                                            `pendapatanLainnya[${index}].jumlah`
                                                        ]
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mr-3">
                                    <label
                                        htmlFor={`total-${index}`}
                                        className="block mb-2 text-gray-700"
                                    >
                                        Total Pendapatan Lainnya
                                    </label>
                                    <RupiahInput
                                        value={pendapatan.total.toString()}
                                        onChange={(value) =>
                                            handlePendapatanLainnyaChange(
                                                index,
                                                {
                                                    target: {
                                                        name: "total",
                                                        value: value,
                                                    },
                                                }
                                            )
                                        }
                                        placeholder="Total Pendapatan Lainnya"
                                        error={
                                            validationErrors[
                                                `pendapatanLainnya.${index}.total`
                                            ]
                                        }
                                    />
                                    {validationErrors[
                                        `pendapatanLainnya[${index}].total`
                                    ] && (
                                        <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                            {
                                                validationErrors[
                                                    `pendapatanLainnya[${index}].total`
                                                ]
                                            }
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-4 pt-3">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={`metode-${index}`}
                                                value="Cash"
                                                checked={
                                                    pendapatan.metode === "Cash"
                                                }
                                                onChange={(e) =>
                                                    handlePendapatanLainnyaChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <span className="text-xs 2xl:text-sm">
                                                Cash
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={`metode-${index}`}
                                                value="Debit"
                                                checked={
                                                    pendapatan.metode ===
                                                    "Debit"
                                                }
                                                onChange={(e) =>
                                                    handlePendapatanLainnyaChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <span className="text-xs 2xl:text-sm">
                                                Debit
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={`metode-${index}`}
                                                value="Credit"
                                                checked={
                                                    pendapatan.metode ===
                                                    "Credit"
                                                }
                                                onChange={(e) =>
                                                    handlePendapatanLainnyaChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <span className="text-xs 2xl:text-sm">
                                                Credit
                                            </span>
                                        </label>
                                    </div>
                                    {validationErrors[
                                        `pendapatanLainnya[${index}].metode`
                                    ] && (
                                        <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                            {
                                                validationErrors[
                                                    `pendapatanLainnya[${index}].metode`
                                                ]
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="w-full flex justify-center items-center hover:font-semibold">
                        <button type="button" onClick={addPendapatanLainnya}>
                            - Tambah Pendapatan Lainnya -
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md 2xl:rounded-lg text-xs 2xl:text-sm w-full sm:w-auto px-2 py-2 2xl:px-2.5 2xl:py-2.5 text-center"
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
