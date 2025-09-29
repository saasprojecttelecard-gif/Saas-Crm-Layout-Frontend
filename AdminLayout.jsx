
// import { Layout, Menu, Button, theme, Drawer, Space, Typography, Dropdown, Switch, ConfigProvider } from 'antd';
// import { useState, useEffect, createContext, useContext } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//     LayoutDashboard,
//     LogOut,
//     UserRound,
//     Menu as MenuIcon,
//     AlignRight,
//     AlignLeft,
//     UserPlus,
//     Ticket,
//     Briefcase,
//     Funnel,
//     UserCog,
//     ShieldCheck,
//     UsersRound,
//     Users,
//     Sun,
//     Moon,
//     Palette,
//     Package,
//     Layers,
//     Boxes,
//     Lightbulb,
//     BadgePercent,
//     Mail,
//     Megaphone
// } from 'lucide-react';
// import './index.css';
// import apiClient from './apiClient';

// const { Header, Sider, Content, Footer } = Layout;
// const { Text } = Typography;

// const ThemeContext = createContext();

// export const useTheme = () => {
//     const context = useContext(ThemeContext);
//     if (!context) {
//         throw new Error('useTheme must be used within a ThemeProvider');
//     }
//     return context;
// };

// const ThemeProvider = ({ children }) => {
//     const [isDarkMode, setIsDarkMode] = useState(false); // Always light mode

//     useEffect(() => {
//         document.documentElement.setAttribute('data-theme', 'light');
//     }, []);

//     const toggleTheme = () => {
//         // Do nothing - theme is always light
//     };

//     const themeConfig = {
//         algorithm: theme.defaultAlgorithm, // Always light algorithm
//         token: {
//             colorPrimary: '#E67E22',
//             colorSuccess: '#27AE60',
//             colorWarning: '#F39C12',
//             colorError: '#E74C3C',
//             colorInfo: '#3498DB',
//             colorBgContainer: '#FFFFFF',
//             colorBgElevated: '#FFFFFF',
//             colorBgLayout: '#FAF3E0',
//             colorBgBase: '#FFFFFF',
//             colorTextBase: '#2B2D42',
//             borderRadius: 12,
//             borderRadiusLG: 16,
//         },
//     };

//     return (
//         <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeConfig }}>
//             <ConfigProvider theme={themeConfig}>
//                 {children}
//             </ConfigProvider>
//         </ThemeContext.Provider>
//     );
// };

// const NAVIGATION_CONFIG = {
//     '/dashboard': {
//         url: 'https://dashboard.tclaccord.com/dashboard',
//         port: 3002,
//         basename: 'dashboard'
//     },
//     '/users': {
//         url: 'https://members.tclaccord.com/users',
//         port: 3005,
//         basename: 'users'
//     },
//     '/users/role': {
//         url: 'https://members.tclaccord.com/users/role',
//         port: 3005,
//         basename: 'users'
//     },
//     '/users/permission': {
//         url: 'https://members.tclaccord.com/users/permission',
//         port: 3005,
//         basename: 'users'
//     },
//     '/sales/leads': {
//         url: 'https://transaction.tclaccord.com/sales/leads',
//         port: 3004,
//         basename: 'sales'
//     },
//     '/sales/contacts': {
//         url: 'https://transaction.tclaccord.com/sales/contacts',
//         port: 3004,
//         basename: 'sales'
//     },
//     '/sales/opportunities': {
//         url: 'https://transaction.tclaccord.com/sales/opportunities',
//         port: 3004,
//         basename: 'sales'
//     },
//     '/inventory/products': {
//         url: 'https://asset.tclaccord.com/inventory/products',
//         port: 3003,
//         basename: 'inventory'
//     },
//     '/inventory/categories': {
//         url: 'https://asset.tclaccord.com/inventory/categories',
//         port: 3003,
//         basename: 'inventory'
//     },
//     '/tickets': {
//         url: 'https://token.tclaccord.com/tickets',
//         port: 3006,
//         basename: 'tickets'
//     },
//     '/marketing/email-templates': {
//         url: 'https://strategysphere.tclaccord.com/marketing/email-templates',
//         port: 3007,
//         basename: 'marketing'
//     },
//     '/marketing/campaigns': {
//         url: 'https://strategysphere.tclaccord.com/marketing/campaigns',
//         port: 3007,
//         basename: 'marketing'
//     }
// };

