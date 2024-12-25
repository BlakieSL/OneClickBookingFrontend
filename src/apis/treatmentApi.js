import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/treatments';

export const getTreatmentById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAllTreatments = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
}

export const getAllTreatmentsByServicePoint = async (servicePointId) => {
    const response = await axios.get(`${BASE_URL}/service-point/${servicePointId}`);
    return response.data;
}