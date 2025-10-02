export const handleTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const tenantIdFromUrl = urlParams.get('tenantId');
    const userIdFromUrl = urlParams.get('userId');
    const nameFromUrl = urlParams.get('name');
    const roleFromUrl = urlParams.get('role'); // Added 'role' parameter

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

    if (roleFromUrl) { // Handle the new 'role' parameter from login page
        localStorage.setItem('role', roleFromUrl);
        shouldCleanUrl = true;
    }

    // Clean the URL if any parameter was found
    if (shouldCleanUrl) {
        const url = new URL(window.location);
        url.searchParams.delete('token');
        url.searchParams.delete('tenantId');
        url.searchParams.delete('userId');
        url.searchParams.delete('name');
        url.searchParams.delete('role'); // Ensure 'role' is also cleaned
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    // Always return the data from localStorage (which was just set or was already there)
    return {
        token: localStorage.getItem('token'),
        tenantId: localStorage.getItem('tenantId'),
        userId: localStorage.getItem('userId'),
        name: localStorage.getItem('name'),
        role: localStorage.getItem('role'), // Return the role
    };
};