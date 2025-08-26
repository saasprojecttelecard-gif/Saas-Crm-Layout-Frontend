export const handleTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        
        // Clean the URL by removing the token parameter
        const url = new URL(window.location);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.pathname + url.search);
        
        return tokenFromUrl;
    }
    
    return localStorage.getItem('token');
};

export const redirectToAuth = (currentUrl = null) => {
    const redirectUrl = currentUrl || window.location.href;
    const encodedUrl = encodeURIComponent(redirectUrl);
    window.location.href = `http://localhost:3001/auth?redirect=${encodedUrl}`;
};

export const checkAuthAndRedirect = () => {
    const token = handleTokenFromUrl();
    
    if (!token) {
        redirectToAuth();
        return false;
    }
    
    return true;
};
