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
            const response = await fetch('http://192.168.88.71:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...credentials,
                    licenseKey: "DEMO-LICENSE-KEY-123"
                }),
            });

            const data = await response.json();

            if (response.ok && data.access_token) {
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
            return { success: false, error: 'Network error occurred' };
        }
    }

    logout() {
        this.removeToken();
        this.removeUser();
        window.location.href = 'http://localhost:3001/auth';
    }
}

const authService = new AuthService();

export default authService;
