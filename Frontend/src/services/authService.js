import { authApi } from './api';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await authApi.post('/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('jwt_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.warn("Login API failed, using fallback mock authentication", error);
            // Fallback mock logic
            const mockToken = "mock-jwt-token-12345";
            const mockUser = {
                id: "user-1",
                email: email,
                displayName: "Demo User",
                role: "USER"
            };

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            localStorage.setItem('jwt_token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            return { token: mockToken, user: mockUser };
        }
    },

    register: async (email, password, displayName) => {
        try {
            const response = await authApi.post('/register', { email, password, displayName });
            return response.data;
        } catch (error) {
            console.warn("Register API failed, using fallback mock authentication", error);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Return success message
            return { message: "User registered successfully (Mock)" };
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
