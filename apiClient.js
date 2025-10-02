import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL_AUTH || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Clean token of any non-ASCII characters
        const cleanToken = token.trim().replace(/[^\x00-\x7F]/g, "");
        config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor for handling 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth data and redirect to login
            const authKeys = ['token', 'tenantId', 'userId', 'name', 'role', 'user'];
            authKeys.forEach(key => localStorage.removeItem(key));

            const currentUrl = window.location.href;
            const loginUrl = 'https://signin.tclaccord.com';
            const redirectParam = encodeURIComponent(currentUrl);
            window.location.href = `${loginUrl}/?redirect=${redirectParam}`;
        }
        return Promise.reject(error);
    }
);

export default apiClient;