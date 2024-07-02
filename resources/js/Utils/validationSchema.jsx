import * as yup from "yup";

export const validationSchema = yup.object().shape({
    kode: yup.string().required("Kode harus diisi"),
    mulai_tanggal: yup
        .date()
        .required("Mulai tanggal harus diisi")
        .typeError("Mulai tanggal harus berupa tanggal yang valid"),
    akhir_tanggal: yup
        .date()
        .required("Akhir tanggal harus diisi")
        .typeError("Akhir tanggal harus berupa tanggal yang valid"),
    kendaraan_ids: yup
        .array()
        .of(
            yup
                .number()
                .required("ID Kendaraan harus diisi")
                .positive("ID Kendaraan harus berupa angka positif")
                .integer("ID Kendaraan harus berupa angka bulat")
        )
        .min(1, "Minimal satu kendaraan harus dipilih"),
    total: yup.number().required("Total harus diisi"),
    metode: yup.string().required("Metode harus diisi"),
    pendapatanLainnya: yup.array().of(
        yup.object().shape({
            nama: yup.string().required("Nama harus diisi"),
            jumlah: yup
                .number()
                .required("Jumlah harus diisi")
                .positive("Jumlah harus berupa angka positif")
                .integer("Jumlah harus berupa angka bulat"),
            total: yup.number().required("Total harus diisi"),
            metode: yup.string().required("Metode harus diisi"),
        })
    )
});

export const validationSchemaPengeluaran = yup.object().shape({
    kode: yup.string().required("Kode harus diisi"),
    total: yup.number().required("Total harus diisi"),
    metode: yup.string().required("Metode harus diisi"),
    nama: yup.string().required("Nama harus diisi"),
    tanggal: yup
        .date()
        .required("Tanggal harus diisi")
        .typeError("Tanggal harus berupa tanggal yang valid"),
});