// const AdminLayoutContent = ({ children }) => {
//     const { isDarkMode, toggleTheme } = useTheme();
//     const [collapsed, setCollapsed] = useState(false);
//     const [drawerVisible, setDrawerVisible] = useState(false);
//     const [themeDrawerVisible, setThemeDrawerVisible] = useState(false);
//     const [isMobile, setIsMobile] = useState(false);
//     const [openKeys, setOpenKeys] = useState([]);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const user = JSON.parse(localStorage.getItem('user') || '{}');

//     const rootSubmenuKeys = ['/users', '/sales', '/inventory', '/marketing'];

//     const onOpenChange = (keys) => {
//         const latestOpenKey = keys.find((key) => !openKeys.includes(key));
//         if (rootSubmenuKeys.includes(latestOpenKey)) {
//             setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
//         } else {
//             setOpenKeys(keys);
//         }
//     };


//     const menuItems = [
//         {
//             key: '/dashboard',
//             icon: <LayoutDashboard size={16} />,
//             label: 'Dashboard',
//         },
//         {
//             key: "/users",
//             icon: <UsersRound size={16} />,
//             label: "Users Management",
//             children: [
//                 {
//                     key: "/users",
//                     label: "Users",
//                     icon: <Users size={16} />,
//                 },
//                 {
//                     key: "/users/role",
//                     label: "Roles",
//                     icon: <UserCog size={16} />,
//                 },
//                 {
//                     key: "/users/permission",
//                     label: "Permissions",
//                     icon: <ShieldCheck size={16} />,
//                 },
//             ],
//         },
//         {
//             key: '/sales',
//             icon: <Briefcase size={16} />,
//             label: 'Sales',
//             children: [
//                 {
//                     key: '/sales/leads',
//                     label: 'Leads',
//                     icon: <Funnel size={16} />,
//                 },
//                 {
//                     key: '/sales/contacts',
//                     label: 'Contacts',
//                     icon: <UserPlus size={16} />,
//                 },
//                 {
//                     key: '/sales/opportunities',
//                     label: 'Opportunities',
//                     icon: <Lightbulb size={16} />,
//                 },
//             ]
//         },
//         {
//             key: '/tickets',
//             icon: <Ticket size={16} />,
//             label: 'Ticket',
//         },
//         {
//             key: '/inventory',
//             icon: <Boxes size={16} />,
//             label: 'Inventory Management',
//             children: [
//                 {
//                     key: '/inventory/products',
//                     label: 'Products',
//                     icon: <Package size={16} />,
//                 },
//                 {
//                     key: '/inventory/categories',
//                     label: 'Categories',
//                     icon: <Layers size={16} />,
//                 },
//             ]
//         },
//         {
//             key: '/marketing',
//             icon: <BadgePercent size={16} />,
//             label: 'Marketings',
//             children: [
//                 {
//                     key: '/marketing/email-templates',
//                     label: 'Email Templates',
//                     icon: <Mail size={16} />,
//                 },
//                 {
//                     key: '/marketing/campaigns',
//                     label: 'Campaigns',
//                     icon: <Megaphone size={16} />,
//                 },
//             ]
//         },
//     ];

//     // const handleMenuClick = ({ key }) => {
//     //     const config = NAVIGATION_CONFIG[key];
//     //     const currentPort = window.location.port;

//     //     if (config) {
//     //         if (config.port.toString() !== currentPort) {
//     //             const token = localStorage.getItem('token');
//     //             const tenantId = localStorage.getItem('tenantId');
//     //             const userId = localStorage.getItem('userId');
//     //             const name = localStorage.getItem('name');
//     //             const url = token ? `${config.url}?token=${token}&tenantId=${tenantId}&userId=${userId}&name=${encodeURIComponent(name)}` : config.url;
//     //             window.location.href = url;
//     //         } else {
//     //             const routePath = key.replace(`/${config.basename}`, '') || '/';
//     //             navigate(routePath);
//     //         }
//     //     } else {
//     //         navigate(key);
//     //     }

