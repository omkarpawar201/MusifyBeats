import axios from 'axios';

// Spring Boot Auth Service
export const authApi = axios.create({
    baseURL: 'http://localhost:8080/api/auth',
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

// Add a request interceptor to include the JWT token in musicApi requests
musicApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
