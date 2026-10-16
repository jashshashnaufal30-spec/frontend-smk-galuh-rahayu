import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-6 text-center font-sans">
      <div className="w-20 h-20 bg-maroon-700/80 border-2 border-amber-500/50 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl">
        404
      </div>
      <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-neutral-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="bg-maroon-700 hover:bg-maroon-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition border border-amber-500/40 text-xs uppercase tracking-wider"
      >
        &larr; Kembali ke Beranda
      </Link>
    </div>
  );
}