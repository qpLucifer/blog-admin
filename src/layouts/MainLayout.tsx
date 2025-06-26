import React from 'react';
import { Layout, Menu } from 'antd';
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
import './MainLayout.css';

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

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255,255,255,0.2)', color: '#fff', textAlign: 'center', lineHeight: '32px', fontWeight: 'bold' }}>
          博客后台
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(`/${key}`)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'right', paddingRight: 24 }}>
          {/* 这里可以放用户信息、主题切换等 */}
          <span style={{ fontWeight: 'bold', fontSize: 16 }}>欢迎使用博客后台管理系统</span>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 