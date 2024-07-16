import React, { useState, useEffect, forwardRef } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";


const MyModalDelete = ({ show, handleCloseDelete, handleDelete, id }) => {
    if (!show) return null;

    const { data, setData, put, processing, reset } = useForm({
        nama: "",
        no_registrasi: "",
        jenis: "",
        warna: "",
        tahun_pembuatan: "",
        status: "",
    });
    const [kendaraan, setKendaraan] = useState(null);

    useEffect(() => {
        if (id) {
            axios
                .get(`/kendaraan/${id}`)
                .then((response) => {
                    const kendaraanData = response.data;
                    setKendaraan(kendaraanData);

                    setData((prevData) => ({
                        ...prevData,
                        nama: kendaraanData.nama,
                        no_registrasi: kendaraanData.no_registrasi,
                        jenis: kendaraanData.jenis,
                        warna: kendaraanData.warna,
                        tahun_pembuatan: kendaraanData.tahun_pembuatan,
                        status: kendaraanData.status,
                    }));
                })
                .catch((error) => {
                    console.error("Error fetching kendaraan:", error);
                });
        }
    }, [id]);

    return (
        
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold">Konfirmasi Hapus</h2>
                </div>
                <div className="py-4">
                    <p>Apakah Anda yakin ingin menghapus <b>{data.nama} ({data.no_registrasi}) </b>?</p>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={handleCloseDelete}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => handleDelete(id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyModalDelete;
