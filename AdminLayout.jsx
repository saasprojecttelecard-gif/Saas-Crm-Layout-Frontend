import { Layout, Menu, Button, theme, Drawer, Typography, Dropdown, ConfigProvider } from 'antd';
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu as MenuIcon,
    AlignRight,
    AlignLeft,
    UserPlus,
    Ticket,
    Briefcase,
    Funnel,
    UserCog,
    ShieldCheck,
    UsersRound,
    Users,
    Package,
    Layers,
    Boxes,
    Lightbulb,
    BadgePercent,
    Mail,
    Megaphone,
    Building
} from 'lucide-react';
import './index.css';
import apiClient from './apiClient';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

const ThemeProvider = ({ children }) => {
    const themeConfig = {
        algorithm: theme.defaultAlgorithm,
        token: {
            colorPrimary: '#E67E22',
            colorSuccess: '#27AE60',
            colorWarning: '#F39C12',
            colorError: '#E74C3C',
            colorInfo: '#3498DB',
            colorBgContainer: '#FFFFFF',
            colorBgElevated: '#FFFFFF',
            colorBgLayout: '#FAF3E0',
            colorBgBase: '#FFFFFF',
            colorTextBase: '#2B2D42',
            borderRadius: 12,
            borderRadiusLG: 16,
        },
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode: false, toggleTheme: () => { }, themeConfig }}>
            <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
        </ThemeContext.Provider>
    );
};

const NAVIGATION_CONFIG = {
    '/dashboard': { url: 'https://dashboard.tclaccord.com/dashboard', port: 3002, basename: 'dashboard' },
    '/users': { url: 'https://members.tclaccord.com/users', port: 3005, basename: 'users' },
    '/users/role': { url: 'https://members.tclaccord.com/users/role', port: 3005, basename: 'users' },
    '/users/permission': { url: 'https://members.tclaccord.com/users/permission', port: 3005, basename: 'users' },
    '/sales/leads': { url: 'https://transaction.tclaccord.com/sales/leads', port: 3004, basename: 'sales' },
    '/sales/contacts': { url: 'https://transaction.tclaccord.com/sales/contacts', port: 3004, basename: 'sales' },
    '/sales/opportunities': { url: 'https://transaction.tclaccord.com/sales/opportunities', port: 3004, basename: 'sales' },
    '/inventory/products': { url: 'https://asset.tclaccord.com/inventory/products', port: 3003, basename: 'inventory' },
    '/inventory/categories': { url: 'https://asset.tclaccord.com/inventory/categories', port: 3003, basename: 'inventory' },
    '/tickets': { url: 'https://token.tclaccord.com/tickets', port: 3006, basename: 'tickets' },
    '/marketing/email-templates': { url: 'https://strategysphere.tclaccord.com/marketing/email-templates', port: 3007, basename: 'marketing' },
    '/marketing/campaigns': { url: 'https://strategysphere.tclaccord.com/marketing/campaigns', port: 3007, basename: 'marketing' },
    '/tenants': { url: 'https://occupant.tclaccord.com/tenant', port: 3008, basename: 'tenant' },
};

// This maps a specific child path to its parent menu key for automatic expansion.
const PARENT_KEYS = {
    '/users/role': '/users',
    '/users/permission': '/users',
    '/sales/leads': '/sales',
    '/sales/contacts': '/sales',
    '/sales/opportunities': '/sales',
    '/inventory/products': '/inventory',
    '/inventory/categories': '/inventory',
    '/marketing/email-templates': '/marketing',
    '/marketing/campaigns': '/marketing',
};

