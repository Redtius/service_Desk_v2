import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1'; // adjust if needed

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRole = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/roles/${roleId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/roles`, roleData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/roles/${roleId}`, roleData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteRole = async (roleId) => {
  try {
    await axios.delete(`${API_URL}/roles/${roleId}`, getAuthHeaders());
  } catch (error) {
    throw error.response?.data || error;
  }
};
