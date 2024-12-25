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
                        if(!config.headers['Content-Type']) {
                            config.headers['Content-Type'] = 'application/json';
                        }

                        let token = getAccessToken();
                        if (token) {
                            config.headers['Authorization'] = `Bearer ${token}`;
                        }
                    }

                    return config;
            },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const newToken = await refreshAccessToken();
                    onTokenRefreshed(newToken);
                    isRefreshing = false;
                    return axios(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                    logout();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve) => {
                addRefreshSubscriber((newToken) => {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(axios(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);

