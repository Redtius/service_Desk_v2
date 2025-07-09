import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/auth'; // Adjust if your API is on a different port/path

export const login = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  try {
    const response = await axios.post(`${API_URL}/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // In a real app, you'd decode the token or make an API call to get user details
    // For now, we'll assume user info is stored with the token or fetched separately
    return JSON.parse(localStorage.getItem('user'));
  }
  return null;
};
