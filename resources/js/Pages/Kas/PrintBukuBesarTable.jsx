import React from "react";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";

const PrintBukuBesarTable = React.forwardRef(
    ({ kasList, formattedDateRange }, ref) => {
        let number = 1;

        let totalPendapatan = 0;

        return (
            <div ref={ref} className="print:m-16">
                <div className="text-center font-semibold m-6 text-xl">
                    <span className="block">Laporan Buku Besar Kas</span>

                    <span className="block">
                        Priode {formattedDateRange ? formattedDateRange : "..."}
                    </span>
                </div>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-md text-gray-700 uppercase bg-gray-200 h-14 rounded-lg">
                        <tr>
                            <th scope="col" className="px-8 py-2">
                                No
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Tanggal
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Keterangan
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Debit
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Kredit
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Saldo
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {kasList && kasList.length > 0 ? (
                            kasList.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    {item.kode.startsWith("PS") ? (
                                        <>
                                            <tr
                                                className="bg-white border-b hover:bg-gray-50"
                                                key={`row-ps-${item.id}`}
                                            >
                                                <td className="px-8 py-2 w-28">
                                                    {index + 1}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <FormatDateRange
                                                        startDateString={
                                                            item.sewa
                                                                .mulai_tanggal
                                                        }
                                                        endDateString={
                                                            item.sewa
                                                                .akhir_tanggal
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="font-semibold">
                                                        {item.kode} - Sewa
                                                        Kendaraan
                                                    </span>
                                                    <br />
                                                    {item.sewa.sewa_kendaraan
                                                        .length > 0 && (
                                                        <span>
                                                            {item.sewa.sewa_kendaraan
                                                                .map(
                                                                    (
                                                                        kendaraan
                                                                    ) =>
                                                                        `${kendaraan.kendaraan.nama} (${kendaraan.kendaraan.no_registrasi})`
                                                                )
                                                                .join(", ")}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-3 py-2">
                                                    <RupiahFormat
                                                        value={item.sewa.total}
                                                    />
                                                    <br /> ({item.sewa.metode})
                                                </td>
                                                <td className="px-3 py-2">-</td>
                                                <td className="px-3 py-2">
                                                    <RupiahFormat
                                                        value={
                                                            (totalPendapatan +=
                                                                item.sewa.total)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            {item.sewa.pendapatan_lainnya &&
                                            item.sewa.pendapatan_lainnya
                                                .length > 0 ? (
                                                item.sewa.pendapatan_lainnya.map(
                                                    (pendapatan, idx) => (
                                                        <tr
                                                            className="bg-white border-b hover:bg-gray-50"
                                                            key={`row-ps-pendapatan-${item.id}-${idx}`}
                                                        >
                                                            <td className="px-3 py-2"></td>
                                                            <td className="px-3 py-2"></td>
                                                            <td className="px-3 py-2">
                                                                <span className="font-semibold">
                                                                    {
                                                                        pendapatan.kode_sewa
                                                                    }{" "}
                                                                    - Pendapatan
                                                                    Lainnya
                                                                </span>
                                                                <br />
                                                                {
                                                                    pendapatan.nama
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <RupiahFormat
                                                                    value={
                                                                        pendapatan.total
                                                                    }
                                                                />{" "}
                                                                <br /> ({" "}
                                                                {
                                                                    item.sewa
                                                                        .metode
                                                                }{" "}
                                                                )
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                -
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <RupiahFormat
                                                                    value={
                                                                        (totalPendapatan +=
                                                                            pendapatan.total)
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <></>
                                            )}
                                        </>
                                    ) : (
                                        <tr
                                            className="bg-white border-b hover:bg-gray-50"
                                            key={`row-p-${item.id}`}
                                        >
                                            {/* <td
                                                colSpan="6"
                                                className="px-8 py-2 font-bold"
                                            >
                                                {item.kode}
                                            </td> */}
                                            <td className="px-8 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-2">
                                                <FormatDateRange
                                                    startDateString={
                                                        item.pengeluaran.tanggal
                                                    }
                                                    endDateString={
                                                        item.pengeluaran.tanggal
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <span className="font-semibold">
                                                    {item.pengeluaran.kode} -
                                                    Pengeluaran
                                                </span>
                                                <br />
                                                {item.pengeluaran.nama}
                                            </td>
                                            <td className="px-3 py-2"> - </td>
                                            <td className="px-3 py-2">
                                                <RupiahFormat
                                                    value={
                                                        item.pengeluaran.total
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <RupiahFormat
                                                    value={
                                                        (totalPendapatan -=
                                                            item.pengeluaran
                                                                .total)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-3 py-2 text-center"
                                >
                                    Tidak ada data pendapatan untuk ditampilkan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
);

export default PrintBukuBesarTable;
