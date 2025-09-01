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
        localStorage.setItem('name', nameFromUrl);
    }

    if (tokenFromUrl || tenantIdFromUrl) {
        const url = new URL(window.location);
        url.searchParams.delete('token');
        url.searchParams.delete('tenantId');
        url.searchParams.delete('userId');
        url.searchParams.delete('name');
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    return {
        token: localStorage.getItem('token'),
        tenantId: localStorage.getItem('tenantId')
    };
};

export const redirectToAuth = (currentUrl = null) => {
    const redirectUrl = currentUrl || window.location.href;
    const encodedUrl = encodeURIComponent(redirectUrl);
    window.location.href = `http://localhost:3001/auth?redirect=${encodedUrl}`;
};

export const checkAuthAndRedirect = () => {
    const { token, tenantId } = handleTokenFromUrl();

    if (!token) {
        redirectToAuth();
        return false;
    }

    return { token, tenantId };
};