const AdminLayoutContent = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const onOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    const handleMenuClick = ({ key }) => {
        const config = NAVIGATION_CONFIG[key];
        const isDev = import.meta.env.DEV || false;

        if (config) {
            const currentHost = window.location.hostname;
            const configHost = new URL(config.url).hostname;

            if (currentHost === configHost) {
                // Same host: Use React Router for fast, client-side navigation.
                navigate(key);
            } else {
                // Different host (Micro-frontend): Perform a full page redirect.
                let url = isDev ? `http://localhost:${config.port}${key}` : config.url;
                const token = localStorage.getItem('token');
                const tenantId = localStorage.getItem('tenantId');
                const userId = localStorage.getItem('userId');
                const name = localStorage.getItem('name');

                if (token) {
                    // Append authentication details for the redirect
                    url = `${url}?token=${token}&tenantId=${tenantId}&userId=${userId}&name=${encodeURIComponent(name)}`;
                }
                window.location.href = url;
            }
        } else {
            // Fallback for any keys that aren't in the config (e.g., custom local routes).
            navigate(key);
        }

        if (isMobile) setDrawerVisible(false);
    };

    const getSelectedKeys = () => {
        const currentPath = location.pathname;
        const currentHost = window.location.hostname;

        // 1. Check for explicit path matches first (child pages)
        if (currentPath === '/users/role') return ['/users/role'];
        if (currentPath === '/users/permission') return ['/users/permission'];
        if (currentPath === '/sales/leads') return ['/sales/leads'];
        if (currentPath === '/sales/contacts') return ['/sales/contacts'];
        if (currentPath === '/sales/opportunities') return ['/sales/opportunities'];
        if (currentPath === '/inventory/products') return ['/inventory/products'];
        if (currentPath === '/inventory/categories') return ['/inventory/categories'];
        if (currentPath === '/marketing/email-templates') return ['/marketing/email-templates'];
        if (currentPath === '/marketing/campaigns') return ['/marketing/campaigns'];

        // 2. Handle main menu items, including root paths on micro-frontends
        if (currentHost.includes('dashboard') || currentPath === '/dashboard') return ['/dashboard'];
        if (currentHost.includes('token') || currentPath === '/tickets') return ['/tickets'];
        if (currentHost.includes('occupant') || currentPath === '/tenants') return ['/tenants'];

        // Special case: If on the users host, and path starts with /users (e.g., /users or /users/), select /users
        if (currentHost.includes('members') && currentPath.startsWith('/users')) return ['/users'];
        if (currentPath === '/users') return ['/users']; // Ensures local SPA routing also selects it

        // 3. Default fallback
        return [currentPath];
    };

    const getOpenKeys = () => {
        const selectedKey = getSelectedKeys()[0];
        const parentKey = PARENT_KEYS[selectedKey];

        // Check if the selected key is a child of a collapsible menu
        if (parentKey) {
            return [parentKey];
        }

        // If the selected key is a parent itself (like /users), ensure it is open
        if (['/users', '/sales', '/inventory', '/marketing'].includes(selectedKey)) {
            return [selectedKey];
        }

        return [];
    };

    useEffect(() => {
        // Automatically set the open keys based on the current location
        setOpenKeys(getOpenKeys());
    }, [location.pathname, location.hostname]); // Include hostname for micro-frontend awareness

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            localStorage.clear();
            // Use the absolute URL for signin, which should always be a full redirect
            window.location.href = import.meta.env.VITE_LOGIN_URL || 'https://signin.tclaccord.com';
        }
    };

    const userMenuItems = [
        { key: 'logout', label: 'Logout', icon: <LogOut size={16} />, onClick: handleLogout },
    ];

    const menuItems = [
        { key: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        {
            key: '/users', // Parent key
            icon: <UsersRound size={16} />,
            label: 'Users Management',
            children: [
                { key: '/', label: 'Users', icon: <Users size={16} /> }, // Child item that navigates to the main users page
                { key: '/users/role', label: 'Roles', icon: <UserCog size={16} /> },
                { key: '/users/permission', label: 'Permissions', icon: <ShieldCheck size={16} /> },
            ],
        },
        {
            key: '/sales', // Parent key
            icon: <Briefcase size={16} />,
            label: 'Sales',
            children: [
                { key: '/sales/leads', label: 'Leads', icon: <Funnel size={16} /> },
                { key: '/sales/contacts', label: 'Contacts', icon: <UserPlus size={16} /> },
                { key: '/sales/opportunities', label: 'Opportunities', icon: <Lightbulb size={16} /> },
            ],
        },
        { key: '/tickets', icon: <Ticket size={16} />, label: 'Ticket' },
        { key: '/tenants', icon: <Building size={16} />, label: 'Tenant' },
        {
            key: '/inventory', // Parent key
            icon: <Boxes size={16} />,
            label: 'Inventory Management',
            children: [
                { key: '/inventory/products', label: 'Products', icon: <Package size={16} /> },
                { key: '/inventory/categories', label: 'Categories', icon: <Layers size={16} /> },
            ],
        },
        {
            key: '/marketing', // Parent key
            icon: <BadgePercent size={16} />,
            label: 'Marketing',
            children: [
                { key: '/marketing/email-templates', label: 'Email Templates', icon: <Mail size={16} /> },
                { key: '/marketing/campaigns', label: 'Campaigns', icon: <Megaphone size={16} /> },
            ],
        },
    ];

    return (
        <Layout className="admin-layout-main">
            <Header className="admin-header admin-header-light">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Button
                            type="text"
                            icon={isMobile ? <MenuIcon size={18} /> : (collapsed ? <AlignLeft size={18} /> : <AlignRight size={18} />)}
                            onClick={isMobile ? () => setDrawerVisible(true) : () => setCollapsed(!collapsed)}
                            className="admin-button-header"
                        />
                        <div className="admin-logo-icon">A</div>
                        <Text strong className="text-primary" style={{ fontSize: 20 }}>Accord CRM</Text>
                    </div>

                    <div style={{ marginLeft: 'auto' }}>
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                            <Button type="text" className="admin-button-user">
                                <div className="admin-user-avatar">{(localStorage.getItem('name') || 'D')[0].toUpperCase()}</div>
                                <span style={{ fontWeight: 500 }}>{localStorage.getItem('name') || 'Demo'}</span>
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </Header>

            <Layout className="admin-layout-content site-layout">
                {!isMobile && (
                    <Sider
                        theme="light"
                        collapsed={collapsed}
                        width={250}
                        collapsedWidth={80}
                        className="admin-sider"
                    >
                        <Menu
                            theme="light"
                            selectedKeys={getSelectedKeys()}
                            openKeys={openKeys}
                            onOpenChange={onOpenChange}
                            mode="inline"
                            items={menuItems}
                            onClick={handleMenuClick}
                        />
                    </Sider>
                )}

                <Layout>
                    <Content className="admin-content-main">
                        <div className="admin-content-card">{children}</div>
                    </Content>
                    <Footer className="admin-footer-main">
                        <Text>© 2024 Accord CRM. All rights reserved.</Text>
                    </Footer>
                </Layout>
            </Layout>

            {isMobile && (
                <Drawer
                    title={
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div className="admin-drawer-logo">A</div>
                            <Text strong>Accord CRM</Text>
                        </div>
                    }
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    width={280}
                >
                    <Menu
                        theme="light"
                        selectedKeys={getSelectedKeys()}
                        openKeys={openKeys}
                        onOpenChange={onOpenChange}
                        mode="inline"
                        items={menuItems}
                        onClick={handleMenuClick}
                    />
                </Drawer>
            )}
        </Layout>
    );
};

const AdminLayout = ({ children }) => (
    <ThemeProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
);

export default AdminLayout;