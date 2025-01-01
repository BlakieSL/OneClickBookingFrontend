import {refreshAccessToken} from "../apis/userApi.js";
import {jwtDecode} from "jwt-decode";

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export const getUser = () => {
    return localStorage.getItem('user');
}

export const setAccessToken = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
};

export const setRefreshToken = (refreshToken) => {
    localStorage.setItem('refreshToken', refreshToken);
};

export const setUser = (userId) => {
    localStorage.setItem('user', JSON.stringify(userId));
};


export const isUserLoggedIn = () => {
    return !!getAccessToken();
};

export const isUserAdmin = () => {
    const accessToken = getAccessToken();

    try {
        const decodedToken = jwtDecode(accessToken);
        const authorities = decodedToken.authorities || [];
        return authorities.includes("ROLE_ADMIN");
    } catch (error) {
        console.error(error);
    }
}

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

export const refreshAccessTokenUtil = async () => {
    const refreshToken = getRefreshToken();

    const accessToken = await refreshAccessToken(refreshToken);

    setAccessToken(accessToken);

    return accessToken;
}