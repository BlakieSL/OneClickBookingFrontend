import axios from "axios";

const BASE_URL = 'http://localhost:8000/api/schedule';

export const getSchedule = async (data) => {
    const result = await axios.post(BASE_URL, data);
    return result.data;
}