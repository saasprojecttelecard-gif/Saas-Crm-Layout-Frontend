// export const handleTokenFromUrl = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const tokenFromUrl = urlParams.get('token');

//     if (tokenFromUrl) {
//         localStorage.setItem('token', tokenFromUrl);

//         // Clean the URL by removing the token parameter
//         const url = new URL(window.location);
//         url.searchParams.delete('token');
//         window.history.replaceState({}, document.title, url.pathname + url.search);

//         return tokenFromUrl;
//     }

//     return localStorage.getItem('token');
// };

// export const redirectToAuth = (currentUrl = null) => {
//     const redirectUrl = currentUrl || window.location.href;
//     const encodedUrl = encodeURIComponent(redirectUrl);
//     window.location.href = `http://localhost:3001/auth?redirect=${encodedUrl}`;
// };

// export const checkAuthAndRedirect = () => {
//     const token = handleTokenFromUrl();

//     if (!token) {
//         redirectToAuth();
//         return false;
//     }

//     return true;
// };

export const handleTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const tenantIdFromUrl = urlParams.get('tenantId');
    const userIdFromUrl = urlParams.get('userId');
    const nameFromUrl = urlParams.get('name');
    const roleFromUrl = urlParams.get('role');

    // Debug logging
    if (tokenFromUrl || tenantIdFromUrl || userIdFromUrl || nameFromUrl || roleFromUrl) {
        console.log('handleTokenFromUrl - URL params found:', {
            token: tokenFromUrl ? 'present' : 'missing',
            tenantId: tenantIdFromUrl,
            userId: userIdFromUrl,
            name: nameFromUrl,
            role: roleFromUrl
        });
    }

    if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
    }

    if (tenantIdFromUrl) {
        localStorage.setItem('tenantId', tenantIdFromUrl);
    }

    if (userIdFromUrl) {
        localStorage.setItem('userId', userIdFromUrl);
    }

    if (nameFromUrl) {
        localStorage.setItem('name', decodeURIComponent(nameFromUrl));
    }

    if (roleFromUrl) {
        localStorage.setItem('role', decodeURIComponent(roleFromUrl));
    }

    // If we have user data from URL, reconstruct and store the user object
    if (tokenFromUrl && (tenantIdFromUrl || userIdFromUrl || nameFromUrl || roleFromUrl)) {
        const user = {
            id: userIdFromUrl,
            name: nameFromUrl ? decodeURIComponent(nameFromUrl) : localStorage.getItem('name'),
            tenant_id: tenantIdFromUrl,
            role: roleFromUrl ? decodeURIComponent(roleFromUrl) : localStorage.getItem('role')
        };
        localStorage.setItem('user', JSON.stringify(user));
    }

    if (tokenFromUrl || tenantIdFromUrl || userIdFromUrl || nameFromUrl || roleFromUrl) {
        const url = new URL(window.location);
        url.searchParams.delete('token');
        url.searchParams.delete('tenantId');
        url.searchParams.delete('userId');
        url.searchParams.delete('name');
        url.searchParams.delete('role');
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    const result = {
        token: localStorage.getItem('token'),
        tenantId: localStorage.getItem('tenantId'),
        userId: localStorage.getItem('userId'),
        name: localStorage.getItem('name'),
        role: localStorage.getItem('role')
    };

    // Debug logging
    console.log('handleTokenFromUrl - localStorage after processing:', {
        token: result.token ? 'present' : 'missing',
        tenantId: result.tenantId,
        userId: result.userId,
        name: result.name,
        role: result.role,
        user: localStorage.getItem('user') ? 'present' : 'missing'
    });

    return result;
};

export const clearAllAuthData = () => {
    const authKeys = ['token', 'tenantId', 'userId', 'name', 'role', 'user'];
    authKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });

    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
};

export const broadcastLogout = () => {
    // Use BroadcastChannel API for same-origin communication (localhost development)
    if (typeof BroadcastChannel !== 'undefined') {
        try {
            const channel = new BroadcastChannel('auth_channel');
            channel.postMessage({ action: 'LOGOUT' });
            channel.close();
        } catch (error) {
            console.warn('BroadcastChannel not available:', error);
        }
    }

    // Also use localStorage event for cross-tab communication
    localStorage.setItem('logout_event', Date.now().toString());
    localStorage.removeItem('logout_event');
};

export const setupLogoutListener = (onLogout) => {
    // Listen for BroadcastChannel messages
    if (typeof BroadcastChannel !== 'undefined') {
        try {
            const channel = new BroadcastChannel('auth_channel');
            channel.onmessage = (event) => {
                if (event.data && event.data.action === 'LOGOUT') {
                    onLogout();
                }
            };

            // Return cleanup function
            return () => channel.close();
        } catch (error) {
            console.warn('BroadcastChannel not available:', error);
        }
    }

    // Fallback: Listen for localStorage changes
    const handleStorageChange = (event) => {
        if (event.key === 'logout_event') {
            onLogout();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
};

export const redirectToAuth = (currentUrl = null) => {
    const redirectUrl = currentUrl || window.location.href;
    const encodedUrl = encodeURIComponent(redirectUrl);

    // Use environment variable for auth URL with proper fallbacks
    let authUrl;

    if (typeof window !== 'undefined') {
        // Try to get from environment variable first
        authUrl = import.meta?.env?.VITE_LOGIN_URL;

        // Fallback based on environment
        if (!authUrl) {
            authUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:3001'
                : 'https://signin.tclaccord.com';
        }
    } else {
        authUrl = 'https://signin.tclaccord.com';
    }

    window.location.href = `${authUrl}?redirect=${encodedUrl}`;
};

export const checkAuthAndRedirect = (options = {}) => {
    const { requireAuth = true } = options;
    const { token, tenantId, userId, name, role } = handleTokenFromUrl();

    // If auth is not required, just return the token data without redirecting
    if (!requireAuth) {
        return { token, tenantId, userId, name, role };
    }

    if (!token) {
        redirectToAuth();
        return false;
    }

    return { token, tenantId, userId, name, role };
};