//     //     if (isMobile) {
//     //         setDrawerVisible(false);
//     //     }
//     // };
//     // const handleMenuClick = ({ key }) => {
//     //     const config = NAVIGATION_CONFIG[key];
//     //     const isDev = import.meta.env.DEV;

//     //     if (config) {
//     //         let url;
//     //         if (isDev) {
//     //             const currentPort = window.location.port;
//     //             if (config.port.toString() !== currentPort) {
//     //                 url = `http://localhost:${config.port}${key}`;
//     //             } else {
//     //                 navigate(key);
//     //                 return;
//     //             }
//     //         } else {
//     //             url = config.url;
//     //         }

//     //         const token = localStorage.getItem('token');
//     //         const tenantId = localStorage.getItem('tenantId');
//     //         const userId = localStorage.getItem('userId');
//     //         const name = localStorage.getItem('name');
//     //         url = token
//     //             ? `${url}?token=${token}&tenantId=${tenantId}&userId=${userId}&name=${encodeURIComponent(name)}`
//     //             : url;
//     //         window.location.href = url;
//     //     } else {
//     //         navigate(key);
//     //     }

//     //     if (key.startsWith('/users')) {
//     //         setOpenKeys(['/users']);
//     //     } else if (key.startsWith('/sales')) {
//     //         setOpenKeys(['/sales']);
//     //     } else if (key.startsWith('/inventory')) {
//     //         setOpenKeys(['/inventory']);
//     //     } else if (key.startsWith('/marketing')) {
//     //         setOpenKeys(['/marketing']);
//     //     } else {
//     //         setOpenKeys([]);
//     //     }

//     //     if (isMobile) {
//     //         setDrawerVisible(false);
//     //     }
//     // };

//     const handleMenuClick = ({ key }) => {
//         const config = NAVIGATION_CONFIG[key];
//         const isDev = import.meta.env.DEV;

//         if (config) {
//             // check if current host matches the config host
//             const currentHost = window.location.hostname;
//             const configHost = new URL(config.url).hostname;

//             if (currentHost === configHost) {
//                 // same app → just navigate within React Router
//                 navigate(key);
//             } else {
//                 // different app → redirect with token
//                 let url = isDev ? `http://localhost:${config.port}${key}` : config.url;

//                 const token = localStorage.getItem("token");
//                 const tenantId = localStorage.getItem("tenantId");
//                 const userId = localStorage.getItem("userId");
//                 const name = localStorage.getItem("name");
//                 url = token
//                     ? `${url}?token=${token}&tenantId=${tenantId}&userId=${userId}&name=${encodeURIComponent(name)}`
//                     : url;

//                 window.location.href = url;
//             }
//         } else {
//             navigate(key);
//         }

//         // open correct submenu
//         if (key.startsWith("/users")) setOpenKeys(["/users"]);
//         else if (key.startsWith("/sales")) setOpenKeys(["/sales"]);
//         else if (key.startsWith("/inventory")) setOpenKeys(["/inventory"]);
//         else if (key.startsWith("/marketing")) setOpenKeys(["/marketing"]);
//         else setOpenKeys([]);

//         if (isMobile) setDrawerVisible(false);
//     };

//     // const getSelectedKeys = () => {
//     //     const currentPort = window.location.port;
//     //     const currentPath = window.location.pathname;

//     //     for (const [key, config] of Object.entries(NAVIGATION_CONFIG)) {
//     //         if (config.port.toString() === currentPort) {
//     //             if (key === "/dashboard" && currentPath.includes("dashboard")) return ["/dashboard"];
//     //             if (key === "/users" && currentPath === "/users") return ["/users"];
//     //             if (key === "/users/role" && currentPath.includes("/role")) return ["/users/role"];
//     //             if (key === "/users/permission" && currentPath.includes("/permission")) return ["/users/permission"];
//     //             if (key === "/tickets" && currentPath.includes("tickets")) return ["/tickets"];


//     //             if (key === "/inventory/categories" && currentPath.includes("/categories")) return ["/inventory/categories"];
//     //             if (key === "/inventory/products" && currentPath.includes("/products")) return ["/inventory/products"];

