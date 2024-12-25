import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/shcedule';

export const getSchedule = async (data) => {
    await axios.post(BASE_URL, data);
}