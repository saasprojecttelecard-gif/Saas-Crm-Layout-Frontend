
import { Layout, Menu, Button, theme, Drawer, Space, Typography, Dropdown, Switch, ConfigProvider } from 'antd';
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    UserRound,
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
    Sun,
    Moon,
    Palette
} from 'lucide-react';
import './index.css';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false); // Always light mode

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
    }, []);

    const toggleTheme = () => {
        // Do nothing - theme is always light
    };

    const themeConfig = {
        algorithm: theme.defaultAlgorithm, // Always light algorithm
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
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeConfig }}>
            <ConfigProvider theme={themeConfig}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

const NAVIGATION_CONFIG = {
    '/dashboard': {
        url: 'http://localhost:3002/dashboard',
        port: 3002,
        basename: 'dashboard'
    },
    '/users': {
        url: 'http://localhost:3005/users',
        port: 3005,
        basename: 'users'
    },
    '/users/role': {
        url: 'http://localhost:3005/users/role',
        port: 3005,
        basename: 'users'
    },
    '/users/permission': {
        url: 'http://localhost:3005/users/permission',
        port: 3005,
        basename: 'users'
    },
    '/sales/leads': {
        url: 'http://localhost:3004/sales/leads',
        port: 3004,
        basename: 'sales'
    },
    '/sales/contacts': {
        url: 'http://localhost:3004/sales/contacts',
        port: 3004,
        basename: 'sales'
    },
    '/sales/opportunities': {
        url: 'http://localhost:3004/sales/opportunities',
        port: 3004,
        basename: 'sales'
    },
    '/inventory': {
        url: 'http://localhost:3003/inventory',
        port: 3003,
        basename: 'inventory'
    },
    '/tickets': {
        url: 'http://localhost:3006/tickets',
        port: 3006,
        basename: 'tickets'
    }
};

