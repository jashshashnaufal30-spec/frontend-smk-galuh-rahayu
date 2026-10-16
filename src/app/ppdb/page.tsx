'use client';

import { useEffect, useState } from 'react';
import { getMajors, submitPpdb } from '../../services/apiService';
import Link from 'next/link';

export default function PpdbPage() {
  const [majors, setMajors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState<any>(null);

  const [formData, setFormData] = useState({
    registrationNumber: '',
    fullName: '',
    nisn: '',
    gender: 'L',
    placeOfBirth: '',
    dateOfBirth: '',
    religion: 'Islam',
    schoolOrigin: '',
    address: '',
    parentName: '',
    parentPhone: '',
    phoneNumber: '',
    majorId: '',
  });

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const res = await getMajors();
        if (res?.success && res.data.length > 0) {
          setMajors(res.data);
          setFormData((prev) => ({
            ...prev,
            majorId: res.data[0].id.toString(),
            registrationNumber: `PPDB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          }));
        }
      } catch (err) {
        console.error('Gagal mengambil data jurusan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const regNo =
        formData.registrationNumber || `PPDB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const selectedMajor = majors.find((m) => m.id.toString() === formData.majorId.toString());

      const payload = {
        registrationNumber: regNo,
        fullName: formData.fullName,
        nisn: formData.nisn,
        gender: formData.gender,
        placeOfBirth: formData.placeOfBirth,
        dateOfBirth: formData.dateOfBirth,
        religion: formData.religion,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        schoolOrigin: formData.schoolOrigin,
        majorId: Number(formData.majorId),
      };

      const res = await submitPpdb(payload);

      if (res?.success || res?.status === 201 || res?.status === 200) {
        setSuccessMsg(`Pendaftaran PPDB Berhasil Diajukan! Nomor Pendaftaran Anda: ${regNo}`);
        setSubmittedData({ ...payload, majorName: selectedMajor?.name || 'RPL' });
      } else {
        setErrorMsg(res?.message || 'Gagal mengirim pendaftaran.');
      }
    } catch (err: any) {
      console.error('Error Submit PPDB:', err);
      const msg =
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat mengirim data ke server.';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* STYLING PRINT MARGIN A4 & PADDING INTERNAL */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 2.5cm 2.5cm 2.5cm 2.5cm; /* Top 2.5, Right 2.5, Bottom 2.5, Left 2.5 */
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            font-family: Arial, Helvetica, sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 10px !important; /* Mencegah elemen terlalu mepet pinggir */
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* Navbar Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo SMK Galuh Rahayu" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-extrabold text-neutral-900 leading-none">
                SMK GALUH RAHAYU SINDANGKASIH
              </h1>
              <span className="text-xs text-maroon-700 font-bold uppercase tracking-wider">
                Sindangkasih - Ciamis
              </span>
            </div>
          </Link>
          <Link href="/" className="text-sm font-semibold text-neutral-600 hover:text-maroon-700 transition">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Banner */}
      <section className="bg-neutral-900 text-white py-12 px-6 text-center border-b border-maroon-900 no-print">
        <span className="bg-maroon-700 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-amber-500/30">
          PPDB Online 2026/2027
        </span>
        <h2 className="text-3xl font-extrabold mt-4 mb-2">Formulir Pendaftaran Siswa Baru</h2>
        <p className="text-neutral-400 text-sm max-w-xl mx-auto">
          Isi data calon peserta didik dengan benar dan lengkap sesuai dokumen resmi.
        </p>
      </section>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 print-container">
        
        {/* KOP SURAT RESMI SEKOLAH */}
        <div className="print-only mb-6 px-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <img src="/logo.png" alt="Logo Sekolah" className="w-20 h-20 object-contain ml-2" />
            <div className="text-center flex-1 px-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800">YAYASAN GALUH RAHAYU</h3>
              <h1 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">SMK GALUH RAHAYU SINDANGKASIH</h1>
              <p className="text-[11px] font-medium leading-tight mt-1 text-neutral-800">
                Jl. Raya Sindangkasih, Kecamatan Sindangkasih, Kabupaten Ciamis, Jawa Barat 46268
              </p>
              <p className="text-[10px] text-neutral-600 italic">
                Email: info@smkgaluhrahayu.sch.id | Website: www.smkgaluhrahayu.sch.id
              </p>
            </div>
            <div className="w-20 mr-2"></div>
          </div>
          {/* Garis Ganda Kop Surat */}
          <div className="border-b-4 border-black mt-0.5 mb-6"></div>

          <div className="text-center mb-6">
            <h2 className="text-base font-extrabold uppercase underline tracking-wider text-black">BUKTI PENDAFTARAN PPDB ONLINE</h2>
            <p className="text-xs font-bold text-neutral-700 mt-1">Tahun Ajaran 2026/2027</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-10 border border-neutral-200 shadow-sm print-container">
          
          {/* Pesan Sukses & Tombol Cetak */}
          {successMsg && (
            <div className="mb-6 p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-medium no-print">
              <div className="flex items-center gap-2 text-lg font-bold text-emerald-800 mb-2">
                <span>✅</span> {successMsg}
              </div>
              <p className="text-xs text-emerald-700 mb-4">
                Silakan simpan atau cetak bukti pendaftaran ini sebagai berkas verifikasi ulang ke sekolah.
              </p>
              <button
                onClick={handlePrint}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-lg text-xs shadow transition flex items-center gap-2"
              >
                📄 Cetak / Download PDF (A4)
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl font-medium flex items-center gap-2 no-print">
              <span>⚠️</span> {errorMsg}
            </div>
          )}

          {/* RINGKASAN CETAK PPDB BUKTI DOKUMEN */}
          {submittedData ? (
            <div className="space-y-6 text-sm px-2">
              <div className="flex justify-between items-center border-b pb-3 no-print">
                <h3 className="text-lg font-bold text-neutral-900">Ringkasan Data Pendaftar</h3>
                <button
                  onClick={handlePrint}
                  className="bg-maroon-700 hover:bg-maroon-800 text-white font-bold px-5 py-2 rounded-lg text-xs transition shadow-md"
                >
                  🖨️ Cetak / Simpan PDF
                </button>
              </div>

              {/* Tabel Ringkasan Resmi A4 dengan Margin Samping */}
              <table className="w-full border-collapse border border-neutral-400 text-xs">
                <tbody>
                  <tr className="bg-neutral-100 text-black font-extrabold">
                    <td colSpan={2} className="border border-neutral-400 p-2.5 uppercase tracking-wider">I. DATA UTAMA PENDAFTARAN</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold w-1/3 bg-neutral-50/50">Nomor Pendaftaran</td>
                    <td className="border border-neutral-400 p-2.5 font-mono font-bold text-base text-maroon-900">{submittedData.registrationNumber}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">Pilihan Jurusan</td>
                    <td className="border border-neutral-400 p-2.5 font-bold">{submittedData.majorName}</td>
                  </tr>

                  <tr className="bg-neutral-100 text-black font-extrabold">
                    <td colSpan={2} className="border border-neutral-400 p-2.5 uppercase tracking-wider">II. DATA PRIBADI SISWA</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">Nama Lengkap</td>
                    <td className="border border-neutral-400 p-2.5 uppercase font-semibold">{submittedData.fullName}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">NISN</td>
                    <td className="border border-neutral-400 p-2.5">{submittedData.nisn}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">Jenis Kelamin</td>
                    <td className="border border-neutral-400 p-2.5">{submittedData.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">Tempat, Tanggal Lahir</td>
                    <td className="border border-neutral-400 p-2.5">{submittedData.placeOfBirth}, {submittedData.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">Agama</td>
                    <td className="border border-neutral-400 p-2.5">{submittedData.religion}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">Asal Sekolah</td>
                    <td className="border border-neutral-400 p-2.5">{submittedData.schoolOrigin}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">No. HP / WA Siswa</td>
                    <td className="border border-neutral-400 p-2.5">{submittedData.phoneNumber}</td>
                  </tr>

                  <tr className="bg-neutral-100 text-black font-extrabold">
                    <td colSpan={2} className="border border-neutral-400 p-2.5 uppercase tracking-wider">III. DATA ORANG TUA / WALI & ALAMAT</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">Nama Orang Tua / Wali</td>
                    <td className="border border-neutral-400 p-2.5">{submittedData.parentName}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">No. HP Orang Tua</td>
                    <td className="border border-neutral-400 p-2.5">{submittedData.parentPhone}</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-400 p-2.5 font-bold bg-neutral-50/50">Alamat Lengkap</td>
                    <td className="border border-neutral-400 p-2.5 leading-relaxed">{submittedData.address}</td>
                  </tr>
                </tbody>
              </table>

              {/* TANDA TANGAN */}
              <div className="print-only pt-10 mt-6">
                <div className="flex justify-between text-xs text-center">
                  <div className="w-1/2">
                    <p className="font-semibold">Panitia PPDB,</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline">(..............................................)</p>
                  </div>
                  <div className="w-1/2">
                    <p className="font-medium">Ciamis, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-semibold">Calon Peserta Didik,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline uppercase">{submittedData.fullName}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* FORMULIR INPUT PPDB ONLINE */
            loading ? (
              <div className="text-center py-12 text-neutral-500">Memuat formulir pendaftaran...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-bold text-neutral-900 border-b pb-3 border-neutral-200">
                  1. Data Pribadi Calon Siswa
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Sesuai Ijazah SMP/MTs"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      NISN *
                    </label>
                    <input
                      type="text"
                      name="nisn"
                      required
                      value={formData.nisn}
                      onChange={handleChange}
                      placeholder="10 digit NISN"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Jenis Kelamin *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm bg-white"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Agama *
                    </label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm bg-white"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Pilihan Jurusan *
                    </label>
                    <select
                      name="majorId"
                      value={formData.majorId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm bg-white font-semibold text-maroon-700"
                    >
                      {majors.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.code} - {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      required
                      value={formData.placeOfBirth}
                      onChange={handleChange}
                      placeholder="Kota / Kabupaten Lahir"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 border-b pb-3 border-neutral-200 pt-4">
                  2. Data Asal Sekolah & Orang Tua / Wali
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Asal Sekolah *
                    </label>
                    <input
                      type="text"
                      name="schoolOrigin"
                      required
                      value={formData.schoolOrigin}
                      onChange={handleChange}
                      placeholder="SMPN / MTs asal"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      No. HP / WA Calon Siswa *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Nama Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Nama Ayah / Ibu / Wali"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      No. HP / WA Orang Tua / Wali *
                    </label>
                    <input
                      type="tel"
                      name="parentPhone"
                      required
                      value={formData.parentPhone}
                      onChange={handleChange}
                      placeholder="Contoh: 081987654321"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Kampung/Jalan, RT/RW, Desa/Kelurahan, Kecamatan"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-4 rounded-xl shadow-lg transition border border-amber-500/40 text-base disabled:opacity-50"
                  >
                    {submitting ? 'Sedang Mengirim Pendaftaran...' : 'Kirim Pendaftaran PPDB'}
                  </button>
                </div>
              </form>
            )
          )}
        </div>
      </main>
    </div>
  );
}