'use client';

import { useEffect, useState } from 'react';
import { getMajors, getPosts, getGalleries, sendContactMessage } from '../services/apiService';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function HomePage() {
  const [majors, setMajors] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State Form Kontak
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [majorsRes, postsRes, galleriesRes] = await Promise.all([
          getMajors(),
          getPosts(),
          getGalleries(),
        ]);
        if (majorsRes?.success) setMajors(majorsRes.data);
        if (postsRes?.success) setPosts(postsRes.data);
        if (galleriesRes?.success) setGalleries(galleriesRes.data);
      } catch (err) {
        console.error('Gagal mengambil data dari API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageSrc = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    return `${API_BASE_URL}${path}`;
  };

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      const res = await sendContactMessage(contactForm);
      if (res?.success) {
        alert('Pesan Anda berhasil terkirim! Pihak sekolah akan segera menghubungi Anda.');
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSubmittingContact(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-maroon-700 selection:text-white">
      {/* Top Utility Bar */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-medium">📍 Jl. Raya Sindangkasih, Ciamis, Jawa Barat 46268</p>
          <div className="flex items-center gap-4">
            <a href="tel:0265771234" className="hover:text-amber-400 transition">📞 (0265) 771234</a>
            <span>|</span>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">💬 WA: 0812-3456-7890</a>
            <span>|</span>
            <Link href="/admin/login" className="hover:text-amber-400 font-semibold transition">Portal Admin</Link>
          </div>
        </div>
      </div>

      {/* Main Header / Navbar */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo SMK Galuh Rahayu"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-extrabold text-neutral-900 tracking-tight leading-none">
                SMK GALUH RAHAYU SINDANGKASIH
              </h1>
              <span className="text-xs text-maroon-700 font-bold uppercase tracking-wider">
                Sindangkasih - Ciamis
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 font-medium text-sm text-neutral-700">
            <Link href="/" className="text-maroon-700 font-semibold hover:text-maroon-800 transition">Beranda</Link>
            <Link href="#jurusan" className="hover:text-maroon-700 transition">Program Keahlian</Link>
            <Link href="#galeri" className="hover:text-maroon-700 transition">Galeri</Link>
            <Link href="#berita" className="hover:text-maroon-700 transition">Berita & Informasi</Link>
            <Link href="#kontak" className="hover:text-maroon-700 transition">Kontak</Link>
            <Link href="/ppdb" className="bg-maroon-700 hover:bg-maroon-800 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition border border-maroon-900">
              Pendaftaran PPDB
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section dengan Background bg.png */}
      <section 
        className="relative text-white py-24 px-6 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Layer Overlay Gelap untuk Kontras Teks */}
        <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-[1px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block bg-maroon-700/80 border border-amber-500/50 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider backdrop-blur-sm shadow-md">
            Portal Official Website SMK Galuh Rahayu Sindangkasih
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight drop-shadow-md">
            Membentuk Generasi Berkarakter, Kompeten & Siap Kerja
          </h2>
          <p className="text-neutral-200 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-light drop-shadow">
            Selamat datang di Website Resmi <strong className="text-white font-semibold">SMK Galuh Rahayu Sindangkasih</strong>. Sekolah vokasi dengan kurikulum industri, fasilitas modern, dan penanaman nilai moral yang tinggi.
          </p>
          
        </div>
      </section>

      {/* Program Keahlian / Jurusan */}
      <section id="jurusan" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-maroon-700 uppercase tracking-widest mb-2">Pilihan Karir</h2>
          <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Program Keahlian Unggulan</h3>
          <div className="w-16 h-1 bg-maroon-700 mx-auto mt-4 rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-neutral-400">Memuat data jurusan...</div>
        ) : majors.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-200">
            Belum ada data jurusan yang tersedia.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majors.map((m) => (
              <div 
                key={m.id} 
                className="group bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-xl hover:border-maroon-700 transition duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-maroon-50 text-maroon-700 border border-maroon-100 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                      {m.code}
                    </span>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  </div>
                  <h4 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-maroon-700 transition">
                    {m.name}
                  </h4>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                    {m.description || 'Program keahlian terintegrasi berbasis praktik langsung untuk memenuhi kebutuhan industri modern.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
                  <span>Kepala Program:</span>
                  <span className="text-neutral-900 font-semibold">{m.headOfMajor || '-'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SEKSI GALERI SEKOLAH */}
      <section id="galeri" className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-maroon-700 uppercase tracking-widest mb-2">Dokumentasi Sekolah</h2>
            <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Galeri & Kegiatan Siswa</h3>
            <div className="w-16 h-1 bg-maroon-700 mx-auto mt-4 rounded-full"></div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-neutral-400">Memuat galeri...</div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-200">
              Belum ada foto galeri dipublikasikan.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleries.map((item) => (
                <div key={item.id} className="group bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs hover:shadow-lg transition duration-300 flex flex-col justify-between">
                  <div className="w-full h-48 overflow-hidden bg-neutral-200 relative">
                    <img
                      src={getImageSrc(item.imagePath)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase bg-maroon-700 text-white px-2.5 py-1 rounded-md shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-neutral-900 text-sm line-clamp-1">{item.title}</h4>
                    {item.caption && (
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{item.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Berita & Pengumuman */}
      <section id="berita" className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-maroon-700 uppercase tracking-widest mb-2">Informasi Terbaru</h2>
            <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Berita & Pengumuman Sekolah</h3>
            <div className="w-16 h-1 bg-maroon-700 mx-auto mt-4 rounded-full"></div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-neutral-400">Memuat berita...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 bg-white rounded-2xl border border-neutral-200">
              Belum ada berita dipublikasikan.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between">
                  <div>
                    {post.featuredImage && (
                      <Link href={`/berita/${post.slug}`}>
                        <div className="w-full h-48 overflow-hidden bg-neutral-100 border-b border-neutral-100 cursor-pointer">
                          <img
                            src={getImageSrc(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="p-7">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-maroon-700 uppercase tracking-wider">
                          {post.category?.name || 'Pengumuman'}
                        </span>
                      </div>
                      <Link href={`/berita/${post.slug}`}>
                        <h4 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 hover:text-maroon-700 transition cursor-pointer">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="text-neutral-600 text-sm line-clamp-3 leading-relaxed mb-4">
                        {post.body}
                      </p>
                    </div>
                  </div>

                  <div className="px-7 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500 font-medium">
                    <span>Oleh: <strong className="text-neutral-700">{post.user?.name || 'Admin'}</strong></span>
                    <span>{post.views || 0} Views</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEKSI KONTAK & PESAN */}
      <section id="kontak" className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-maroon-700 uppercase tracking-widest mb-2">Hubungi Kami</h2>
            <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Kirim Pesan & Pertanyaan</h3>
            <div className="w-16 h-1 bg-maroon-700 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Informational Card */}
            <div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h4 className="text-xl font-black tracking-tight">SMK Galuh Rahayu Sindangkasih</h4>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Ada pertanyaan seputar PPDB, program keahlian, atau kerjasama industri? Kirim pesan Anda melalui formulir di samping atau hubungi kontak resmi kami.
              </p>
              <div className="space-y-4 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <span>Jl. Raya Sindangkasih, Kec. Sindangkasih, Kab. Ciamis, Jawa Barat 46268</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📧</span>
                  <a href="mailto:info@smkgaluhrahayu.sch.id" className="hover:underline">info@smkgaluhrahayu.sch.id</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📞</span>
                  <span>(0265) 771234 / 0812-3456-7890</span>
                </div>
              </div>
            </div>

            {/* Form Input Pesan */}
            <form onSubmit={handleSendContact} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-maroon-700 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-maroon-700 bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Nomor Telepon/HP</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-maroon-700 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Subjek *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Pertanyaan PPDB, Informasi, dll"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-maroon-700 bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Isi Pesan *</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tuliskan pesan Anda..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-maroon-700 bg-white outline-none leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingContact}
                className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md disabled:opacity-50"
              >
                {submittingContact ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">SMK GALUH RAHAYU SINDANGKASIH</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Kecamatan Sindangkasih, Kabupaten Ciamis, Jawa Barat. Mencetak lulusan kompeten, berakhlak mulia, dan berdaya saing global.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#jurusan" className="hover:text-white transition">Program Keahlian</Link></li>
              <li><Link href="#galeri" className="hover:text-white transition">Galeri Kegiatan</Link></li>
              <li><Link href="#berita" className="hover:text-white transition">Berita & Informasi</Link></li>
              <li><Link href="#kontak" className="hover:text-white transition">Kontak Kami</Link></li>
              <li><Link href="/ppdb" className="hover:text-white transition">Pendaftaran PPDB</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Kontak Sekolah</h4>
            <p className="text-sm text-neutral-400">Email: info@smkgaluhrahayu.sch.id</p>
            <p className="text-sm text-neutral-400 mt-1">Telp: (0265) 771234 / 0812-3456-7890</p>
            <p className="text-sm text-neutral-400 mt-1">Sindangkasih - Ciamis, Jawa Barat</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} SMK Galuh Rahayu Sindangkasih - Ciamis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}