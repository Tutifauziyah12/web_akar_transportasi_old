import React from "react";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";

const PrintPendapatanTable = React.forwardRef(
    ({ sewa, category, formattedDateRange }, ref) => {
        let number = 1;

        let totalPendapatan = 0;
        sewa.forEach((item) => {
            if (category === "semua") {
                totalPendapatan += item.total;
                item.pendapatan_lainnya.forEach((pendapatan) => {
                    totalPendapatan += pendapatan.total;
                });
            } else if (category === "pendapatan_sewa") {
                totalPendapatan += item.total;
            } else if (category === "pendapatan_lainnya") {
                item.pendapatan_lainnya.forEach((pendapatan) => {
                    totalPendapatan += pendapatan.total;
                });
            } else {
                totalPendapatan = 0;
            }
        });

        return (
            <div ref={ref} className="print:m-1">
                <div className="text-center font-semibold mb-6 text-xl 2xl:text-2xl">
                    <span className="block">
                        Laporan Pendapatan{" "}
                        {category === "semua"
                            ? ""
                            : category === "pendapatan_lainnya"
                            ? "Lainnya"
                            : "Sewa"}{" "}
                        Kas
                    </span>

                    <span className="block">
                        Priode {formattedDateRange ? formattedDateRange : "..."}
                    </span>
                </div>

                <table className="w-full text-left rtl:text-right text-gray-500">
                    <thead className="text-md text-gray-700 uppercase bg-gray-200 h-14 rounded-lg">
                        <tr>
                            <th scope="col" className="px-8 py-2 w-[1%]">
                                No
                            </th>
                            <th scope="col" className="px-3 py-2 w-[15%]">
                                Tanggal
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Keterangan
                            </th>
                            <th scope="col" className="px-3 py-2  w-[20%]">
                                Jumlah
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sewa && sewa.length > 0 ? (
                            sewa.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    {category === "semua" ||
                                    category === "pendapatan_sewa" ? (
                                        <tr className="bg-white border-b hover:bg-gray-50 align-top">
                                            <td className="px-8 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-2">
                                                <FormatDateRange
                                                    startDateString={
                                                        item.mulai_tanggal
                                                    }
                                                    endDateString={
                                                        item.akhir_tanggal
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <span className="font-medium">
                                                    {item.kode} - Sewa
                                                </span>{" "}
                                                <br />
                                                {item.sewa_kendaraan.length >
                                                    0 && (
                                                    <span>
                                                        {item.sewa_kendaraan
                                                            .map(
                                                                (kendaraan) =>
                                                                    `${kendaraan.kendaraan.nama} (${kendaraan.kendaraan.no_registrasi})`
                                                            )
                                                            .join(", ")}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-3 py-2">
                                                <RupiahFormat
                                                    value={item.total}
                                                />{" "}
                                                <br /> ({item.metode} )
                                            </td>
                                        </tr>
                                    ) : (
                                        <></>
                                    )}
                                    {category === "semua" ||
                                    (category === "pendapatan_lainnya" &&
                                        item.pendapatan_lainnya &&
                                        item.pendapatan_lainnya.length > 0) ? (
                                        item.pendapatan_lainnya.map(
                                            (pendapatan, idx) => (
                                                <tr
                                                    key={`${item.id}-${idx}`}
                                                    className="bg-white border-b hover:bg-gray-50 align-top"
                                                >
                                                    <td className="px-3 py-2">
                                                        {category ===
                                                        "pendapatan_lainnya" ? (
                                                            <span className="px-5 py-2">
                                                                {number++}
                                                            </span>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                    <td className="">
                                                        {category ===
                                                        "pendapatan_lainnya" ? (
                                                            <span className="px-3 py-2">
                                                                <FormatDateRange
                                                                    startDateString={
                                                                        item.mulai_tanggal
                                                                    }
                                                                    endDateString={
                                                                        item.akhir_tanggal
                                                                    }
                                                                />
                                                            </span>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <span className="font-semibold">
                                                            {item.kode} -
                                                            Lainnya
                                                        </span>{" "}
                                                        <br />
                                                        {pendapatan.nama} total {pendapatan.jumlah}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <RupiahFormat
                                                            value={
                                                                pendapatan.total
                                                            }
                                                        />{" "}
                                                        <br /> (
                                                        {pendapatan.metode} )
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <></>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-3 py-2 text-center"
                                >
                                    Tidak ada data pendapatan untuk ditampilkan.
                                </td>
                            </tr>
                        )}
                        <tr className="text-md text-gray-700 bg-slate-200 h-14">
                            <td
                                colSpan="3"
                                className="px-3 py-2 font-semibold text-center uppercase"
                            >
                                Total Pendapatan
                            </td>
                            <td className="px-3 py-2 font-semibold">
                                <RupiahFormat value={totalPendapatan} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
);

export default PrintPendapatanTable;
