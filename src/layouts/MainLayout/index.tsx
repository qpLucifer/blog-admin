import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutUser, selectUser, selectUserMenus } from '../../store/slices/authSlice';
import styles from './index.module.css';
import { Menu as MenuType } from '../../types';
import * as AllIcons from '@ant-design/icons';
import { Menu as AntdMenu } from 'antd';

const { Header, Sider, Content } = Layout;


const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userMenus = useAppSelector(selectUserMenus);

  // 递归生成 items 数组
  const buildMenuItems = (menus: MenuType[]): any[] =>
    menus.map(menu => {
      const IconComponent = (AllIcons as any)[menu.icon as keyof typeof AllIcons];
      return {
        key: menu.path,
        icon: menu.icon ? <IconComponent /> : null,
        label: menu.name,
        children: menu.children && menu.children.length > 0 ? buildMenuItems(menu.children) : undefined,
      };
    });
  const menuItems = buildMenuItems(userMenus);


  // 修正菜单高亮逻辑
  const selectedKey = location.pathname === '/' ? '/dashboard' : location.pathname;

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
        <AntdMenu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(`${key}`)}
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