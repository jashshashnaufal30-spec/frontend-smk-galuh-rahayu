'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '../../../services/apiService';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('super_admin');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isRegister) {
        // Proses Registrasi Admin Baru
        const res = await registerUser({ name, email, password, role });
        if (res?.success) {
          setSuccessMsg('Akun Admin berhasil dibuat! Silahkan login.');
          setIsRegister(false);
          setPassword('');
        } else {
          setErrorMsg(res?.message || 'Gagal membuat akun admin.');
        }
      } else {
        // Proses Login Admin
        const res = await loginUser({ email, password });
        if (res?.success && res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          router.push('/admin/dashboard');
        } else {
          setErrorMsg(res?.message || 'Login gagal, periksa email dan password.');
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan pada server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4 font-sans py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-neutral-200">
        <div className="text-center mb-6">
          {/* Logo Sekolah */}
          <img
            src="/logo.png"
            alt="Logo SMK Galuh Rahayu"
            className="w-16 h-16 object-contain mx-auto mb-3"
          />
          <h2 className="text-2xl font-extrabold text-neutral-900">
            {isRegister ? 'Buat Akun Admin' : 'Login Admin SMK Galuh Rahayu'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
            Sistem Informasi SMK Galuh Rahayu
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isRegister
                ? 'bg-white text-maroon-700 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Masuk / Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isRegister
                ? 'bg-white text-maroon-700 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
            <span>✅</span> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                Nama Lengkap Admin *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Admin PPDB Galuh"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
              Email Admin *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smkgaluhrahayu.sch.id"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                Pilih Role Admin *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm bg-white font-semibold text-neutral-800"
              >
                <option value="super_admin">Super Admin (Akses Penuh)</option>
                <option value="admin_ppdb">Admin PPDB (Kelola Siswa Baru)</option>
                <option value="admin_berita">Admin Berita (Kelola Konten)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition border border-amber-500/40 text-sm disabled:opacity-50 mt-2"
          >
            {loading
              ? 'Memproses...'
              : isRegister
              ? 'Buat Akun Admin Sekarang'
              : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-neutral-500 hover:text-maroon-700 transition"
          >
            &larr; Kembali ke Beranda Utama
          </Link>
        </div>
      </div>
    </div>
  );
}