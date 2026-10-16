'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPostBySlug } from '../../../services/apiService';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function DetailBeritaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPostBySlug } from '../../../services/apiService';
import Link from 'next/link';

// Gunakan NEXT_PUBLIC_IMAGE_URL dari Vercel
const API_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function DetailBeritaPage() {
  const params = useParams();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentSlug = params?.slug;
    if (currentSlug) {
      // Dekode slug jika berupa array atau memiliki karakter khusus
      const decodedSlug = Array.isArray(currentSlug) ? currentSlug[0] : currentSlug;
      loadPost(decodedSlug);
    }
  }, [params]);

  const loadPost = async (slugToFetch: string) => {
    try {
      setLoading(true);
      const res = await getPostBySlug(slugToFetch);
      
      // Menangani berbagai format respon dari backend (res.data, res.success, atau langsung object)
      if (res?.success && res?.data) {
        setPost(res.data);
      } else if (res?.data) {
        setPost(res.data);
      } else if (res && !res.success && res.id) {
        setPost(res);
      } else {
        setPost(null);
      }
    } catch (err) {
      console.error('Gagal mengambil detail berita:', err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-sm font-medium text-neutral-500">
        Memuat berita...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-neutral-800 mb-2">Berita Tidak Ditemukan</h2>
        <p className="text-xs text-neutral-500 mb-6">Artikel yang kamu cari tidak ada atau telah dihapus.</p>
        <Link href="/" className="bg-maroon-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Sekolah" className="w-9 h-9 object-contain" />
            <div>
              <h1 className="text-base font-black text-neutral-900 leading-none">SMK GALUH RAHAYU SINDANGKASIH</h1>
              <span className="text-[10px] text-maroon-700 font-bold uppercase">Berita & Informasi</span>
            </div>
          </Link>
          <Link href="/" className="text-xs font-bold text-neutral-600 hover:text-maroon-700">
            &larr; Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <article className="bg-white rounded-3xl border border-neutral-200 p-6 md:p-10 shadow-xs">
          <div className="mb-6">
            <span className="bg-maroon-50 text-maroon-700 text-xs font-extrabold px-3 py-1 rounded-md border border-maroon-100 uppercase">
              {post.category?.name || 'Pengumuman'}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-neutral-900 mt-3 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-neutral-400 mt-4 border-b border-neutral-100 pb-4">
              <span>Oleh: <strong className="text-neutral-700">{post.user?.name || 'Admin'}</strong></span>
              <span>•</span>
              <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {post.featuredImage && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-100 max-h-[420px]">
              <img src={getImageSrc(post.featuredImage)} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="text-neutral-800 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal">
            {post.body || post.content}
          </div>
        </article>
      </main>
    </div>
  );
}
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      const res = await getPostBySlug(slug);
      if (res?.success) {
        setPost(res.data);
      }
    } catch (err) {
      console.error('Gagal mengambil detail berita:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-sm font-medium text-neutral-500">
        Memuat berita...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-neutral-800 mb-2">Berita Tidak Ditemukan</h2>
        <p className="text-xs text-neutral-500 mb-6">Artikel yang kamu cari tidak ada atau telah dihapus.</p>
        <Link href="/" className="bg-maroon-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Sekolah" className="w-9 h-9 object-contain" />
            <div>
              <h1 className="text-base font-black text-neutral-900 leading-none">SMK GALUH RAHAYU SINDANGKASIH</h1>
              <span className="text-[10px] text-maroon-700 font-bold uppercase">Berita & Informasi</span>
            </div>
          </Link>
          <Link href="/" className="text-xs font-bold text-neutral-600 hover:text-maroon-700">
            &larr; Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <article className="bg-white rounded-3xl border border-neutral-200 p-6 md:p-10 shadow-xs">
          <div className="mb-6">
            <span className="bg-maroon-50 text-maroon-700 text-xs font-extrabold px-3 py-1 rounded-md border border-maroon-100 uppercase">
              {post.category?.name || 'Pengumuman'}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-neutral-900 mt-3 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-neutral-400 mt-4 border-b border-neutral-100 pb-4">
              <span>Oleh: <strong className="text-neutral-700">{post.user?.name || 'Admin'}</strong></span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {post.featuredImage && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-100 max-h-[420px]">
              <img src={getImageSrc(post.featuredImage)} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="text-neutral-800 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal">
            {post.body}
          </div>
        </article>
      </main>
    </div>
  );
}
