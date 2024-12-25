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
                        console.log("not excluded")
                        if(!config.headers['Content-Type']) {
                            config.headers['Content-Type'] = 'application/json';
                        }

                        let token = getAccessToken();
                        if (token) {
                            config.headers['Authorization'] = `Bearer ${token}`;
                        }
                    } else {
                        console.log("excluded")
                    }

                    return config;
            },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error.response) {
            console.error('Network error or CORS issue:', error.message);
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (error.response.status === 401 || error.response.status === 403) {
            if (!originalRequest._retry) {
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
        }
        return Promise.reject(error);
    }
);