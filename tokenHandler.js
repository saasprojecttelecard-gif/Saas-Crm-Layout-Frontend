export const handleTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const tenantIdFromUrl = urlParams.get('tenantId');
    const userIdFromUrl = urlParams.get('userId');
    const nameFromUrl = urlParams.get('name');
    const roleFromUrl = urlParams.get('role');

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

    if (tokenFromUrl || tenantIdFromUrl || userIdFromUrl || nameFromUrl) {
        const url = new URL(window.location);
        url.searchParams.delete('token');
        url.searchParams.delete('tenantId');
        url.searchParams.delete('userId');
        url.searchParams.delete('name');
        url.searchParams.delete('role');
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    return {
        token: localStorage.getItem('token'),
        tenantId: localStorage.getItem('tenantId'),
        userId: localStorage.getItem('userId'),
        name: localStorage.getItem('name'),
        role: localStorage.getItem('role')
    };
};

export const clearAllAuthData = () => {
    const authKeys = ['token', 'tenantId', 'userId', 'name', 'user', 'role'];
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
    window.location.href = `https://signin.tclaccord.com/?redirect=${encodedUrl}`;
};

export const checkAuthAndRedirect = () => {
    const { token, tenantId } = handleTokenFromUrl();

    if (!token) {
        redirectToAuth();
        return false;
    }

    return { token, tenantId };
};