import apiClient from './apiClient';
import { clearAllAuthData, broadcastLogout } from './tokenHandler';

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

    isAuthenticated() {
        const token = this.getToken();
        return token && token.trim() !== '';
    }

    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', {
                ...credentials,
                licenseKey: credentials.licenseKey || "DEMO-LICENSE-KEY-123"
            });

            const data = response.data;

            if (data.access_token) {
                this.setToken(data.access_token);

                // Store additional user data
                if (data.user) {
                    this.setUser(data.user);
                    localStorage.setItem('tenantId', data.user.tenant_id);
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('name', data.user.name);
                    localStorage.setItem('role', data.user.role);
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
            // Call logout API
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Broadcast logout to other tabs/micro-frontends
            broadcastLogout();

            // Clear all authentication data
            clearAllAuthData();

            // Redirect to login
            window.location.href = 'https://signin.tclaccord.com';
        }
    }
}

const authService = new AuthService();

export default authService;
