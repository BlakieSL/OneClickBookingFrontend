import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/reviews';

export const getReviewById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAllReviews = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
}

export const getFilteredReviews = async (data) => {
    const response = await axios.post(`${BASE_URL}/filtered`, data);
    return response.data;
}

export const createReview = async (data) => {
    await axios.post(BASE_URL, data);
}

export const deleteReview = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`)
}

export const updateReview = async (id, data) => {
    await axios.patch(`${BASE_URL}/${id}`)
}