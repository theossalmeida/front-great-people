import axios from 'axios';

const baseUrl = 'http://localhost:8080/';

export const fetchPesquisas = async () => {
    try {
        const response = await axios.get(baseUrl + 'pesquisas');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadFile = async (formData) => {
    try {
        const response = await axios.post(baseUrl + 'upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const saveNota = async (formData) => {
    try {
        const response = await axios.post(baseUrl + 'pesquisas', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteNota = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}pesquisas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
