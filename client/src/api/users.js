import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
  } catch (error) {
    throw error.response?.data || error;
  }
};
