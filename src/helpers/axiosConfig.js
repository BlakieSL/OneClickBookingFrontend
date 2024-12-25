import axios from "axios";
import {getAccessToken, logout, refreshAccessTokenUtil} from "./tokenUtils.js";
import {refreshAccessToken} from "../apis/userApi.js";

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
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
