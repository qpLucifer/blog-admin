import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  MenuOutlined,
  FileTextOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import styles from './index.module.css';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '首页' },
  { key: 'users', icon: <UserOutlined />, label: '用户管理' },
  { key: 'roles', icon: <TeamOutlined />, label: '角色管理' },
  { key: 'permissions', icon: <LockOutlined />, label: '权限管理' },
  { key: 'menus', icon: <MenuOutlined />, label: '菜单管理' },
  { key: 'day-sentence', icon: <FileTextOutlined />, label: '每日一句' },
  { key: 'profile', icon: <UserSwitchOutlined />, label: '个人中心' }
];

const userMenu = (
  <Menu
    items={[{ key: 'logout', label: '退出登录' }]}
    onClick={({ key }) => {
      if (key === 'logout') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }}
  />
);

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

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
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Avatar className={styles.avatar} size={36} style={{ background: '#a18cd1' }}>A</Avatar>
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