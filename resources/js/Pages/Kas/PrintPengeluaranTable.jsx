import React from "react";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";

const PrintPengeluaranTable = React.forwardRef(
    ({ pengeluaran, formattedDateRange }, ref) => {
        let totalPengeluaran = 0;
        pengeluaran.forEach((item) => {
            totalPengeluaran += item.total;
        });

        return (
            <div ref={ref} className="print:m-16">
                <div className="text-center font-semibold m-6 text-xl">
                    <span className="block">Laporan Pengeluran Kas</span>

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
                                Jumlah
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pengeluaran && pengeluaran.length > 0 ? (
                            pengeluaran.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-8 py-2">
                                            {index + 1}
                                        </td>
                                        <td className="px-3 py-2">
                                            <FormatDateRange
                                                startDateString={item.tanggal}
                                                endDateString={item.tanggal}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="font-semibold">
                                                {item.kode}{" - "}{item.nama}
                                            </span>
                                            <br />{item.keterangan}
                                        </td>

                                        <td className="px-3 py-2">
                                            <RupiahFormat value={item.total} />{" "}
                                            <br /> ({item.metode} )
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-3 py-2 text-center"
                                >
                                    Tidak ada data pengeluaran untuk
                                    ditampilkan.
                                </td>
                            </tr>
                        )}
                        <tr className="text-md text-gray-700 bg-slate-200 h-14">
                            <td
                                colSpan="3"
                                className="px-3 py-2 font-semibold text-center uppercase"
                            >
                                Total Pengeluran
                            </td>
                            <td className="px-3 py-2 font-semibold">
                                <RupiahFormat value={totalPengeluaran} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
);

export default PrintPengeluaranTable;
