import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMK Galuh Rahayu Sindangkasih - Ciamis | Official Website',
  description:
    'Website Resmi SMK Galuh Rahayu Sindangkasih, Ciamis. Informasi Pendaftaran PPDB Online, Program Keahlian, Berita Kegiatan, dan Galeri Sekolah.',
  keywords: [
    'SMK Galuh Rahayu',
    'SMK Galuh Rahayu Sindangkasih',
    'PPDB SMK Galuh Rahayu',
    'SMK Ciamis',
    'Sekolah Vokasi Ciamis',
  ],
  authors: [{ name: 'SMK Galuh Rahayu' }],
  openGraph: {
    title: 'SMK Galuh Rahayu Sindangkasih',
    description: 'Membentuk Generasi Berkarakter, Kompeten & Siap Kerja',
    url: 'https://smkgaluhrahayu.sch.id',
    siteName: 'SMK Galuh Rahayu',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Logo SMK Galuh Rahayu',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}