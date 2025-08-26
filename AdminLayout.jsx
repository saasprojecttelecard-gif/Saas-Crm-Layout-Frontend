import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Drawer, Space, Typography, Dropdown } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    LogOut,
    UserRound,
    Menu as MenuIcon,
    AlignRight,
    AlignLeft,
    UserPlus,
    Boxes,
    Ticket,
    Briefcase,
    Funnel,
    UserRoundCog,
    CircleUser,
    UserCog,
    Shield,
    ShieldUser,
    ShieldCheck,
    UsersRound,
    Users
} from 'lucide-react';
import './index.css';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

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

const AdminLayout = ({ children }) => {

    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openKeys, setOpenKeys] = useState(['/sales']);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();



    const menuItems = [
        {
            key: '/dashboard',
            icon: <LayoutDashboard size={16} />,
            label: 'Dashboard',
        },
        // {
        //     key: '/users',
        //     icon: <User size={16} />,
        //     label: 'User',
        // },
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
                // {
                //     key: '/sales/opportunities',
                //     label: 'Opportunities',
                //     icon: <Boxes size={16} />,
                // }
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
                const url = token ? `${config.url}?token=${token}` : config.url;
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

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserRound size={16} />,
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
        <Layout style={{ minHeight: '100vh' }}>
            {!isMobile && (
                <Sider
                    // collapsible
                    theme='light'
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    breakpoint="lg"
                    width={200}
                    collapsedWidth={80}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }}
                >
                    <div className="demo-logo-vertical" style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: borderRadiusLG,
                    }} >
                        {collapsed ? <Text strong style={{ fontSize: '20px', marginLeft: 10 }}>A</Text> : <Text strong style={{ fontSize: '20px', marginLeft: 8 }}>Accord CRM</Text>}
                    </div>
                    <Menu
                        selectedKeys={getSelectedKeys()}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        mode="inline"
                        items={menuItems}
                        onClick={handleMenuClick}
                    />
                </Sider>
            )}

            {isMobile && (
                <Drawer
                    title="Accord Menu"
                    placement="left"
                    closable={true}
                    onClose={onCloseDrawer}
                    open={drawerVisible}
                    width={200}
                    styles={{
                        body: {
                            padding: 0,
                            boxShadow: '3px 0 5px -1px rgba(0, 0, 0, 0.1)',
                        }
                    }}
                >
                    <Menu
                        theme="light"
                        selectedKeys={getSelectedKeys()}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        mode="inline"
                        items={menuItems}
                        onClick={handleMenuClick}
                    />
                </Drawer>
            )}

            <Layout
                style={{
                    marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
                    transition: 'margin-left 0.2s',
                }}
                className="site-layout"
            >
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingLeft: 24,
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={isMobile ? <MenuIcon size={16} /> : (collapsed ? <AlignLeft Left size={16} /> : <AlignRight size={16} />)}
                            onClick={isMobile ? showDrawer : toggleSider}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </div>

                    <Space size="middle" style={{ paddingRight: 24 }}>
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button type="text" icon={<UserRound size={16} />}>
                                {user?.name || user?.email || 'Demo'}
                            </Button>
                        </Dropdown>
                    </Space>
                </Header>

                <Content
                    style={{
                        // margin: '24px 16px',
                        overflow: 'initial',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: "none",
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    Copyright ©{new Date().getFullYear()}. All right reserved.
                </Footer>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
