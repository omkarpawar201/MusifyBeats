import axios from 'axios';

// Spring Boot Auth Service
export const authApi = axios.create({
    baseURL: 'http://localhost:8081/api/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ASP.NET Core Music Service
export const musicApi = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ASP.NET Core Playlist Service
export const playlistApi = axios.create({
    baseURL: 'http://localhost:5001/api/playlists',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to add JWT token
const addToken = (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
};

// Add interceptors
musicApi.interceptors.request.use(addToken, (error) => Promise.reject(error));
playlistApi.interceptors.request.use(addToken, (error) => Promise.reject(error));
authApi.interceptors.request.use(addToken, (error) => Promise.reject(error));

