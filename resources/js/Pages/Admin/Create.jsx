import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, useForm } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    IoCloseSharp,
    IoArrowBack,
    IoCloseCircleOutline,
    IoEyeOff,
    IoEye,
} from "react-icons/io5";
import { validationSchemaUserCreation } from "@/Utils/validationSchema";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        level: "",
        password: "",
        password_confirmation: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchemaUserCreation.validate(data, {
                abortEarly: false,
            });
            post("/admin", {
                onSuccess: () => reset(),
            });
        } catch (err) {
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
                <h2 className="font-semibold text-2xl 2xl:text-4xl text-gray-800 leading-tight">
                    <a
                        href={route("admin.index")}
                        className="flex items-center pr-4"
                    >
                        <IoArrowBack className="text-2xl 2xl:text-4xl mr-4" />
                        Tambah Akun
                    </a>
                </h2>
            }
        >
            <Head title="Tambah Akun" />

            <div className="py-4 2xl:py-6 my-8 2xl:my-10 px-6 2xl:px-10 bg-slate-200 bg-opacity-70 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-10 mb-6 md:grid-cols-3">
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Nama
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.name && "border-red-500"
                                }`}
                                placeholder="Nama"
                            />

                            {validationErrors.name && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.name}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.email && "border-red-500"
                                }`}
                                placeholder="Email"
                            />

                            {validationErrors.email && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.email}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="level"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Level
                            </label>
                            <select
                                name="level"
                                value={data.level}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.level && "border-red-500"
                                }`}
                            >
                                <option value="">Pilih Level</option>
                                <option value="Pegawai">Pegawai</option>
                                <option value="Admin">Admin</option>
                            </select>

                            {validationErrors.level && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.level}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                        validationErrors.password &&
                                        "border-red-500"
                                    }`}
                                    placeholder="Password"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <IoEyeOff className="text-2xl    text-slate-300" />
                                    ) : (
                                        <IoEye className="text-2xl   text-slate-300" />
                                    )}
                                </div>
                            </div>

                            {validationErrors.password && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.password}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="password_confirmation"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        showPasswordConfirmation
                                            ? "text"
                                            : "password"
                                    }
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                        validationErrors.password_confirmation &&
                                        "border-red-500"
                                    }`}
                                    placeholder="Konfirmasi Password"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() =>
                                        setShowPasswordConfirmation(
                                            !showPasswordConfirmation
                                        )
                                    }
                                >
                                    {showPasswordConfirmation ? (
                                        <IoEyeOff className="text-2xl text-slate-300" />
                                    ) : (
                                        <IoEye className="text-2xl text-slate-300" />
                                    )}
                                </div>
                            </div>

                            {validationErrors.password_confirmation && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.password_confirmation}
                                </div>
                            )}
                        </div>
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
