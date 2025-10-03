export const handleTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const tenantIdFromUrl = urlParams.get('tenantId');
    const userIdFromUrl = urlParams.get('userId');
    const nameFromUrl = urlParams.get('name');
    const roleFromUrl = urlParams.get('role');
    const permissionsFromUrl = urlParams.get('permissions');

    let shouldCleanUrl = false;

    // Set all found parameters to localStorage
    if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        shouldCleanUrl = true;
    }

    if (tenantIdFromUrl) {
        localStorage.setItem('tenantId', tenantIdFromUrl);
        shouldCleanUrl = true;
    }

    if (userIdFromUrl) {
        localStorage.setItem('userId', userIdFromUrl);
        shouldCleanUrl = true;
    }

    if (nameFromUrl) {
        localStorage.setItem('name', nameFromUrl);
        shouldCleanUrl = true;
    }

    if (roleFromUrl) {
        localStorage.setItem('role', roleFromUrl);
        shouldCleanUrl = true;
    }

    if (permissionsFromUrl) {
        localStorage.setItem('permissions', permissionsFromUrl);
        shouldCleanUrl = true;
    }

    // Clean the URL if any parameter was found
    if (shouldCleanUrl) {
        const url = new URL(window.location);
        url.searchParams.delete('token');
        url.searchParams.delete('tenantId');
        url.searchParams.delete('userId');
        url.searchParams.delete('name');
        url.searchParams.delete('role');
        url.searchParams.delete('permissions');
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    // Always return the data from localStorage (which was just set or was already there)
    return {
        token: localStorage.getItem('token'),
        tenantId: localStorage.getItem('tenantId'),
        userId: localStorage.getItem('userId'),
        name: localStorage.getItem('name'),
        role: localStorage.getItem('role'),
        permissions: localStorage.getItem('permissions')
    };
};

// Check if user is authenticated by validating token
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token && token.trim() !== '';
};

// Redirect to authentication page
export const redirectToAuth = (currentUrl = window.location.href) => {
    const loginUrl = 'https://signin.tclaccord.com';
    const redirectParam = encodeURIComponent(currentUrl);
    window.location.href = `${loginUrl}/?redirect=${redirectParam}`;
};

// Check authentication and redirect if necessary
export const checkAuthAndRedirect = () => {
    // First, handle any tokens in the URL
    handleTokenFromUrl();

    // Then check if we're authenticated
    if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to login...');
        redirectToAuth();
        return false;
    }

    return true;
};

// Clear all authentication data
export const clearAllAuthData = () => {
    const authKeys = ['token', 'tenantId', 'userId', 'name', 'role', 'user', 'permissions'];
    authKeys.forEach(key => localStorage.removeItem(key));
};

// Broadcast logout event to other tabs/windows
export const broadcastLogout = () => {
    // Use localStorage event to communicate across tabs
    localStorage.setItem('logout-event', Date.now().toString());
    localStorage.removeItem('logout-event');

    // Also use BroadcastChannel if available
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('auth-channel');
        channel.postMessage({ type: 'LOGOUT' });
        channel.close();
    }
};

// Setup logout listener for cross-tab logout
export const setupLogoutListener = (onLogout) => {
    // Listen for localStorage changes (cross-tab communication)
    const handleStorageChange = (e) => {
        if (e.key === 'logout-event') {
            onLogout();
        }
    };

    // Listen for BroadcastChannel messages
    let channel;
    const handleBroadcastMessage = (event) => {
        if (event.data && event.data.type === 'LOGOUT') {
            onLogout();
        }
    };

    window.addEventListener('storage', handleStorageChange);

    if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('auth-channel');
        channel.addEventListener('message', handleBroadcastMessage);
    }

    // Return cleanup function
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        if (channel) {
            channel.removeEventListener('message', handleBroadcastMessage);
            channel.close();
        }
    };
};