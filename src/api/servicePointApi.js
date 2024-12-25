import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/service-points';

export const getServicePoint = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAllServicePoints = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
}