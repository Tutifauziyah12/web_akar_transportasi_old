import { useState } from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import {
    IoCubeOutline,
    IoCarSharp,
    IoAnalytics,
    IoLogoUsd,
    IoPersonOutline,
} from "react-icons/io5";

export default function Authenticated({ user, header, children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex w-full bg-slate-100">
                <div className="fixed p-8 bg-slate-800 w-[290px] min-h-screen flex flex-col justify-between">
                    <div>
                        <Link href="/">
                            <h2 className="text-3xl font-extrabold text-slate-100 leading-relaxed">
                                AKAR <br /> TRANSPORTASI
                            </h2>
                        </Link>
                        <div className="text-slate-100 my-10">
                            <nav>
                                <div className="text-slate-400 py-2 px-4">MENU</div>
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                    icon={IoCubeOutline}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route("sewa_kendaraan.index")}
                                    active={
                                        (route().current().includes("sewa_kendaraan") &&
                                            !route().current().includes("kendaraan")) ||
                                        (route().current().indexOf("sewa_kendaraan.create") !== -1 &&
                                            !route().current().includes("kendaraan")) ||
                                        (route().current().includes("sewa_kendaraan") &&
                                            route().current().includes("edit") &&
                                            !route().current().includes("kendaraan")) ||
                                        (route().current().includes("sewa_kendaraan") &&
                                            !route().current().includes("kas"))
                                    }
                                    icon={IoAnalytics}
                                >
                                    Sewa Kendaraan
                                </NavLink>
                                <NavLink
                                    href={route("kas.index")}
                                    active={
                                        route().current().indexOf("kas.index") !== -1 ||
                                        route().current().indexOf("kas.create") !== -1 ||
                                        (route().current().includes("kas") &&
                                            route().current().includes("edit"))
                                    }
                                    icon={IoLogoUsd}
                                >
                                    Kas
                                </NavLink>
                                <NavLink
                                    href={route("kendaraan.index")}
                                    active={
                                        (route().current().includes("kendaraan") &&
                                            !route().current().includes("sewa_kendaraan")) ||
                                        (route().current().indexOf("kendaraan.create") !== -1 &&
                                            !route().current().includes("sewa_kendaraan")) ||
                                        (route().current().includes("kendaraan") &&
                                            route().current().includes("edit") &&
                                            !route().current().includes("sewa_kendaraan"))
                                    }
                                    icon={IoCarSharp}
                                >
                                    Kendaraan
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                    <div className="text-slate-100 mt-10">
                        <div className="flex items-center py-2 px-4">
                            <IoPersonOutline className="text-2xl mr-2" />
                            <span className="text-slate-400">{user.name}</span>
                        </div>
                    </div>
                </div>
                <div className="w-full m-8">
                    {header && <header className="ml-[290px]">{header}</header>}
                    <main className="ml-[290px]">{children}</main>
                </div>
            </div>
        </div>
    );
}
