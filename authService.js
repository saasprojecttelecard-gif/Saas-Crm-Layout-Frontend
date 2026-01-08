import apiClient from './apiClient';

class AuthService {
    constructor() {
        this.TOKEN_KEY = 'token';
        this.USER_KEY = 'user';
    }

    setToken(token) {
        if (token) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    setUser(user) {
        if (user) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }

    getUser() {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    removeUser() {
        localStorage.removeItem(this.USER_KEY);
    }

    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', {
                ...credentials,
                licenseKey: "DEMO-LICENSE-KEY-123"
            });

            const data = response.data;

            if (data.access_token) {
                this.setToken(data.access_token);
                if (data.user) {
                    this.setUser(data.user);
                }
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Network error occurred';
            return { success: false, error: errorMessage };
        }
    }

    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
            this.removeUser();
            localStorage.clear();
            window.location.href = import.meta.env.VITE_LOGIN_URL || 'http://localhost:3001/auth';
        }
    }
}

const authService = new AuthService();

export default authService;
