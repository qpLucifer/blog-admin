import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, message } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
  FileTextOutlined,
  UserSwitchOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutUser, selectUser } from '../../store/slices/authSlice';
import styles from './index.module.css';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '首页' },
  { key: 'users', icon: <UserOutlined />, label: '用户管理' },
  { key: 'roles', icon: <TeamOutlined />, label: '角色管理' },
  { key: 'permissions', icon: <SafetyOutlined />, label: '权限管理' },
  { key: 'menus', icon: <MenuOutlined />, label: '菜单管理' },
  { key: 'day-sentence', icon: <FileTextOutlined />, label: '每日一句' },
  { key: 'profile', icon: <UserSwitchOutlined />, label: '个人中心' }
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      message.success('登出成功');
    } catch (error) {
      message.error('登出失败');
      console.error('登出失败:', error);
    }
  };

  const userMenuItems = [
    { key: 'logout', label: '退出登录' }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
    }
  };


  return (
    <Layout className={styles.layoutRoot}>
      <Sider collapsible>
        <div className={styles.siderLogo}>博客后台</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(`/${key}`)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
            <Avatar className={styles.avatar} size={36} style={{ background: '#a18cd1' }}>
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
          </Dropdown>
        </Header>
        <Content className={styles.content}>
          <div className={styles.innerContent}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 