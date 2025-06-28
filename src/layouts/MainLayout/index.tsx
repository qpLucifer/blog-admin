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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser, selectUser } from '../../store/slices/authSlice';
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

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // 登出成功后会自动清除状态，AuthInitializer会处理重定向
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const userMenu = (
    <Menu
      items={[{ key: 'logout', label: '退出登录' }]}
      onClick={({ key }) => {
        if (key === 'logout') {
          handleLogout();
        }
      }}
    />
  );

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