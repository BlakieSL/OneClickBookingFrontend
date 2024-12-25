import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/employees';

export const getEmployeeById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAllEmployees = async () => {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
}

export const getAllEmployeesByServicePointAndTreatment = async (servicePointId, treatmentId) => {
    const response = await axios.get(
        `${BASE_URL}/service-point/${servicePointId}/treatment/${treatmentId}`
    )
    return response.data
}