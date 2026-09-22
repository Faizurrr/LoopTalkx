const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Helper ───────────────────────────────────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  login: (body) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE_URL}/auth/me`, { headers: getAuthHeaders() }).then(handleResponse),
};

// ─── Users API ────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/users`, { headers: getAuthHeaders() }).then(handleResponse),

  getById: (id) =>
    fetch(`${API_BASE_URL}/users/${id}`, { headers: getAuthHeaders() }).then(handleResponse),

  updateProfile: (body) =>
    fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
};
