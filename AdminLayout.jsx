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

/* ---------------- THEME CONTEXT ---------------- */
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

/* ---------------- NAVIGATION CONFIG ---------------- */
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

/* ---------------- ADMIN CONTENT ---------------- */
const AdminLayoutContent = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const rootSubmenuKeys = ['/users', '/sales', '/inventory', '/marketing'];

    /* ---------- Handle submenu open/close ---------- */
    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => !openKeys.includes(key));
        if (rootSubmenuKeys.includes(latestOpenKey)) {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        } else {
            setOpenKeys(keys);
        }
    };

    /* ---------- Handle menu click ---------- */
    const handleMenuClick = ({ key }) => {
        // Prevent parent-only keys from navigating (avoid /users/users/role issue)
        if (rootSubmenuKeys.includes(key)) {
            setOpenKeys([key]);
            return;
        }

        const config = NAVIGATION_CONFIG[key];
        const isDev = import.meta.env.DEV || false;

        if (config) {
            const currentHost = window.location.hostname;
            const configHost = new URL(config.url).hostname;

            if (currentHost === configHost) {
                navigate(key); // same app
            } else {
                let url = isDev ? `http://localhost:${config.port}${key}` : config.url;
                const token = localStorage.getItem('token');
                const tenantId = localStorage.getItem('tenantId');
                const userId = localStorage.getItem('userId');
                const name = localStorage.getItem('name');
                url = token
                    ? `${url}?token=${token}&tenantId=${tenantId}&userId=${userId}&name=${encodeURIComponent(name)}`
                    : url;
                window.location.href = url;
            }
        } else {
            navigate(key);
        }

        if (isMobile) setDrawerVisible(false);
    };

    /* ---------- Active menu highlighting ---------- */
    const getSelectedKeys = () => {
        const currentPath = location.pathname;
        return [currentPath];
    };

    /* ---------- Submenu open state ---------- */
    useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/users')) setOpenKeys(['/users']);
        else if (currentPath.includes('/sales')) setOpenKeys(['/sales']);
        else if (currentPath.includes('/inventory')) setOpenKeys(['/inventory']);
        else if (currentPath.includes('/marketing')) setOpenKeys(['/marketing']);
        else setOpenKeys([]);
    }, [location.pathname]);

    /* ---------- Mobile resize ---------- */
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* ---------- Logout ---------- */
    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            localStorage.clear();
            window.location.href = import.meta.env.VITE_LOGIN_URL || 'https://signin.tclaccord.com';
        }
    };

    const userMenuItems = [
        { key: 'logout', label: 'Logout', icon: <LogOut size={16} />, onClick: handleLogout },
    ];

    /* ---------- Menu Items ---------- */
    const menuItems = [
        { key: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        {
            key: '/users',
            icon: <UsersRound size={16} />,
            label: 'Users Management',
            children: [
                { key: '/users', label: 'Users', icon: <Users size={16} /> },
                { key: '/users/role', label: 'Roles', icon: <UserCog size={16} /> },
                { key: '/users/permission', label: 'Permissions', icon: <ShieldCheck size={16} /> },
            ],
        },
        {
            key: '/sales',
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
            key: '/inventory',
            icon: <Boxes size={16} />,
            label: 'Inventory Management',
            children: [
                { key: '/inventory/products', label: 'Products', icon: <Package size={16} /> },
                { key: '/inventory/categories', label: 'Categories', icon: <Layers size={16} /> },
            ],
        },
        {
            key: '/marketing',
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
            {/* HEADER */}
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

            {/* MAIN CONTENT */}
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

            {/* MOBILE DRAWER */}
            {isMobile && (
                <Drawer
                    title={<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div className="admin-drawer-logo">A</div>
                        <Text strong>Accord CRM</Text>
                    </div>}
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

/* ---------------- ROOT EXPORT ---------------- */
const AdminLayout = ({ children }) => (
    <ThemeProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
);

export default AdminLayout;