const AdminLayoutContent = ({ children }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [themeDrawerVisible, setThemeDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openKeys, setOpenKeys] = useState(['/sales']);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const menuItems = [
        {
            key: '/dashboard',
            icon: <LayoutDashboard size={16} />,
            label: 'Dashboard',
        },
        {
            key: "/users",
            icon: <UsersRound size={16} />,
            label: "Users Management",
            children: [
                {
                    key: "/users",
                    label: "Users",
                    icon: <Users size={16} />,
                },
                {
                    key: "/users/role",
                    label: "Roles",
                    icon: <UserCog size={16} />,
                },
                {
                    key: "/users/permission",
                    label: "Permissions",
                    icon: <ShieldCheck size={16} />,
                },
            ],
        },
        {
            key: '/sales',
            icon: <Briefcase size={16} />,
            label: 'Sales',
            children: [
                {
                    key: '/sales/leads',
                    label: 'Leads',
                    icon: <Funnel size={16} />,
                },
                {
                    key: '/sales/contacts',
                    label: 'Contacts',
                    icon: <UserPlus size={16} />,
                },
            ]
        },
        {
            key: '/tickets',
            icon: <Ticket size={16} />,
            label: 'Ticket',
        },
    ];

    const handleMenuClick = ({ key }) => {
        const config = NAVIGATION_CONFIG[key];
        const currentPort = window.location.port;

        if (config) {
            if (config.port.toString() !== currentPort) {
                const token = localStorage.getItem('token');
                const tenantId = localStorage.getItem('tenantId');
                const userId = localStorage.getItem('userId');
                const name = localStorage.getItem('name');
                const url = token ? `${config.url}?token=${token}&tenantId=${tenantId}&userId=${userId}&name=${encodeURIComponent(name)}` : config.url;
                window.location.href = url;
            } else {
                const routePath = key.replace(`/${config.basename}`, '') || '/';
                navigate(routePath);
            }
        } else {
            navigate(key);
        }

        if (isMobile) {
            setDrawerVisible(false);
        }
    };

    const getSelectedKeys = () => {
        const currentPort = window.location.port;
        const currentPath = window.location.pathname;

        for (const [key, config] of Object.entries(NAVIGATION_CONFIG)) {
            if (config.port.toString() === currentPort) {
                if (key === "/dashboard" && currentPath.includes("dashboard")) return ["/dashboard"];
                if (key === "/users" && currentPath === "/users") return ["/users"];
                if (key === "/users/role" && currentPath.includes("/role")) return ["/users/role"];
                if (key === "/users/permission" && currentPath.includes("/permission")) return ["/users/permission"];
                if (key === "/tickets" && currentPath.includes("tickets")) return ["/tickets"];
                if (key === "/inventory" && currentPath.includes("inventory")) return ["/inventory"];

                if (key === "/sales/leads" && currentPath.includes("/leads")) return ["/sales/leads"];
                if (key === "/sales/contacts" && currentPath.includes("/contacts")) return ["/sales/contacts"];
                if (key === "/sales/opportunities" && currentPath.includes("/opportunities")) return ["/sales/opportunities"];
            }
        }

        return [location.pathname];
    };

    useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/leads') || currentPath.includes('/contacts') || currentPath.includes('/opportunities')) {
            setOpenKeys(['/sales']);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSider = () => {
        setCollapsed(!collapsed);
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onCloseDrawer = () => {
        setDrawerVisible(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'http://localhost:3001/auth';
    };

    const showThemeDrawer = () => {
        setThemeDrawerVisible(true);
    };

    const onCloseThemeDrawer = () => {
        setThemeDrawerVisible(false);
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserRound size={16} />,
        },
        {
            key: 'theme',
            label: 'Theme Settings',
            icon: <Palette size={16} />,
            onClick: showThemeDrawer,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogOut size={16} />,
            onClick: handleLogout,
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
                            onClick={isMobile ? showDrawer : toggleSider}
                            className="admin-button-header header-button"
                        />
                        <div className="admin-logo-icon">
                            A
                        </div>
                        <Text strong className="admin-text" style={{ fontSize: '20px' }}>
                            Accord CRM
                        </Text>
                    </div>

                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button
                            type="text"
                            className="admin-button-user user-button"
                        >
                            <div className="admin-user-avatar">
                                {(localStorage.getItem('name') || '').charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>
                                {localStorage.getItem('name') || 'Demo'}
                            </span>
                        </Button>
                    </Dropdown>
                </div>
            </Header>

            <Layout className="admin-layout-content site-layout">
                {!isMobile && (
                    <Sider
                        theme="light"
                        collapsed={collapsed}
                        onCollapse={setCollapsed}
                        breakpoint="lg"
                        width={250}
                        collapsedWidth={80}
                        style={{ padding: 0 }}
                        className="admin-sider admin-sider-light"
                    >
                        <div className="admin-menu-container">
                            <Menu
                                theme="light"
                                selectedKeys={getSelectedKeys()}
                                openKeys={openKeys}
                                onOpenChange={setOpenKeys}
                                mode="inline"
                                items={menuItems}
                                onClick={handleMenuClick}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                }}
                            />
                        </div>
                    </Sider>
                )}

                <Layout className="admin-content-layout">
                    <Content className="admin-content-main">
                        <div className="admin-content-card">
                            {children}
                        </div>
                    </Content>

                    <Footer className="admin-footer-main">
                        <div className="admin-footer-content">
                            <Text className="admin-footer-text">
                                © 2024 Accord CRM. All rights reserved.
                            </Text>
                            <div className="admin-footer-links">
                                <Text className="admin-footer-link">Privacy Policy</Text>
                                <Text className="admin-footer-link">Terms of Service</Text>
                                <Text className="admin-footer-link">Support</Text>
                            </div>
                        </div>
                    </Footer>
                </Layout>
            </Layout>

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    title={
                        <div className="admin-drawer-title">
                            <div className="admin-drawer-logo">A</div>
                            <Text strong style={{ fontSize: '18px' }}>Accord CRM</Text>
                        </div>
                    }
                    placement="left"
                    closable={true}
                    onClose={onCloseDrawer}
                    open={drawerVisible}
                    width={280}
                >
                    <Menu
                        theme="light"
                        selectedKeys={getSelectedKeys()}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        mode="inline"
                        items={menuItems}
                        onClick={handleMenuClick}
                        style={{
                            border: 'none',
                            background: 'transparent',
                        }}
                    />
                </Drawer>
            )}

            {/* Theme Settings Drawer */}
            <Drawer
                title="Theme Settings"
                placement="right"
                closable={true}
                onClose={onCloseThemeDrawer}
                open={themeDrawerVisible}
                width={320}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <Text strong style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>
                            Appearance
                        </Text>
                        <div className="admin-theme-container">
                            <div className="admin-theme-text">
                                <Sun size={20} />
                                <div>
                                    <Text strong>Light Mode</Text>
                                    <div className="admin-theme-description">
                                        Light theme is always active
                                    </div>
                                </div>
                            </div>
                            <Switch
                                checked={true}
                                disabled={true}
                                checkedChildren={<Sun size={12} />}
                                unCheckedChildren={<Moon size={12} />}
                            />
                        </div>
                    </div>
                </div>
            </Drawer>
        </Layout>
    );
};

const AdminLayout = ({ children }) => {
    return (
        <ThemeProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </ThemeProvider>
    );
};

export default AdminLayout;