import axios from "axios";
import {getAccessToken, logout, refreshAccessTokenUtil} from "./tokenUtils.js";

axios.interceptors.request.use(
    async (config) => {
                    const excludedEndpoints = [
                        '/api/users/login',
                        '/api/users/register',
                        '/api/users/refresh-token'
                    ];

                    if (!excludedEndpoints.some(endpoint => config.url.endsWith(endpoint))) {
                        if(!config.headers['Content-Type']) {
                            config.headers['Content-Type'] = 'application/json';
                        }

                        let token = getAccessToken();
                        if (token) {
                            config.headers['Authorization'] = `Bearer ${token}`;
                        }
                    }
            },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if(error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshAccessTokenUtil();
                const newToken = getAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        console.log(error.response.data)
        return Promise.reject(error);
    }
);