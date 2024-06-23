import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    IoCloseCircleOutline,
    IoArrowBack,
} from "react-icons/io5";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import RupiahInput from "@/Utils/RupiahInput";
import FormatDateRange from "@/Utils/FormatDateRange";
import { id } from "date-fns/locale"; // import bahasa Indonesia
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

export default function Edit({ auth, kendaraans, sewaKendaraan, startDate: initialStartDate,
    endDate: initialEndDate }) {
    const { errors } = usePage().props;
    const { data, setData } = useForm({
        nama: sewaKendaraan.nama,
        mulai_tanggal: sewaKendaraan.mulai_tanggal,
        akhir_tanggal: sewaKendaraan.akhir_tanggal,
        kendaraan_id: sewaKendaraan.kendaraan_id,
        harga: sewaKendaraan.harga,
        metode: sewaKendaraan.metode,
        keterangan: sewaKendaraan.keterangan || "",
    });

    console.log(data)

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

    const handleChange = (field, value) => {
        if (field === "mulai_tanggal" || field === "akhir_tanggal") {
            value = value.value;
        }
        setData(field, value);
    };

    const storeKendaraan = (e) => {
        e.preventDefault();
        router.put(
            route("sewa_kendaraan.update", {
                sewa_kendaraan: sewaKendaraan.id,
            }),
            data
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-gray-800 leading-tight w-full">
                    <a
                        href={route("sewa_kendaraan.index")}
                        className="flex items-center pr-4"
                    >
                        <IoArrowBack className="text-2xl mr-4" />
                        Edit Sewa Kendaraan
                    </a>
                </h2>
            }
        >
            <Head title="Edit Kendaraan" />
            <div className="py-6 my-6 px-10 bg-slate-200 bg-opacity-70 rounded-lg">
                <form onSubmit={storeKendaraan}>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="nama"
                                className="block mb-2 font-semibold text-gray-900 dark:text-white"
                            >
                                Nama Penyewa
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
                                htmlFor="tanggal"
                                className="block mb-2 font-semibold text-gray-700 dark:text-white"
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
                            </div>
                            {showDateRangePicker && (
                                <div className="absolute z-10 mt-2 drop-shadow-lg shadow-slate-500">
                                    <div className="flex">
                                        <DateRange
                                            editableDateInputs={false}
                                            onChange={(item) =>
                                                setState([item.selection])
                                            }
                                            moveRangeOnFirstSelection={false}
                                            minDate={new Date()}
                                            ranges={state}
                                            locale={id}
                                            startDatePlaceholder={
                                                "Tanggal Mulai"
                                            }
                                            endDatePlaceholder={"Tanggal Akhir"}
                                        />
                                        <div>
                                            <IoCloseCircleOutline
                                                onClick={handleXDateRange}
                                                className="text-xl mt-3 ml-3 text-red-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="">
                            <label
                                htmlFor="kendaraan_id"
                                className="block mb-2 font-semibold text-gray-900 dark:text-white"
                            >
                                Pilih Kendaraan
                            </label>
                            <select
                                id="kendaraan_id"
                                onChange={(e) =>
                                    handleChange("kendaraan_id", e.target.value)
                                }
                                value={data.kendaraan_id}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    errors.kendaraan_id && "border-red-500"
                                }`}
                            >
                                <option value="">Pilih Kendaraan</option>
                                {kendaraans.map((kendaraan) => (
                                    <option
                                        key={kendaraan.id}
                                        value={kendaraan.id}
                                    >
                                        {kendaraan.nama} (
                                        {kendaraan.no_registrasi})
                                    </option>
                                ))}
                            </select>
                            {errors.kendaraan_id && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {errors.kendaraan_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="harga"
                                className="block mb-2 font-semibold text-gray-900 dark:text-white"
                            >
                                Harga
                            </label>
                            <RupiahInput
                                value={data.harga}
                                onChange={(value) => setData("harga", value)}
                                placeholder="Harga"
                                error={errors.harga}
                            />
                            <div className="flex items-center space-x-4 pt-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Cash"
                                        name="metode"
                                        value="Cash"
                                        checked={data.metode === "Cash"}
                                        onChange={(e) =>
                                            setData("metode", e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Cash</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Debit"
                                        name="metode"
                                        value="Debit"
                                        checked={data.metode === "Debit"}
                                        onChange={(e) =>
                                            setData("metode", e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Debit</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Credit"
                                        name="metode"
                                        value="Credit"
                                        checked={data.metode === "Credit"}
                                        onChange={(e) =>
                                            setData("metode", e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Credit</span>
                                    
                                </label>
                            </div>
                            {errors.metode && (
                                <p className="text-red-700 text-xs mt-1 ml-1">
                                    {errors.metode}
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
                                style={{ minHeight: "120px" }} // Atur ketinggian minimum (opsional)
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
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
