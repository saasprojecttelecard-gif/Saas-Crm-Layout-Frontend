const getEnvironmentUrls = () => {
    const isProduction = import.meta.env.VITE_PRODUCTION === 'true';

    const services = {
        auth: {
            dev: 'http://localhost:3001',
            prod: 'https://signin.tclaccord.com'
        },
        dashboard: {
            dev: 'http://localhost:3002',
            prod: 'https://dashboard.tclaccord.com'
        },
        subscription: {
            dev: 'http://localhost:3000',
            prod: 'https://subscription.tclaccord.com'
        },
        inventory: {
            dev: 'http://localhost:3003',
            prod: 'https://inventory.tclaccord.com'
        },
        lead: {
            dev: 'http://localhost:3004',
            prod: 'https://sale.tclaccord.com'
        },
        user: {
            dev: 'http://localhost:3005',
            prod: 'https://users.tclaccord.com'
        },
        ticket: {
            dev: 'http://localhost:3006',
            prod: 'https://support.tclaccord.com'
        },
        marketing: {
            dev: 'http://localhost:3007',
            prod: 'https://marketing.tclaccord.com'
        },
        tenant: {
            dev: 'http://localhost:3008',
            prod: 'https://tenant.tclaccord.com'
        },
        license: {
            dev: 'http://localhost:3009',
            prod: 'https://license.tclaccord.com'
        }
    };

    const urls = {};
    Object.keys(services).forEach(service => {
        urls[service] = isProduction ? services[service].prod : services[service].dev;
    });

    return urls;
};

export const getServiceUrl = (serviceName, path = '') => {
    const urls = getEnvironmentUrls();
    const baseUrl = urls[serviceName];

    if (!baseUrl) {
        console.warn(`Service '${serviceName}' not found in navigation configuration`);
        return '#';
    }

    return baseUrl + path;
};

export const navigateToService = (serviceName, path = '') => {
    const url = getServiceUrl(serviceName, path);
    window.location.href = url;
};

export const getApiUrl = (serviceName = '') => {
    const isProduction = import.meta.env.VITE_PRODUCTION === 'true';

    if (isProduction) {
        return import.meta.env.VITE_API_BASE_URL_PROD || `https://api.tclaccord.com/${serviceName}`;
    } else {
        return import.meta.env.VITE_API_BASE_URL_DEV || `http://localhost:8000/api/${serviceName}`;
    }
};

export const getAuthUrl = () => {
    const isProduction = import.meta.env.VITE_PRODUCTION === 'true';

    if (isProduction) {
        return import.meta.env.VITE_LOGIN_URL_PROD || 'https://signin.tclaccord.com/auth';
    } else {
        return import.meta.env.VITE_LOGIN_URL_DEV || 'http://localhost:3001/auth';
    }
};

export const getLoginRedirectUrl = () => {
    const isProduction = import.meta.env.VITE_PRODUCTION === 'true';

    if (isProduction) {
        return import.meta.env.VITE_LOGIN_REDIRECT_PROD || 'https://dashboard.tclaccord.com/dashboard';
    } else {
        return import.meta.env.VITE_LOGIN_REDIRECT_DEV || 'http://localhost:3002/dashboard';
    }
};

export const isProductionMode = () => {
    return import.meta.env.VITE_PRODUCTION === 'true';
};

export default {
    getServiceUrl,
    navigateToService,
    getApiUrl,
    getAuthUrl,
    getLoginRedirectUrl,
    isProductionMode
};
