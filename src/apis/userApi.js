import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/users';

export const getUserById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const registerUser = async (data) => {
    await axios.post(`${BASE_URL}/register`, data);
}

export const deleteUser = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
}

export const updateUser = async (id, data) => {
    await axios.patch(`${BASE_URL}/${id}`, data);
}

export const refreshAccessToken = async (data) => {
    const response = await axios.post(`${BASE_URL}/refresh-token`, data);
    return response.data.accessToken;
}