//     //             if (key === "/sales/leads" && currentPath.includes("/leads")) return ["/sales/leads"];
//     //             if (key === "/sales/contacts" && currentPath.includes("/contacts")) return ["/sales/contacts"];
//     //             if (key === "/sales/opportunities" && currentPath.includes("/opportunities")) return ["/sales/opportunities"];

//     //             if (key === "/marketing/email-templates" && currentPath.includes("/email-templates")) return ["/marketing/email-templates"];
//     //             if (key === "/marketing/campaigns" && currentPath.includes("/campaigns")) return ["/marketing/campaigns"];
//     //         }
//     //     }

//     //     return [location.pathname];
//     // };

//     const getSelectedKeys = () => {
//         const currentPath = location.pathname;

//         if (currentPath.startsWith("/users/role")) return ["/users/role"];
//         if (currentPath.startsWith("/users/permission")) return ["/users/permission"];
//         if (currentPath.startsWith("/users")) return ["/users"];

//         if (currentPath.startsWith("/sales/leads")) return ["/sales/leads"];
//         if (currentPath.startsWith("/sales/contacts")) return ["/sales/contacts"];
//         if (currentPath.startsWith("/sales/opportunities")) return ["/sales/opportunities"];

//         if (currentPath.startsWith("/inventory/products")) return ["/inventory/products"];
//         if (currentPath.startsWith("/inventory/categories")) return ["/inventory/categories"];

//         if (currentPath.startsWith("/marketing/email-templates")) return ["/marketing/email-templates"];
//         if (currentPath.startsWith("/marketing/campaigns")) return ["/marketing/campaigns"];

//         if (currentPath.startsWith("/tickets")) return ["/tickets"];
//         if (currentPath.startsWith("/dashboard")) return ["/dashboard"];

//         return [currentPath]; // fallback
//     };


//     useEffect(() => {
//         const currentPath = window.location.pathname;
//         const currentPort = window.location.port;

//         for (const [key, config] of Object.entries(NAVIGATION_CONFIG)) {
//             if (config.port.toString() === currentPort) {
//                 if (key.startsWith('/users') && (currentPath.includes('/users') || currentPath.includes('/role') || currentPath.includes('/permission'))) {
//                     setOpenKeys(['/users']);
//                     return;
//                 } else if (key.startsWith('/sales') && (currentPath.includes('/leads') || currentPath.includes('/contacts') || currentPath.includes('/opportunities'))) {
//                     setOpenKeys(['/sales']);
//                     return;
//                 } else if (key.startsWith('/inventory') && (currentPath.includes('/products') || currentPath.includes('/categories'))) {
//                     setOpenKeys(['/inventory']);
//                     return;
//                 } else if (key.startsWith('/marketing') && (currentPath.includes('/email-templates') || currentPath.includes('/campaigns'))) {
//                     setOpenKeys(['/marketing']);
//                     return;
//                 }
//             }
//         }

//         setOpenKeys([]);
//     }, [location.pathname]);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 992);
//         };

//         handleResize();

//         window.addEventListener('resize', handleResize);

//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const toggleSider = () => {
//         setCollapsed(!collapsed);
//     };

//     const showDrawer = () => {
//         setDrawerVisible(true);
//     };

//     const onCloseDrawer = () => {
//         setDrawerVisible(false);
//     };

//     const handleLogout = async () => {
//         try {
//             await apiClient.post('/auth/logout');
//         } catch (error) {
//             console.error('Logout error:', error);
//         } finally {
//             localStorage.clear();
//             window.location.href = import.meta.env.VITE_LOGIN_URL || 'https://signin.tclcontactplus.com/auth';
//         }
//     };

//     const showThemeDrawer = () => {
//         setThemeDrawerVisible(true);
//     };

//     const onCloseThemeDrawer = () => {
//         setThemeDrawerVisible(false);
//     };

//     const userMenuItems = [
//         // {
//         //     key: 'profile',
//         //     label: 'Profile',
//         //     icon: <UserRound size={16} />,
//         // },
//         // {
//         //     key: 'theme',
//         //     label: 'Theme Settings',
//         //     icon: <Palette size={16} />,
//         //     onClick: showThemeDrawer,
//         // },
//         // {
//         //     type: 'divider',
//         // },
//         {
//             key: 'logout',
//             label: 'Logout',
//             icon: <LogOut size={16} />,
//             onClick: handleLogout,
//         },
//     ];

