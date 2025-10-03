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
    Building,
    CreditCard,
    FileText,
    Settings,
    UserCheck
} from 'lucide-react';
import './index.css';
import { clearAllAuthData, broadcastLogout, setupLogoutListener, handleTokenFromUrl } from './tokenHandler';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const ThemeContext = createContext();

const cleanUrlFromTokens = () => {
    const url = new URL(window.location);
    const hasTokenParams = url.searchParams.has('token') ||
        url.searchParams.has('tenantId') ||
        url.searchParams.has('userId') ||
        url.searchParams.has('name');

    if (hasTokenParams) {
        url.searchParams.delete('token');
        url.searchParams.delete('tenantId');
        url.searchParams.delete('userId');
        url.searchParams.delete('name');
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }
};

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
    '/dashboard': { url: 'https://dashboard.tclaccord.com/dashboard', port: 3002 },
    '/users': { url: 'https://members.tclaccord.com/users', port: 3005 },
    '/users/list': { url: 'https://members.tclaccord.com/users/list', port: 3005 },
    '/users/role': { url: 'https://members.tclaccord.com/users/role', port: 3005 },
    '/users/permission': { url: 'https://members.tclaccord.com/users/permission', port: 3005 },
    '/sales/leads': { url: 'https://transaction.tclaccord.com/sales/leads', port: 3004 },
    '/sales/contacts': { url: 'https://transaction.tclaccord.com/sales/contacts', port: 3004 },
    '/sales/opportunities': { url: 'https://transaction.tclaccord.com/sales/opportunities', port: 3004 },
    '/inventory/products': { url: 'https://asset.tclaccord.com/inventory/products', port: 3003 },
    '/inventory/categories': { url: 'https://asset.tclaccord.com/inventory/categories', port: 3003 },
    '/tickets': { url: 'https://token.tclaccord.com/tickets', port: 3006 },
    '/marketing/email-templates': { url: 'https://strategysphere.tclaccord.com/marketing/email-templates', port: 3007 },
    '/marketing/campaigns': { url: 'https://strategysphere.tclaccord.com/marketing/campaigns', port: 3007 },
    '/tenants': { url: 'https://occupant.tclaccord.com/tenant', port: 3008 },
    '/subscription/licenses': { url: 'https://packages.tclaccord.com/subscription/licenses', port: 3009 },
    '/subscription/packages': { url: 'https://packages.tclaccord.com/subscription/packages', port: 3009 },
    '/subscription/subscriptions': { url: 'https://packages.tclaccord.com/subscription/subscriptions', port: 3009 },
    '/subscription/subscription-requests': { url: 'https://packages.tclaccord.com/subscription/subscription-requests', port: 3009 },
};

