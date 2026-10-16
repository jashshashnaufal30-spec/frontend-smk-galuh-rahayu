'use client';

import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUserRole, resetUserPassword, deleteUser } from '../../../services/apiService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form Tambah User
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin_berita' });

  // Reset Password Modal
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      if (res.success) {
        setUsers(res.data);
      } else {
        setError(res.message || 'Gagal mengambil data user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUser(formData);
      if (res.success) {
        alert('User admin berhasil ditambahkan');
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', role: 'admin_berita' });
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan user');
    }
  };

  const handleRoleChange = async (id: number, role: string) => {
    try {
      const res = await updateUserRole(id, role);
      if (res.success) {
        alert('Role user berhasil diperbarui');
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memperbarui role');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser) return;
    try {
      const res = await resetUserPassword(resetModalUser.id, newPassword);
      if (res.success) {
        alert('Password berhasil direset');
        setResetModalUser(null);
        setNewPassword('');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mereset password');
    }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Yakin ingin menghapus user ${name}?`)) return;
    try {
      const res = await deleteUser(id);
      if (res.success) {
        alert('User berhasil dihapus');
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus user');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen User Admin</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition"
        >
          + Tambah Admin
        </button>
      </div>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* Tabel Users */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-4 border-b">Nama</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Peran (Role)</th>
              <th className="p-4 border-b">Dibuat Pada</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">Memuat data user...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">Belum ada user terdaftar.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin_berita">Admin Berita</option>
                      <option value="admin_ppdb">Admin PPDB</option>
                    </select>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => setResetModalUser(u)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Reset Pass
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Admin */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Tambah User Admin Baru</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Peran (Role)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin_berita">Admin Berita</option>
                  <option value="admin_ppdb">Admin PPDB</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reset Password */}
      {resetModalUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-2">Reset Password</h2>
            <p className="text-sm text-gray-600 mb-4">
              Reset password untuk user <span className="font-semibold">{resetModalUser.name}</span>
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}