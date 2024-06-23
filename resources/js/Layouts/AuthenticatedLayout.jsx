import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import { Inertia } from "@inertiajs/inertia";

import {
    IoCubeOutline,
    IoCarSharp,
    IoAnalytics,
    IoLogoUsd,
    IoPersonOutline,
    IoExitOutline,
} from "react-icons/io5";

export default function Authenticated({ user, header, children }) {
    const [isMobileResolution, setIsMobileResolution] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileResolution(window.innerWidth <= 768); // Atur batas resolusi di sini (misalnya, 768 untuk ponsel)
        };

        handleResize(); // Panggil fungsi sekali saat komponen dimuat

        window.addEventListener("resize", handleResize); // Tambahkan event listener untuk mendengar perubahan ukuran layar

        return () => {
            window.removeEventListener("resize", handleResize); // Bersihkan event listener saat komponen dibongkar
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        Inertia.post(route("logout"));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex w-full bg-slate-100">
                {!isMobileResolution ? (
                    <>
                        <div className="fixed p-8 bg-slate-800 w-[290px] min-h-screen flex flex-col justify-between">
                            <div>
                                <Link href="/">
                                    <h2 className="text-3xl font-extrabold text-slate-100 leading-relaxed">
                                        AKAR <br /> TRANSPORTASI
                                    </h2>
                                </Link>
                                <div className="text-slate-100 my-10">
                                    <nav>
                                        <div className="text-slate-400 py-2 px-4">
                                            MENU
                                        </div>
                                        <NavLink
                                            href={route("dashboard")}
                                            active={route().current(
                                                "dashboard"
                                            )}
                                            icon={IoCubeOutline}
                                        >
                                            Dashboard
                                        </NavLink>
                                        <NavLink
                                            href={route("sewa_kendaraan.index")}
                                            active={
                                                (route()
                                                    .current()
                                                    .includes(
                                                        "sewa_kendaraan"
                                                    ) &&
                                                    !route()
                                                        .current()
                                                        .includes(
                                                            "kendaraan"
                                                        )) ||
                                                (route()
                                                    .current()
                                                    .indexOf(
                                                        "sewa_kendaraan.create"
                                                    ) !== -1 &&
                                                    !route()
                                                        .current()
                                                        .includes(
                                                            "kendaraan"
                                                        )) ||
                                                (route()
                                                    .current()
                                                    .includes(
                                                        "sewa_kendaraan"
                                                    ) &&
                                                    route()
                                                        .current()
                                                        .includes("edit") &&
                                                    !route()
                                                        .current()
                                                        .includes(
                                                            "kendaraan"
                                                        )) ||
                                                (route()
                                                    .current()
                                                    .includes(
                                                        "sewa_kendaraan"
                                                    ) &&
                                                    !route()
                                                        .current()
                                                        .includes("kas"))
                                            }
                                            icon={IoAnalytics}
                                        >
                                            Sewa Kendaraan
                                        </NavLink>
                                        <NavLink
                                            href={route("kas.index")}
                                            active={
                                                route()
                                                    .current()
                                                    .indexOf("kas.index") !==
                                                    -1 ||
                                                route()
                                                    .current()
                                                    .indexOf("kas.create") !==
                                                    -1 ||
                                                (route()
                                                    .current()
                                                    .includes("kas") &&
                                                    route()
                                                        .current()
                                                        .includes("edit"))
                                            }
                                            icon={IoLogoUsd}
                                        >
                                            Kas
                                        </NavLink>
                                        <NavLink
                                            href={route("kendaraan.index")}
                                            active={
                                                (route()
                                                    .current()
                                                    .includes("kendaraan") &&
                                                    !route()
                                                        .current()
                                                        .includes(
                                                            "sewa_kendaraan"
                                                        )) ||
                                                (route()
                                                    .current()
                                                    .indexOf(
                                                        "kendaraan.create"
                                                    ) !== -1 &&
                                                    !route()
                                                        .current()
                                                        .includes(
                                                            "sewa_kendaraan"
                                                        )) ||
                                                (route()
                                                    .current()
                                                    .includes("kendaraan") &&
                                                    route()
                                                        .current()
                                                        .includes("edit") &&
                                                    !route()
                                                        .current()
                                                        .includes(
                                                            "sewa_kendaraan"
                                                        ))
                                            }
                                            icon={IoCarSharp}
                                        >
                                            Kendaraan
                                        </NavLink>
                                    </nav>
                                </div>
                            </div>
                            <div className="text-slate-100 mt-10">
                                <NavLink
                                    href={route("profile.edit")}
                                    active={route().current("profile.edit")}
                                >
                                    <IoPersonOutline className="text-2xl mr-2" />
                                    <span className="text-slate-400">
                                        {user.name}
                                    </span>
                                </NavLink>

                                <div className="flex items-center py-2 px-4">
                                    <button
                                        onClick={handleLogout}
                                        className="flex text-gray-400 hover:text-gray-500"
                                    >
                                        <IoExitOutline className="text-2xl mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full m-8">
                            {header && (
                                <header className="ml-[290px]">{header}</header>
                            )}
                            <main className="ml-[290px]">{children}</main>
                        </div>
                    </>
                ) : (
                    <div className="w-full m-8">
                    {/* {header && <header className="">{header}</header>} */}
                    <main className="">{children}</main>
                </div>
                )}
            </div>
        </div>
    );
}
