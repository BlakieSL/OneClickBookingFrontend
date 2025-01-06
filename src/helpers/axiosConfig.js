import axios from "axios";
import {getAccessToken, getLocale, logout, refreshAccessTokenUtil} from "./tokenUtils.js";

axios.interceptors.request.use(
    async (config) => {
                    const excludedEndpoints = [
                        '/api/users/login',
                        '/api/users/register',
                        '/api/users/refresh-token'
                    ];

                    console.log("REQUEST TO:", config.url);

                    if (!excludedEndpoints.some(endpoint => config.url.endsWith(endpoint))) {
                        let token = getAccessToken();
                        if (token) {
                            config.headers['Authorization'] = `Bearer ${token}`;
                        }
                    }

                    if(!config.headers['Content-Type']) {
                        config.headers['Content-Type'] = 'application/json';
                    }

                    config.headers['Accept-Language'] = getLocale();

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


axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401)) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const newToken = await refreshAccessTokenUtil();
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
                refreshSubscribers.push((newToken) => {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(axios(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);

