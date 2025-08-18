import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Drawer, Space, Typography } from 'antd';
import {
    LayoutDashboard,
    User,
    LogOut,
    UserRound,
    Menu as MenuIcon,
    PanelLeft,
    PanelRight,
    AlignRight,
    AlignLeft,
    UserPlus,
    Boxes,
    Ticket
} from 'lucide-react';
import './index.css';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <LayoutDashboard size={16} />,
            label: 'Dashboard',
        },
        {
            key: '/users',
            icon: <User size={16} />,
            label: 'User',
        },
        {
            key: '/leads',
            icon: <UserPlus size={16} />,
            label: 'Lead',
        },
        {
            key: '/inventory',
            icon: <Boxes size={16} />,
            label: 'Inventory',
        },
        {
            key: '/tickets',
            icon: <Ticket size={16} />,
            label: 'Ticket',
        },
    ];

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
                    <Menu defaultSelectedKeys={[window.location.pathname]} mode="inline" items={menuItems} />
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
                    bodyStyle={{
                        padding: 0, boxShadow: '3px 0 5px -1px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
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
                        <Button type="text" icon={<UserRound size={16} />}>Profile</Button>
                        <Button type="text" icon={<LogOut size={16} />}>Logout</Button>
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
