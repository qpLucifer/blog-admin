import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { selectUserMenus } from '../../store/slices/authSlice';
import styles from '../index.module.css';
import { Menu as MenuType } from '../../types';
import * as AllIcons from '@ant-design/icons';
import { Menu as AntdMenu } from 'antd';
import LeftLayout from '../HeaderLayout/leftLayout';
import RightLayout from '../HeaderLayout/rightLayout';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userMenus = useAppSelector(selectUserMenus);

  // 递归生成 items 数组
  const buildMenuItems = useCallback(
    (menus: MenuType[]): any[] =>
      menus.map(menu => {
        const IconComponent = (AllIcons as any)[menu.icon as keyof typeof AllIcons];
        return {
          key: menu.path,
          icon: menu.icon ? <IconComponent /> : null,
          label: menu.name,
          children:
            menu.children && menu.children.length > 0 ? buildMenuItems(menu.children) : undefined,
        };
      }),
    []
  );

  const menuItems = useMemo(() => {
    return userMenus ? buildMenuItems(userMenus) : [];
  }, [userMenus, buildMenuItems]);

  // 修正菜单高亮逻辑
  const selectedKey = location.pathname === '/' ? '/dashboard' : location.pathname;

  // 递归查找当前路径的所有父级key
  const getOpenKeys = useCallback((menus: MenuType[], pathname: string): string[] => {
    let keys: string[] = [];
    for (const menu of menus) {
      if (menu.children && menu.children.length > 0) {
        if (pathname.startsWith(menu.path)) {
          keys.push(menu.path);
          const childKeys = getOpenKeys(menu.children, pathname);
          keys = keys.concat(childKeys);
        }
      }
    }
    return keys;
  }, []);

  // 用useState管理openKeys
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 使用 useMemo 来计算 openKeys，避免 useEffect 的依赖问题
  const currentOpenKeys = useMemo(() => {
    if (userMenus && userMenus.length > 0) {
      return getOpenKeys(userMenus, location.pathname);
    }
    return [];
  }, [userMenus, location.pathname, getOpenKeys]);

  // 只在计算结果变化时更新 state
  useEffect(() => {
    setOpenKeys(currentOpenKeys);
  }, [currentOpenKeys]);

  return (
    <Layout className={styles.layoutRoot}>
      <Sider collapsible className={styles.sider}>
        <div className={styles.siderLogo}>✨ 博客管理系统</div>
        <AntdMenu
          theme='dark'
          mode='inline'
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={({ key }) => navigate(`${key}`)}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          {/* Header左侧 */}
          <div className={styles.headerLeft}>
            <LeftLayout />
          </div>

          {/* Header右侧 */}
          <div className={styles.headerRight}>
            <RightLayout />
          </div>
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
