import {refreshAccessToken} from "../apis/userApi.js";

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export const setAccessToken = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
};

export const setRefreshToken = (refreshToken) => {
    localStorage.setItem('refreshToken', refreshToken);
};

export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const isUserLoggedIn = () => {
    return !!getAccessToken();
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

export const refreshAccessTokenUtil = async () => {
    const refreshToken = getRefreshToken();

    const accessToken = refreshAccessToken(refreshToken);

    setAccessToken(accessToken);
}