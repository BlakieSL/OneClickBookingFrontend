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

export const getFilteredEmployees = async (data) => {
    const response = await axios.post(`${BASE_URL}/filtered`, data);
    return response.data;
}