import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/bookings';

export const getBookingById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAllBookings = async () => {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
}

export const getFilteredBookings = async (data) => {
    const response = await axios.post(`${BASE_URL}/filtered`, data);
    return response.data;
}

export const createBooking = async (data) => {
    await axios.post(`${BASE_URL}`, data);
}

export const deleteBooking = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`)
}

export const updateBooking = async (id, data) => {
    await axios.patch(`${BASE_URL}/${id}`, data)
}