const PARENT_KEYS = {
    '/users/list': '/users',
    '/users/role': '/users',
    '/users/permission': '/users',
    '/sales/leads': '/sales',
    '/sales/contacts': '/sales',
    '/sales/opportunities': '/sales',
    '/inventory/products': '/inventory',
    '/inventory/categories': '/inventory',
    '/marketing/email-templates': '/marketing',
    '/marketing/campaigns': '/marketing',
    '/subscription/licenses': '/subscription',
    '/subscription/packages': '/subscription',
    '/subscription/subscriptions': '/subscription',
    '/subscription/subscription-requests': '/subscription',
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
        console.log('🔍 Menu clicked:', key);
        const config = NAVIGATION_CONFIG[key];
        console.log('🔍 Config found:', config);

        if (config) {
            const currentHost = window.location.hostname;
            const configHost = new URL(config.url).hostname;
            console.log('🔍 Current host:', currentHost, 'Config host:', configHost);

            if (currentHost === configHost) {
                const pathParts = key.split('/').filter(Boolean);
                let routePath;

                if (key.startsWith('/users/')) {
                    routePath = `/${pathParts.slice(1).join('/')}`;
                } else if (key.startsWith('/sales/')) {
                    routePath = `/${pathParts.slice(1).join('/')}`;
                } else if (key.startsWith('/inventory/')) {
                    routePath = `/${pathParts.slice(1).join('/')}`;
                } else if (key.startsWith('/marketing/')) {
                    routePath = `/${pathParts.slice(1).join('/')}`;
                } else if (key.startsWith('/subscription/')) {
                    routePath = `/${pathParts.slice(1).join('/')}`;
                } else {
                    routePath = '/';
                }

                navigate(routePath, { replace: true });
            } else {
                const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                let url;

                if (isDev) {
                    let routePath;

                    if (key.startsWith('/users/') || key.startsWith('/sales/') ||
                        key.startsWith('/inventory/') || key.startsWith('/marketing/') ||
                        key.startsWith('/subscription/')) {
                        routePath = key;
                    } else {
                        routePath = '/';
                    }

                    url = `http://localhost:${config.port}${routePath}`;
                } else {
                    url = config.url;
                }

                const token = localStorage.getItem('token');
                const tenantId = localStorage.getItem('tenantId');
                const userId = localStorage.getItem('userId');
                const name = localStorage.getItem('name');
                const role = localStorage.getItem('role');
                const permissions = localStorage.getItem('permissions');

                if (token) {
                    url = `${url}?token=${token}&tenantId=${tenantId}&userId=${userId}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&permissions=${encodeURIComponent(permissions)}`;
                }
                window.location.href = url;
            }
        } else {
            navigate(key);
        }

        if (isMobile) setDrawerVisible(false);
    };

    const getSelectedKeys = () => {
        const currentPath = location.pathname;
        const currentHost = window.location.hostname;

        if (currentHost.includes('dashboard')) return ['/dashboard'];
        if (currentHost.includes('token')) return ['/tickets'];
        if (currentHost.includes('occupant')) return ['/tenants'];

        if (currentHost.includes('members')) {
            if (currentPath === '/' || currentPath === '/list' || currentPath === '/users/list') return ['/users/list'];
            if (currentPath === '/role' || currentPath === '/users/role') return ['/users/role'];
            if (currentPath === '/permission' || currentPath === '/users/permission') return ['/users/permission'];
            if (currentPath === '/add' || currentPath === '/users/add') return ['/users/list']; // Add user page should highlight Users
            if (currentPath.startsWith('/edit') || currentPath.startsWith('/users/edit')) return ['/users/list']; // Edit user page should highlight Users
            return ['/users/list'];
        }

        if (currentHost.includes('transaction')) {
            if (currentPath === '/leads') return ['/sales/leads'];
            if (currentPath === '/contacts') return ['/sales/contacts'];
            if (currentPath === '/opportunities') return ['/sales/opportunities'];
            return ['/sales/leads'];
        }

        if (currentHost.includes('asset')) {
            if (currentPath === '/products') return ['/inventory/products'];
            if (currentPath === '/categories') return ['/inventory/categories'];
            return ['/inventory/products'];
        }

        if (currentHost.includes('strategysphere')) {
            if (currentPath === '/email-templates') return ['/marketing/email-templates'];
            if (currentPath === '/campaigns') return ['/marketing/campaigns'];
            return ['/marketing/email-templates'];
        }

        // if (currentHost.includes('packages')) {
        //     if (currentPath === '/subscription/licenses') return ['/subscription/licenses'];
        //     if (currentPath === '/subscription/packages') return ['/subscription/packages'];
        //     if (currentPath === '/subscription/subscriptions') return ['/subscription/subscriptions'];
        //     if (currentPath === '/subscription/subscription-requests') return ['/subscription/subscription-requests'];
        //     return ['/subscription/licenses'];
        // }

        if (currentHost.includes('packages')) {
            if (currentPath.startsWith('/subscription/licenses')) return ['/subscription/licenses'];
            if (currentPath.startsWith('/subscription/packages')) return ['/subscription/packages'];
            if (currentPath.startsWith('/subscription/subscriptions')) return ['/subscription/subscriptions'];
            if (currentPath.startsWith('/subscription/subscription-requests')) return ['/subscription/subscription-requests'];
            return ['/subscription/licenses'];
        }

        if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
            const port = window.location.port;

            if (port === '3005') {
                if (currentPath === '/' || currentPath === '/list') return ['/users/list'];
                if (currentPath === '/role') return ['/users/role'];
                if (currentPath === '/permission') return ['/users/permission'];
                if (currentPath === '/add' || currentPath.startsWith('/edit')) return ['/users/list'];
                return ['/users/list'];
            }

            if (port === '3004') {
                if (currentPath === '/' || currentPath === '/leads') return ['/sales/leads'];
                if (currentPath === '/contacts') return ['/sales/contacts'];
                if (currentPath === '/opportunities') return ['/sales/opportunities'];
                return ['/sales/leads'];
            }

            if (port === '3003') {
                if (currentPath === '/' || currentPath === '/products') return ['/inventory/products'];
                if (currentPath === '/categories') return ['/inventory/categories'];
                return ['/inventory/products'];
            }

            if (port === '3007') {
                if (currentPath === '/' || currentPath === '/email-templates') return ['/marketing/email-templates'];
                if (currentPath === '/campaigns') return ['/marketing/campaigns'];
                return ['/marketing/email-templates'];
            }

            // if (port === '3009') {
            //     if (currentPath === '/' || currentPath === '/licenses') return ['/subscription/licenses'];
            //     if (currentPath === '/packages') return ['/subscription/packages'];
            //     if (currentPath === '/subscriptions') return ['/subscription/subscriptions'];
            //     if (currentPath === '/subscription-requests') return ['/subscription/subscription-requests'];
            //     return ['/subscription/licenses'];
            // }

            if (port === '3009') {
                if (currentPath.startsWith('/licenses')) return ['/subscription/licenses'];
                if (currentPath.startsWith('/packages')) return ['/subscription/packages'];
                if (currentPath.startsWith('/subscriptions')) return ['/subscription/subscriptions'];
                if (currentPath.startsWith('/subscription-requests')) return ['/subscription/subscription-requests'];
                return ['/subscription/licenses'];
            }

            if (port === '3002') return ['/dashboard'];
            if (port === '3006') return ['/tickets'];
            if (port === '3008') return ['/tenants'];
        }

        return [currentPath];
    };

    const getOpenKeys = () => {
        const selectedKey = getSelectedKeys()[0];
        const parentKey = PARENT_KEYS[selectedKey];

        if (parentKey) return [parentKey];
        if (['/users', '/sales', '/inventory', '/marketing', '/subscription'].includes(selectedKey)) return [selectedKey];

        return [];
    };

    useEffect(() => {
        setOpenKeys(getOpenKeys());
    }, [location.pathname, location.hostname]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        handleTokenFromUrl();
        cleanUrlFromTokens();
    }, [location.pathname, location.search]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.action === 'CLEAR_AUTH_DATA') {
                clearAllAuthData();
                event.source.postMessage({ action: 'AUTH_DATA_CLEARED' }, event.origin);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('logout') === 'true') {
            clearAllAuthData();
            const url = new URL(window.location);
            url.searchParams.delete('logout');
            window.history.replaceState({}, document.title, url.pathname + url.search);
        }
    }, []);

    useEffect(() => {
        const cleanup = setupLogoutListener(() => {
            clearAllAuthData();
            cleanUrlFromTokens();
            window.location.href = 'https://signin.tclaccord.com';
        });

        return cleanup;
    }, []);

    const clearAllMicroFrontendStorage = async () => {
        const microFrontends = [
            { name: 'dashboard', url: 'https://dashboard.tclaccord.com', port: 3002 },
            { name: 'users', url: 'https://members.tclaccord.com', port: 3005 },
            { name: 'sales', url: 'https://transaction.tclaccord.com', port: 3004 },
            { name: 'inventory', url: 'https://asset.tclaccord.com', port: 3003 },
            { name: 'tickets', url: 'https://token.tclaccord.com', port: 3006 },
            { name: 'marketing', url: 'https://strategysphere.tclaccord.com', port: 3007 },
            { name: 'tenants', url: 'https://occupant.tclaccord.com', port: 3008 },
        ];

        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        const clearPromises = microFrontends.map(mfe => {
            return new Promise((resolve) => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';

                const targetUrl = isDev ? `http://localhost:${mfe.port}` : mfe.url;

                iframe.onload = () => {
                    try {
                        iframe.contentWindow.postMessage({ action: 'CLEAR_AUTH_DATA' }, '*');
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                            resolve();
                        }, 500);
                    } catch (error) {
                        console.warn(`Could not clear storage for ${mfe.name}:`, error);
                        document.body.removeChild(iframe);
                        resolve();
                    }
                };

                iframe.onerror = () => {
                    console.warn(`Could not load ${mfe.name} for storage clearing`);
                    document.body.removeChild(iframe);
                    resolve();
                };

                iframe.src = `${targetUrl}?logout=true`;
                document.body.appendChild(iframe);
            });
        });

        try {
            await Promise.allSettled(clearPromises);
        } catch (error) {
            console.warn('Some micro-frontends could not be cleared:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('https://auth.tclaccord.com/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            broadcastLogout();

            clearAllAuthData();

            await clearAllMicroFrontendStorage();

            cleanUrlFromTokens();

            window.location.href = 'https://signin.tclaccord.com';
        }
    };

    const userMenuItems = [
        { key: 'logout', label: 'Logout', icon: <LogOut size={16} />, onClick: handleLogout },
    ];

    const userRole = localStorage.getItem('role');

    // const getFilteredMenuItems = () => {
    //     const permissions = localStorage.getItem('permissions')
    //     const allMenuItems = [
    //         { key: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    //         {
    //             key: '/users',
    //             icon: <UsersRound size={16} />,
    //             label: 'Users Management',
    //             children: [
    //                 { key: '/users/list', label: 'Users', icon: <Users size={16} /> },
    //                 { key: '/users/role', label: 'Roles', icon: <UserCog size={16} /> },
    //                 { key: '/users/permission', label: 'Permissions', icon: <ShieldCheck size={16} /> },
    //             ],
    //         },
    //         {
    //             key: '/sales',
    //             icon: <Briefcase size={16} />,
    //             label: 'Sales',
    //             children: [
    //                 { key: '/sales/leads', label: 'Leads', icon: <Funnel size={16} /> },
    //                 { key: '/sales/contacts', label: 'Contacts', icon: <UserPlus size={16} /> },
    //                 { key: '/sales/opportunities', label: 'Opportunities', icon: <Lightbulb size={16} /> },
    //             ],
    //         },
    //         { key: '/tickets', icon: <Ticket size={16} />, label: 'Ticket' },
    //         {
    //             key: '/inventory',
    //             icon: <Boxes size={16} />,
    //             label: 'Inventory Management',
    //             children: [
    //                 { key: '/inventory/products', label: 'Products', icon: <Package size={16} /> },
    //                 { key: '/inventory/categories', label: 'Categories', icon: <Layers size={16} /> },
    //             ],
    //         },
    //         {
    //             key: '/marketing',
    //             icon: <BadgePercent size={16} />,
    //             label: 'Marketing',
    //             children: [
    //                 { key: '/marketing/email-templates', label: 'Email Templates', icon: <Mail size={16} /> },
    //                 { key: '/marketing/campaigns', label: 'Campaigns', icon: <Megaphone size={16} /> },
    //             ],
    //         },
    //     ];

    //     // Add super_admin only menu items
    //     if (userRole === 'super_admin') {
    //         allMenuItems.push(
    //             { key: '/tenants', icon: <Building size={16} />, label: 'Tenant' },
    //             {
    //                 key: '/subscription',
    //                 icon: <CreditCard size={16} />,
    //                 label: 'Subscription Management',
    //                 children: [
    //                     { key: '/subscription/licenses', label: 'Licenses', icon: <FileText size={16} /> },
    //                     { key: '/subscription/packages', label: 'Packages', icon: <Package size={16} /> },
    //                     { key: '/subscription/subscriptions', label: 'Subscriptions', icon: <Settings size={16} /> },
    //                     { key: '/subscription/subscription-requests', label: 'Subscription Requests', icon: <UserCheck size={16} /> },
    //                 ],
    //             }
    //         );
    //     }

    //     return allMenuItems;
    // };
    const getFilteredMenuItems = () => {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

        const allMenuItems = [
            { key: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
            {
                key: '/users',
                icon: <UsersRound size={16} />,
                label: 'Users Management',
                children: [
                    { key: '/users/list', label: 'Users', icon: <Users size={16} />, permission: 'view_users' },
                    { key: '/users/role', label: 'Roles', icon: <UserCog size={16} />, permission: 'view_roles' },
                    { key: '/users/permission', label: 'Permissions', icon: <ShieldCheck size={16} />, permission: 'view_permissions' },
                ],
            },
            {
                key: '/sales',
                icon: <Briefcase size={16} />,
                label: 'Sales',
                children: [
                    { key: '/sales/leads', label: 'Leads', icon: <Funnel size={16} />, permission: 'view_leads' },
                    { key: '/sales/contacts', label: 'Contacts', icon: <UserPlus size={16} />, permission: 'view_contacts' },
                    { key: '/sales/opportunities', label: 'Opportunities', icon: <Lightbulb size={16} />, permission: 'view_opportunities' },
                ],
            },
            {
                key: '/tickets',
                icon: <Ticket size={16} />,
                label: 'Ticket',
                permission: 'view_tickets',
            },
            {
                key: '/inventory',
                icon: <Boxes size={16} />,
                label: 'Inventory Management',
                children: [
                    { key: '/inventory/products', label: 'Products', icon: <Package size={16} />, permission: 'view_products' },
                    { key: '/inventory/categories', label: 'Categories', icon: <Layers size={16} />, permission: 'view_product_categories' },
                ],
            },
            {
                key: '/marketing',
                icon: <BadgePercent size={16} />,
                label: 'Marketing',
                children: [
                    { key: '/marketing/email-templates', label: 'Email Templates', icon: <Mail size={16} />, permission: 'view_email_templates' },
                    { key: '/marketing/campaigns', label: 'Campaigns', icon: <Megaphone size={16} />, permission: 'view_campaigns' },
                ],
            },
        ];

        if (userRole === 'super_admin') {
            allMenuItems.push(
                { key: '/tenants', icon: <Building size={16} />, label: 'Tenant' },
                {
                    key: '/subscription',
                    icon: <CreditCard size={16} />,
                    label: 'Subscription Management',
                    children: [
                        { key: '/subscription/licenses', label: 'Licenses', icon: <FileText size={16} /> },
                        { key: '/subscription/packages', label: 'Packages', icon: <Package size={16} /> },
                        { key: '/subscription/subscriptions', label: 'Subscriptions', icon: <Settings size={16} /> },
                        { key: '/subscription/subscription-requests', label: 'Subscription Requests', icon: <UserCheck size={16} /> },
                    ],
                }
            );

            return allMenuItems;
        }

        const hasPermission = (item) => {
            if (!item.permission) return true;
            return permissions.includes(item.permission);
        };

        const filterMenuItems = (items) => {
            return items.reduce((filtered, item) => {
                if (item.children) {
                    const filteredChildren = filterMenuItems(item.children);
                    if (filteredChildren.length > 0) {
                        filtered.push({ ...item, children: filteredChildren });
                    }
                } else if (hasPermission(item)) {
                    filtered.push(item);
                }
                return filtered;
            }, []);
        };

        return filterMenuItems(allMenuItems);
    };

    const menuItems = getFilteredMenuItems();

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
                        style={{ overflowY: 'auto' }}
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