//     return (
//         <Layout className="admin-layout-main">
//             <Header className="admin-header admin-header-light">
//                 <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                         <Button
//                             type="text"
//                             icon={isMobile ? <MenuIcon size={18} /> : (collapsed ? <AlignLeft size={18} /> : <AlignRight size={18} />)}
//                             onClick={isMobile ? showDrawer : toggleSider}
//                             className="admin-button-header header-button"
//                         />
//                         <div className="admin-logo-icon">
//                             A
//                         </div>
//                         <Text strong className="text-primary" style={{ fontSize: '20px' }}>
//                             Accord CRM
//                         </Text>
//                     </div>

//                     <Dropdown
//                         menu={{ items: userMenuItems }}
//                         placement="bottomRight"
//                         trigger={['click']}
//                     >
//                         <Button
//                             type="text"
//                             className="admin-button-user user-button"
//                         >
//                             <div className="admin-user-avatar">
//                                 {(localStorage.getItem('name') || '').charAt(0).toUpperCase()}
//                             </div>
//                             <span style={{ fontWeight: 500 }}>
//                                 {localStorage.getItem('name') || 'Demo'}
//                             </span>
//                         </Button>
//                     </Dropdown>
//                 </div>
//             </Header>

//             <Layout className="admin-layout-content site-layout">
//                 {!isMobile && (
//                     <Sider
//                         theme="light"
//                         collapsed={collapsed}
//                         onCollapse={setCollapsed}
//                         breakpoint="lg"
//                         width={250}
//                         collapsedWidth={80}
//                         style={{ padding: 0 }}
//                         className="admin-sider admin-sider-light"
//                     >
//                         <div className="admin-menu-container">
//                             {/* <Menu
//                                     theme="light"
//                                     selectedKeys={getSelectedKeys()}
//                                     openKeys={openKeys}
//                                     onOpenChange={setOpenKeys}
//                                     mode="inline"
//                                     items={menuItems}
//                                     onClick={handleMenuClick}
//                                     style={{
//                                         border: 'none',
//                                         background: 'transparent',
//                                     }}
//                                 /> */}
//                             <Menu
//                                 theme="light"
//                                 selectedKeys={getSelectedKeys()}
//                                 // selectedKeys={["/campaigns"]}
//                                 openKeys={openKeys}
//                                 onOpenChange={onOpenChange}
//                                 mode="inline"
//                                 items={menuItems}
//                                 onClick={handleMenuClick}
//                                 style={{
//                                     border: 'none',
//                                     background: 'transparent',
//                                 }}
//                             />

//                         </div>
//                     </Sider>
//                 )}

//                 <Layout className="admin-content-layout">
//                     <Content className="admin-content-main">
//                         <div className="admin-content-card">
//                             {children}
//                         </div>
//                     </Content>

//                     <Footer className="admin-footer-main">
//                         <Text className="admin-footer-text">
//                             © 2024 Accord CRM. All rights reserved.
//                         </Text>
//                         {/* <div className="admin-footer-content">
//                                 <Text className="admin-footer-text">
//                                     © 2024 Accord CRM. All rights reserved.
//                                 </Text>
//                                 <div className="admin-footer-links">
//                                     <Text className="admin-footer-link">Privacy Policy</Text>
//                                     <Text className="admin-footer-link">Terms of Service</Text>
//                                     <Text className="admin-footer-link">Support</Text>
//                                 </div>
//                             </div> */}
//                     </Footer>
//                 </Layout>
//             </Layout>

