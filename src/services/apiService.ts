import api from '../lib/api';

// --- AUTH ---
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// --- UPLOAD FILE ---
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// --- JURUSAN ---
export const getMajors = async () => {
  const response = await api.get('/majors');
  return response.data;
};

export const createMajor = async (data: any) => {
  const response = await api.post('/majors', data);
  return response.data;
};

export const updateMajor = async (id: number | string, data: any) => {
  const response = await api.put(`/majors/${id}`, data);
  return response.data;
};

export const deleteMajor = async (id: number | string) => {
  const response = await api.delete(`/majors/${id}`);
  return response.data;
};

// --- BERITA / POSTS ---
export const getPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const getPostBySlug = async (slug: string) => {
  const response = await api.get(`/posts/slug/${slug}`);
  return response.data;
};

export const createPost = async (data: any) => {
  const response = await api.post('/posts', data);
  return response.data;
};

export const updatePost = async (id: number | string, data: any) => {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id: number | string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

// --- PPDB PUBLIC ---
export const submitPpdb = async (formData: any) => {
  const response = await api.post('/ppdb', formData);
  return response.data;
};

// --- PPDB ADMIN ---
export const getAllPpdb = async () => {
  const response = await api.get('/ppdb');
  return response.data;
};

export const updatePpdbStatus = async (id: number | string, status: string) => {
  const response = await api.put(`/ppdb/${id}/status`, { status });
  return response.data;
};

export const deletePpdb = async (id: number | string) => {
  const response = await api.delete(`/ppdb/${id}`);
  return response.data;
};

// --- USER MANAGEMENT (SUPER ADMIN) ---
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (data: { name: string; email: string; password: string; role: string }) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUserRole = async (id: number | string, role: string) => {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
};

export const resetUserPassword = async (id: number | string, newPassword: string) => {
  const response = await api.put(`/users/${id}/reset-password`, { newPassword });
  return response.data;
};

export const deleteUser = async (id: number | string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// --- GALERI SEKOLAH ---
export const getGalleries = async (category?: string) => {
  const response = await api.get(category ? `/galleries?category=${category}` : '/galleries');
  return response.data;
};

export const createGallery = async (data: any) => {
  const response = await api.post('/galleries', data);
  return response.data;
};

export const deleteGallery = async (id: number | string) => {
  const response = await api.delete(`/galleries/${id}`);
  return response.data;
};

// --- KONTAK / PESAN MASUK ---
export const sendContactMessage = async (data: { name: string; email: string; phone?: string; subject: string; message: string }) => {
  const response = await api.post('/contacts', data);
  return response.data;
};

export const getContacts = async () => {
  const response = await api.get('/contacts');
  return response.data;
};

export const markContactAsRead = async (id: number | string) => {
  const response = await api.put(`/contacts/${id}/read`);
  return response.data;
};

export const deleteContact = async (id: number | string) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};