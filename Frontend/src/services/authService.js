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
                // Decode token to get role reliably (fallback)
                const decoded = jwtDecode(response.data.token);
                const role = response.data.role || decoded.role || "user";
                const userEmail = response.data.email || decoded.sub || email;

                // Construct user object with full details from backend response
                const userObj = {
                    id: response.data.id,
                    displayName: response.data.displayName || userEmail.split('@')[0], // Fallback if missing
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
            if (error.response && error.response.data) {
                console.error("Error details:", error.response.data);
            }
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
