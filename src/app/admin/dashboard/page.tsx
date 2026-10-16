'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAllPpdb,
  updatePpdbStatus,
  deletePpdb,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getMajors,
  createMajor,
  updateMajor,
  deleteMajor,
  uploadImage,
  getUsers,
  createUser,
  updateUserRole,
  resetUserPassword,
  deleteUser,
  getGalleries,
  createGallery,
  deleteGallery,
  getContacts,
  markContactAsRead,
  deleteContact,
} from '../../../services/apiService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'ppdb' | 'posts' | 'majors' | 'users' | 'galleries' | 'contacts'>('ppdb');

  // State Data Main Dashboard
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [galleriesList, setGalleriesList] = useState<any[]>([]);
  const [contactsList, setContactsList] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // State Form User Management
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('admin_berita');
  const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // State Form Galeri
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('kegiatan');
  const [galleryImage, setGalleryImage] = useState('');

  // State Form Berita
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postImage, setPostImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // State Form Jurusan
  const [editingMajorId, setEditingMajorId] = useState<number | null>(null);
  const [majorCode, setMajorCode] = useState('');
  const [majorName, setMajorName] = useState('');
  const [headOfMajor, setHeadOfMajor] = useState('');
  const [majorDescription, setMajorDescription] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      if (parsedUser.role === 'admin_berita') {
        setActiveTab('posts');
      }
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [ppdbRes, postsRes, majorsRes, usersRes, galleriesRes, contactsRes] = await Promise.allSettled([
        getAllPpdb(),
        getPosts(),
        getMajors(),
        getUsers(),
        getGalleries(),
        getContacts(),
      ]);

      if (ppdbRes.status === 'fulfilled' && ppdbRes.value?.success) setRegistrations(ppdbRes.value.data || []);
      if (postsRes.status === 'fulfilled' && postsRes.value?.success) setPosts(postsRes.value.data || []);
      if (majorsRes.status === 'fulfilled' && majorsRes.value?.success) setMajors(majorsRes.value.data || []);
      if (usersRes.status === 'fulfilled' && usersRes.value?.success) setUsersList(usersRes.value.data || []);
      if (galleriesRes.status === 'fulfilled' && galleriesRes.value?.success) setGalleriesList(galleriesRes.value.data || []);
      if (contactsRes.status === 'fulfilled' && contactsRes.value?.success) setContactsList(contactsRes.value.data || []);
    } catch (err) {
      console.error('Gagal memuat data dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // --- HANDLER UPLOAD FILE (GLOBAL) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'post' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    const convertToBase64Compressed = (inputFile: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scale = MAX_WIDTH / img.width;

          if (img.width > MAX_WIDTH) {
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scale;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          if (target === 'post') setPostImage(compressedBase64);
          else setGalleryImage(compressedBase64);
          setUploadingImage(false);
        };
      };
      reader.readAsDataURL(inputFile);
    };

    try {
      const res = await uploadImage(file);
      if (res?.success && (res?.url || res?.data?.url)) {
        const imgUrl = res.url || res.data.url;
        if (target === 'post') setPostImage(imgUrl);
        else setGalleryImage(imgUrl);
        setUploadingImage(false);
      } else {
        convertToBase64Compressed(file);
      }
    } catch (err) {
      convertToBase64Compressed(file);
    }
  };

  // --- HANDLER USER MANAGEMENT ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      });
      if (res?.success) {
        alert('Admin baru berhasil ditambahkan!');
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('admin_berita');
        loadDashboardData();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal membuat user.');
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      const res = await updateUserRole(id, newRole);
      if (res?.success) loadDashboardData();
    } catch (err) {
      alert('Gagal mengedit role user.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordId || !newPasswordVal) return;
    try {
      const res = await resetUserPassword(resetPasswordId, newPasswordVal);
      if (res?.success) {
        alert('Password berhasil direset!');
        setResetPasswordId(null);
        setNewPasswordVal('');
      }
    } catch (err) {
      alert('Gagal mereset password.');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Yakin ingin menghapus user ini?')) {
      try {
        const res = await deleteUser(id);
        if (res?.success) loadDashboardData();
      } catch (err) {
        alert('Gagal menghapus user.');
      }
    }
  };

  // --- HANDLER GALERI ---
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createGallery({
        title: galleryTitle,
        caption: galleryCaption,
        category: galleryCategory,
        imagePath: galleryImage,
      });
      if (res?.success) {
        alert('Foto berhasil ditambahkan ke galeri!');
        setGalleryTitle('');
        setGalleryCaption('');
        setGalleryImage('');
        loadDashboardData();
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menyimpan galeri.');
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (confirm('Yakin ingin menghapus foto ini?')) {
      try {
        const res = await deleteGallery(id);
        if (res?.success) loadDashboardData();
      } catch (err) {
        alert('Gagal menghapus galeri.');
      }
    }
  };

  // --- HANDLER KONTAK ---
  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await markContactAsRead(id);
      if (res?.success) loadDashboardData();
    } catch (err) {
      alert('Gagal memperbarui status pesan.');
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (confirm('Yakin ingin menghapus pesan ini?')) {
      try {
        const res = await deleteContact(id);
        if (res?.success) loadDashboardData();
      } catch (err) {
        alert('Gagal menghapus pesan.');
      }
    }
  };

  // --- HANDLER PPDB ---
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await updatePpdbStatus(id, newStatus);
      if (res?.success) loadDashboardData();
    } catch (err) {
      alert('Gagal memperbarui status pendaftaran.');
    }
  };

  const handleDeletePpdb = async (id: number) => {
    if (confirm('Yakin ingin menghapus data pendaftar ini?')) {
      try {
        const res = await deletePpdb(id);
        if (res?.success) loadDashboardData();
      } catch (err) {
        alert('Gagal menghapus pendaftar.');
      }
    }
  };

  // --- HANDLER POSTS ---
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: postTitle,
      body: postBody,
      slug: postTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      featuredImage: postImage || null,
      categoryId: 1,
    };

    try {
      if (editingPostId) {
        const res = await updatePost(editingPostId, payload);
        if (res?.success) resetPostForm();
      } else {
        const res = await createPost(payload);
        if (res?.success) resetPostForm();
      }
      loadDashboardData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menyimpan berita.');
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostBody(post.body);
    setPostImage(post.featuredImage || '');
  };

  const resetPostForm = () => {
    setEditingPostId(null);
    setPostTitle('');
    setPostBody('');
    setPostImage('');
  };

  const handleDeletePost = async (id: number) => {
    if (confirm('Yakin ingin menghapus berita ini?')) {
      try {
        const res = await deletePost(id);
        if (res?.success) loadDashboardData();
      } catch (err) {
        alert('Gagal menghapus berita.');
      }
    }
  };

  // --- HANDLER MAJORS ---
  const handleSaveMajor = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: majorCode,
      name: majorName,
      slug: majorCode.toLowerCase(),
      headOfMajor: headOfMajor || null,
      description: majorDescription || null,
    };

    try {
      if (editingMajorId) {
        const res = await updateMajor(editingMajorId, payload);
        if (res?.success) resetMajorForm();
      } else {
        const res = await createMajor(payload);
        if (res?.success) resetMajorForm();
      }
      loadDashboardData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menyimpan jurusan.');
    }
  };

  const handleEditMajor = (major: any) => {
    setEditingMajorId(major.id);
    setMajorCode(major.code);
    setMajorName(major.name);
    setHeadOfMajor(major.headOfMajor || '');
    setMajorDescription(major.description || '');
  };

  const resetMajorForm = () => {
    setEditingMajorId(null);
    setMajorCode('');
    setMajorName('');
    setHeadOfMajor('');
    setMajorDescription('');
  };

  const handleDeleteMajor = async (id: number) => {
    if (confirm('Yakin ingin menghapus jurusan ini?')) {
      try {
        const res = await deleteMajor(id);
        if (res?.success) loadDashboardData();
      } catch (err) {
        alert('Gagal menghapus jurusan.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const filteredRegistrations = registrations.filter(
    (item) =>
      item.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.nisn?.includes(search)
  );

  return (
    <div className="min-h-screen bg-neutral-100 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo SMK Galuh Rahayu" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-base font-black text-neutral-900 leading-none tracking-tight">
                PANEL ADMIN 
              </h1>
              <span className="text-xs text-neutral-500 font-medium">SMK Galuh Rahayu Sindangkasih</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-neutral-900">{user?.name || 'Admin'}</p>
              <span className="text-[10px] bg-maroon-50 text-maroon-700 border border-maroon-200 font-bold px-2 py-0.5 rounded uppercase">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl transition shadow-xs"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Buttons Navigation */}
        <div className="flex flex-wrap border border-neutral-200 mb-8 bg-white rounded-2xl p-1.5 shadow-sm gap-2">
          {(user?.role === 'super_admin' || user?.role === 'admin_ppdb') && (
            <button
              onClick={() => setActiveTab('ppdb')}
              className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition ${
                activeTab === 'ppdb' ? 'bg-maroon-700 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              🎓 Kelola PPDB ({registrations.length})
            </button>
          )}

          {(user?.role === 'super_admin' || user?.role === 'admin_berita') && (
            <>
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition ${
                  activeTab === 'posts' ? 'bg-maroon-700 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                📰 Berita Sekolah ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('majors')}
                className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition ${
                  activeTab === 'majors' ? 'bg-maroon-700 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                🏫 Program Keahlian ({majors.length})
              </button>
              <button
                onClick={() => setActiveTab('galleries')}
                className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition ${
                  activeTab === 'galleries' ? 'bg-maroon-700 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                🖼️ Galeri Sekolah ({galleriesList.length})
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition ${
                  activeTab === 'contacts' ? 'bg-maroon-700 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                📩 Pesan Masuk ({contactsList.length})
              </button>
            </>
          )}

          {/* TAB KHUSUS SUPER_ADMIN */}
          {user?.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition ${
                activeTab === 'users' ? 'bg-maroon-700 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              👥 Kelola Admin ({usersList.length})
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-500 text-sm font-medium">Memuat data dashboard...</div>
        ) : (
          <>
            {/* TAB 1: PPDB */}
            {activeTab === 'ppdb' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-black text-neutral-900 tracking-tight">Pendaftaran Siswa Baru (PPDB)</h2>
                    <p className="text-xs text-neutral-500">Kelola dan verifikasi berkas pendaftaran calon siswa</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Cari Nama / No Reg / NISN..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium outline-none focus:ring-2 focus:ring-maroon-700 bg-white w-full md:w-80 shadow-xs"
                  />
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-[11px] uppercase font-bold tracking-wider">
                          <th className="py-4 px-6">No. Reg</th>
                          <th className="py-4 px-6">Siswa & NISN</th>
                          <th className="py-4 px-6">Jurusan</th>
                          <th className="py-4 px-6">Asal Sekolah</th>
                          <th className="py-4 px-6">Kontak / Ortu</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {filteredRegistrations.map((item) => (
                          <tr key={item.id} className="hover:bg-neutral-50/80 transition">
                            <td className="py-4 px-6 font-mono font-bold text-maroon-700 text-xs">{item.registrationNumber}</td>
                            <td className="py-4 px-6">
                              <div className="font-bold text-neutral-900">{item.fullName}</div>
                              <td className="text-xs text-neutral-500">NISN: {item.nisn} ({item.gender})</td>
                            </td>
                            <td className="py-4 px-6">
                              <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-2.5 py-1 rounded-md border border-amber-300">
                                {item.major?.code || 'RPL'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-neutral-700 text-xs font-medium">{item.schoolOrigin}</td>
                            <td className="py-4 px-6 text-xs">
                              <div className="font-semibold text-neutral-800">{item.phoneNumber}</div>
                              <div className="text-neutral-500">Ortu: {item.parentName} ({item.parentPhone})</div>
                            </td>
                            <td className="py-4 px-6">
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none ${
                                  item.status === 'accepted'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : item.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : item.status === 'verified'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleDeletePpdb(item.id)}
                                className="text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition border border-rose-200"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BERITA */}
            {activeTab === 'posts' && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm h-fit">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
                    <h3 className="font-bold text-neutral-900 text-base">{editingPostId ? '✏️ Edit Berita' : '➕ Tambah Berita Baru'}</h3>
                    {editingPostId && (
                      <button
                        type="button"
                        onClick={resetPostForm}
                        className="text-xs text-neutral-500 hover:text-rose-600 font-bold bg-neutral-100 px-2 py-1 rounded-lg transition"
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSavePost} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Judul Berita *</label>
                      <input
                        type="text"
                        required
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Judul Berita Sekolah"
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Upload Gambar Cover / Header</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'post')}
                        className="w-full px-3 py-1.5 border rounded-xl text-xs bg-neutral-50 focus:outline-none file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-maroon-700 file:text-white hover:file:bg-maroon-800"
                      />
                      {uploadingImage && <p className="text-[10px] text-amber-600 font-bold mt-1">Mengunggah gambar...</p>}
                      {postImage && (
                        <div className="mt-3 relative">
                          <img src={getImageSrc(postImage)} alt="Preview Cover" className="w-full h-32 object-cover rounded-xl border" />
                          <button
                            type="button"
                            onClick={() => setPostImage('')}
                            className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] px-2.5 py-1 rounded-md font-bold"
                          >
                            Hapus Gambar
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Isi Berita *</label>
                      <textarea
                        rows={5}
                        required
                        value={postBody}
                        onChange={(e) => setPostBody(e.target.value)}
                        placeholder="Tuliskan berita secara lengkap..."
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-maroon-700 outline-none leading-relaxed"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-3 rounded-xl text-xs transition shadow-md disabled:opacity-50"
                    >
                      {editingPostId ? 'Perbarui Berita' : 'Publikasikan Berita'}
                    </button>
                  </form>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-extrabold text-neutral-900 text-base">Daftar Berita Published</h3>
                  {posts.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl text-center text-neutral-400 text-sm border">Belum ada berita.</div>
                  ) : (
                    posts.map((p) => (
                      <div key={p.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col sm:flex-row gap-4 p-4 items-start shadow-xs hover:shadow-md transition">
                        {p.featuredImage && (
                          <img src={getImageSrc(p.featuredImage)} alt={p.title} className="w-full sm:w-36 h-28 object-cover rounded-xl border flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-900 text-base">{p.title}</h4>
                          <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">{p.body}</p>
                        </div>
                        <div className="flex gap-2 self-end sm:self-start">
                          <button onClick={() => handleEditPost(p)} className="text-xs text-amber-800 font-bold px-3 py-1.5 rounded-lg hover:bg-amber-50 border border-amber-300">
                            Edit
                          </button>
                          <button onClick={() => handleDeletePost(p.id)} className="text-xs text-rose-600 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-rose-200">
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: JURUSAN */}
            {activeTab === 'majors' && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm h-fit">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
                    <h3 className="font-bold text-neutral-900 text-base">{editingMajorId ? '✏️ Edit Jurusan' : '➕ Tambah Jurusan Baru'}</h3>
                    {editingMajorId && (
                      <button type="button" onClick={resetMajorForm} className="text-xs text-neutral-500 hover:text-rose-600 font-bold bg-neutral-100 px-2 py-1 rounded-lg">
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveMajor} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Kode Jurusan *</label>
                      <input
                        type="text"
                        required
                        value={majorCode}
                        onChange={(e) => setMajorCode(e.target.value)}
                        placeholder="Contoh: RPL, TKT, DKV"
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Nama Jurusan *</label>
                      <input
                        type="text"
                        required
                        value={majorName}
                        onChange={(e) => setMajorName(e.target.value)}
                        placeholder="Rekayasa Perangkat Lunak"
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Kaprog</label>
                      <input
                        type="text"
                        value={headOfMajor}
                        onChange={(e) => setHeadOfMajor(e.target.value)}
                        placeholder="Ahmad Hidayat, S.Kom."
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Deskripsi Jurusan</label>
                      <textarea
                        rows={3}
                        value={majorDescription}
                        onChange={(e) => setMajorDescription(e.target.value)}
                        placeholder="Penjelasan singkat jurusan..."
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-maroon-700 outline-none leading-relaxed"
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-3 rounded-xl text-xs transition shadow-md">
                      {editingMajorId ? 'Perbarui Jurusan' : 'Simpan Jurusan'}
                    </button>
                  </form>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-extrabold text-neutral-900 text-base">Daftar Program Keahlian</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {majors.map((m) => (
                      <div key={m.id} className="bg-white p-5 rounded-2xl border border-neutral-200 flex justify-between items-start shadow-xs">
                        <div className="pr-2">
                          <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md border border-amber-300">{m.code}</span>
                          <h4 className="font-bold text-neutral-900 text-sm mt-3">{m.name}</h4>
                          <p className="text-xs text-neutral-500 mt-1">Kaprog: <span className="font-semibold text-neutral-800">{m.headOfMajor || '-'}</span></p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => handleEditMajor(m)} className="text-xs text-amber-800 font-bold px-2.5 py-1 rounded-lg hover:bg-amber-50 border border-amber-300">Edit</button>
                          <button onClick={() => handleDeleteMajor(m.id)} className="text-xs text-rose-600 font-bold px-2.5 py-1 rounded-lg hover:bg-rose-50 border border-rose-200">Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: USERS (SUPER ADMIN) */}
            {activeTab === 'users' && user?.role === 'super_admin' && (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Form Tambah Admin */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm h-fit">
                  <h3 className="font-bold text-neutral-900 text-base mb-4 pb-3 border-b">➕ Tambah Akun Admin</h3>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="Nama Admin"
                        className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-maroon-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="email@smkgaluhrahayu.sch.id"
                        className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-maroon-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="******"
                        className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-maroon-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Role Peran *</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-maroon-700 outline-none font-bold"
                      >
                        <option value="admin_berita">Admin Berita</option>
                        <option value="admin_ppdb">Admin PPDB</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-3 rounded-xl text-xs transition shadow-md">
                      Simpan Admin
                    </button>
                  </form>
                </div>

                {/* Tabel List User */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-extrabold text-neutral-900 text-base">Daftar Pengguna / Admin</h3>
                  <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-neutral-50 border-b text-neutral-600 uppercase font-bold">
                          <th className="py-3.5 px-4">Nama & Email</th>
                          <th className="py-3.5 px-4">Role</th>
                          <th className="py-3.5 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {usersList.map((u) => (
                          <tr key={u.id} className="hover:bg-neutral-50">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-neutral-900">{u.name}</div>
                              <div className="text-neutral-500">{u.email}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className="border rounded-lg px-2 py-1 text-xs font-semibold bg-white"
                              >
                                <option value="super_admin">Super Admin</option>
                                <option value="admin_berita">Admin Berita</option>
                                <option value="admin_ppdb">Admin PPDB</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-center space-x-2">
                              <button onClick={() => setResetPasswordId(u.id)} className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-1 rounded-lg">
                                Reset Pass
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="bg-rose-100 text-rose-700 border border-rose-200 font-bold px-2 py-1 rounded-lg">
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Reset Password Prompt */}
                  {resetPasswordId && (
                    <form onSubmit={handleResetPassword} className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex gap-2 items-center">
                      <input
                        type="password"
                        required
                        placeholder="Password Baru..."
                        value={newPasswordVal}
                        onChange={(e) => setNewPasswordVal(e.target.value)}
                        className="px-3 py-1.5 border rounded-lg text-xs bg-white"
                      />
                      <button type="submit" className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Simpan Password Baru</button>
                      <button type="button" onClick={() => setResetPasswordId(null)} className="text-neutral-500 text-xs font-bold">Batal</button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: GALERI */}
            {activeTab === 'galleries' && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm h-fit">
                  <h3 className="font-bold text-neutral-900 text-base mb-4 pb-3 border-b">🖼️ Tambah Foto Galeri</h3>
                  <form onSubmit={handleSaveGallery} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Judul Foto *</label>
                      <input
                        type="text"
                        required
                        value={galleryTitle}
                        onChange={(e) => setGalleryTitle(e.target.value)}
                        placeholder="Kegiatan Ekstrakurikuler..."
                        className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-maroon-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Kategori *</label>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white font-bold outline-none"
                      >
                        <option value="kegiatan">Kegiatan</option>
                        <option value="fasilitas">Fasilitas</option>
                        <option value="prestasi">Prestasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Upload Foto *</label>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => handleFileUpload(e, 'gallery')}
                        className="w-full px-3 py-1.5 border rounded-xl text-xs bg-neutral-50 file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-maroon-700 file:text-white"
                      />
                      {galleryImage && (
                        <img src={getImageSrc(galleryImage)} alt="Preview" className="w-full h-32 object-cover rounded-xl mt-2 border" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Keterangan / Caption</label>
                      <textarea
                        rows={2}
                        value={galleryCaption}
                        onChange={(e) => setGalleryCaption(e.target.value)}
                        placeholder="Keterangan singkat foto..."
                        className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none"
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-3 rounded-xl text-xs shadow-md">
                      Upload Galeri
                    </button>
                  </form>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-extrabold text-neutral-900 text-base">Koleksi Galeri Foto</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {galleriesList.map((g) => (
                      <div key={g.id} className="bg-white rounded-2xl border overflow-hidden shadow-xs relative group">
                        <img src={getImageSrc(g.imagePath)} alt={g.title} className="w-full h-36 object-cover" />
                        <div className="p-3">
                          <span className="text-[10px] uppercase font-extrabold bg-maroon-50 text-maroon-700 px-2 py-0.5 rounded border border-maroon-200">{g.category}</span>
                          <h4 className="font-bold text-neutral-900 text-xs mt-1">{g.title}</h4>
                          <button
                            onClick={() => handleDeleteGallery(g.id)}
                            className="mt-3 w-full text-xs text-rose-600 font-bold border border-rose-200 rounded-lg py-1 hover:bg-rose-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: KONTAK */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-neutral-900 tracking-tight">Pesan & Masukan Pengunjung</h2>
                <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b text-neutral-600 uppercase font-bold">
                        <th className="py-4 px-6">Pengirim</th>
                        <th className="py-4 px-6">Subjek & Pesan</th>
                        <th className="py-4 px-6">Tanggal</th>
                        <th className="py-4 px-6 text-center">Status / Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {contactsList.map((c) => (
                        <tr key={c.id} className={c.isRead ? 'bg-white' : 'bg-amber-50/50 font-bold'}>
                          <td className="py-4 px-6">
                            <div className="font-bold text-neutral-900">{c.name}</div>
                            <div className="text-neutral-500">{c.email}</div>
                            <div className="text-neutral-400">{c.phone || '-'}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-neutral-800">{c.subject}</div>
                            <p className="text-neutral-600 mt-1 font-normal leading-relaxed">{c.message}</p>
                          </td>
                          <td className="py-4 px-6 text-neutral-500">{new Date(c.createdAt).toLocaleDateString('id-ID')}</td>
                          <td className="py-4 px-6 text-center space-x-2">
                            {!c.isRead && (
                              <button onClick={() => handleMarkAsRead(c.id)} className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-1 rounded-lg">
                                Tandai Dibaca
                              </button>
                            )}
                            <button onClick={() => handleDeleteContact(c.id)} className="bg-rose-100 text-rose-700 border border-rose-200 font-bold px-2 py-1 rounded-lg">
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}