//             {/* Mobile Drawer */}
//             {isMobile && (
//                 <Drawer
//                     title={
//                         <div className="admin-drawer-title">
//                             <div className="admin-drawer-logo">A</div>
//                             <Text strong style={{ fontSize: '18px' }}>Accord CRM</Text>
//                         </div>
//                     }
//                     placement="left"
//                     closable={true}
//                     onClose={onCloseDrawer}
//                     open={drawerVisible}
//                     width={280}
//                 >
//                     {/* <Menu
//                             theme="light"
//                             selectedKeys={getSelectedKeys()}
//                             openKeys={openKeys}
//                             onOpenChange={setOpenKeys}
//                             mode="inline"
//                             items={menuItems}
//                             onClick={handleMenuClick}
//                             style={{
//                                 border: 'none',
//                                 background: 'transparent',
//                             }}
//                         /> */}
//                     <Menu
//                         theme="light"
//                         selectedKeys={getSelectedKeys()}
//                         openKeys={openKeys}
//                         onOpenChange={onOpenChange}
//                         mode="inline"
//                         items={menuItems}
//                         onClick={handleMenuClick}
//                         style={{
//                             border: 'none',
//                             background: 'transparent',
//                         }}
//                     />

//                 </Drawer>
//             )}

//             {/* Theme Settings Drawer */}
//             <Drawer
//                 title="Theme Settings"
//                 placement="right"
//                 closable={true}
//                 onClose={onCloseThemeDrawer}
//                 open={themeDrawerVisible}
//                 width={320}
//             >
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//                     <div>
//                         <Text strong style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>
//                             Appearance
//                         </Text>
//                         <div className="admin-theme-container">
//                             <div className="admin-theme-text">
//                                 <Sun size={20} />
//                                 <div>
//                                     <Text strong>Light Mode</Text>
//                                     <div className="admin-theme-description">
//                                         Light theme is always active
//                                     </div>
//                                 </div>
//                             </div>
//                             <Switch
//                                 checked={true}
//                                 disabled={true}
//                                 checkedChildren={<Sun size={12} />}
//                                 unCheckedChildren={<Moon size={12} />}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </Drawer>
//         </Layout>
//     );
// };

// const AdminLayout = ({ children }) => {
//     return (
//         <ThemeProvider>
//             <AdminLayoutContent>{children}</AdminLayoutContent>
//         </ThemeProvider>
//     );
// };

// export default AdminLayout;

import { Layout, Menu, Button, theme, Drawer, Typography, Dropdown, Switch, ConfigProvider } from 'antd';
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
    Sun,
    Moon,
    Package,
    Layers,
    Boxes,
    Lightbulb,
    BadgePercent,
    Mail,
    Megaphone
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

/* ---------------- NAV CONFIG ---------------- */
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
        const config = NAVIGATION_CONFIG[key];
        const isDev = import.meta.env.DEV;

        if (config) {
            const currentHost = window.location.hostname;
            const configHost = new URL(config.url).hostname;

            if (currentHost === configHost) {
                // SAME app → just navigate within React Router
                navigate(key);
            } else {
                // DIFFERENT app → full reload with auth
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

        // submenu opening
        if (key.startsWith('/users')) setOpenKeys(['/users']);
        else if (key.startsWith('/sales')) setOpenKeys(['/sales']);
        else if (key.startsWith('/inventory')) setOpenKeys(['/inventory']);
        else if (key.startsWith('/marketing')) setOpenKeys(['/marketing']);
        else setOpenKeys([]);

        if (isMobile) setDrawerVisible(false);
    };

    /* ---------- Active menu highlighting ---------- */
    const getSelectedKeys = () => {
        const currentPath = location.pathname;

        // Check for exact matches first (most specific)
        if (currentPath === '/users/permission') return ['/users/permission'];
        if (currentPath === '/users/role') return ['/users/role'];
        if (currentPath === '/users') return ['/users'];

        if (currentPath === '/sales/opportunities') return ['/sales/opportunities'];
        if (currentPath === '/sales/contacts') return ['/sales/contacts'];
        if (currentPath === '/sales/leads') return ['/sales/leads'];

        if (currentPath === '/inventory/categories') return ['/inventory/categories'];
        if (currentPath === '/inventory/products') return ['/inventory/products'];

        if (currentPath === '/marketing/campaigns') return ['/marketing/campaigns'];
        if (currentPath === '/marketing/email-templates') return ['/marketing/email-templates'];

        if (currentPath === '/tickets') return ['/tickets'];
        if (currentPath === '/dashboard') return ['/dashboard'];

        // Fallback to current path
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
            window.location.href = import.meta.env.VITE_LOGIN_URL || 'https://signin.tclaccord.com/auth';
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
