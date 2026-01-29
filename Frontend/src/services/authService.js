import { authApi } from './api';
import { jwtDecode } from "jwt-decode";

export const authService = {
    login: async (email, password) => {
        try {
            const response = await authApi.post('/login', { email, password });

            // Backend returns: { token, ... }
            if (response.data.token) {
                localStorage.setItem('jwt_token', response.data.token);

                // Decode token to get role reliably
                const decoded = jwtDecode(response.data.token);
                const role = decoded.role || "user";
                const userEmail = decoded.sub || email;

                // Construct user object
                const userObj = {
                    email: userEmail,
                    role: role
                };

                localStorage.setItem('user', JSON.stringify(userObj));

                return { token: response.data.token, user: userObj };
            }
            return response.data;
        } catch (error) {
            console.error("Login API failed", error);
            throw error;
        }
    },

    register: async (email, password, displayName) => {
        try {
            const response = await authApi.post('/register', { email, password, displayName });
            return response.data;
        } catch (error) {
            console.error("Register API failed", error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('jwt_token');
    }
};
