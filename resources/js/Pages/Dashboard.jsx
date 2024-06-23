import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { IoCubeOutline, IoCar, IoAnalytics, IoLogoUsd } from "react-icons/io5";
import RupiahFormat from "@/Utils/RupiahFormat";

export default function Dashboard({
    auth,
    aktifCount,
    perbaikanCount,
    nonAktifCount,
    totalSewaHariIni,
    sewaAktifSampaiAkhirBulan,
    totalSewaBulanIni,
    totalUangMasukHariIni,
    totalUangKeluarHariIni,
    totalUangMasukBulanIni,
    totalUangKeluarBulanIni,
}) {
    const totalUangHariIni = totalUangMasukHariIni - totalUangKeluarHariIni;
    const totalUangBulanIni = totalUangMasukBulanIni - totalUangKeluarBulanIni;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="pb-4 font-semibold text-md text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="w-full">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:gap-7.5">
                    {/* Sewa Kendaraan */}
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default md:p-6 xl:p-7.5">
                        <div className="flex flex-row items-center border-gray-300 pb-2">
                            <IoAnalytics className="mr-4 text-xl" />
                            <span className="text-xl font-semibold text-center flex items-center justify-center">
                                Sewa Kendaraan Bulan ini
                            </span>
                        </div>
                        <div className="flex w-full gap-4">
                            <StatCard
                                title={totalSewaHariIni}
                                description="hari ini"
                            />
                            <StatCard
                                title={sewaAktifSampaiAkhirBulan}
                                description="Booking"
                            />
                            <StatCard
                                title={totalSewaBulanIni}
                                description="Total"
                            />
                        </div>
                    </div>

                    {/* Kendaraan */}
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
                        <div className="flex flex-row items-center border-gray-300 pb-2">
                            <IoCar className="mr-4 text-xl" />
                            <span className="text-xl font-semibold text-center flex items-center justify-center">
                                Kendaraan
                            </span>
                        </div>
                        <div className="flex w-full gap-4">
                            <StatCard
                                title={aktifCount}
                                description="Aktif"
                            />
                            <StatCard
                                title={perbaikanCount}
                                description="Perbaikan"
                            />
                            <StatCard
                                title={nonAktifCount}
                                description="Tidak Aktif"
                            />
                        </div>
                    </div>
                </div>

                {/* Uang */}
                <div className="mt-10 w-full rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
                    <div className="flex flex-row items-center border-gray-300 pb-2">
                        <IoLogoUsd className="mr-4 text-xl" />
                        <span className="text-xl font-semibold text-center flex items-center justify-center">
                            Kas
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <StatCard
                            title={
                                <RupiahFormat value={totalUangMasukHariIni} />
                            }
                            description="Masuk hari ini"
                        />
                        <StatCard
                            title={
                                <RupiahFormat value={totalUangKeluarHariIni} />
                            }
                            description="Keluar hari ini"
                        />
                        <StatCard
                            title={<RupiahFormat value={totalUangHariIni} />}
                            description="Total hari ini"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
                        <StatCard
                            title={
                                <RupiahFormat value={totalUangMasukBulanIni} />
                            }
                            description="Masuk bulan ini"
                        />
                        <StatCard
                            title={
                                <RupiahFormat value={totalUangKeluarBulanIni} />
                            }
                            description="Keluar bulan ini"
                        />
                        <StatCard
                            title={<RupiahFormat value={totalUangBulanIni} />}
                            description="Total bulan ini"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, description }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4 border rounded-md shadow-sm">
            <dt className="mb-2 text-3xl font-extrabold">{title}</dt>
            <dd className="text-gray-500 dark:text-gray-400">{description}</dd>
        </div>
    );
}
