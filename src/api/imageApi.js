import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/images';

export const getImageById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAllImagesForParent = async (parentType, parentId) => {
    const response = await axios.get(`${BASE_URL}/parent/${parentType}/${parentId}`);
    return response.data;
}

export const createImage = async (data) => {
    await axios.post(BASE_URL, data, {
       headers: {
           'Content-Type': 'multipart/form-data'
       }
    });
}

export const deleteImage = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`)
}