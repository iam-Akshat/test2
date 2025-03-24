import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL+'/api';

export const fetchImages = async () => {
  try {
    const response = await axios.get(`${API_URL}/images`);
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const uploadImage = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const updateImageDetails = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/images/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating image:', error);
    throw error;
  }
};

export const reorderImages = async (imageOrders) => {
  try {
    const response = await axios.put(`${API_URL}/images/reorder`, { imageOrders });
    return response.data;
  } catch (error) {
    console.error('Error reordering images:', error);
    throw error;
  }
};

export const deleteImage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/images/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};