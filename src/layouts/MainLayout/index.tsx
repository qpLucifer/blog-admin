import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Avatar, Dropdown, message, Badge, Tooltip } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutUser, selectUser, selectUserMenus } from '../../store/slices/authSlice';
import styles from './index.module.css';
import { Menu as MenuType } from '../../types';
import * as AllIcons from '@ant-design/icons';
import { Menu as AntdMenu } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userMenus = useAppSelector(selectUserMenus);

  // 模拟一些统计数据
  const [stats] = useState({
    onlineUsers: 128,
    todayVisits: 1234,
    totalBlogs: 89,
    pendingComments: 5,
  });

  // 获取当前时间和问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  // 获取页面标题
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap: { [key: string]: string } = {
      '/dashboard': '仪表盘',
      '/users': '用户管理',
      '/roles': '角色管理',
      '/menus': '菜单管理',
      '/blogs': '博客管理',
      '/comments': '评论管理',
      '/tags': '标签管理',
      '/day-sentence': '每日一句',
    };
    return titleMap[path] || '博客管理系统';
  };

  interface MenuItemProps {
    key: string;
    label: string;
    icon?: React.ReactNode;
    children?: MenuItemProps[];
  }

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
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: '系统设置',
      icon: <SettingOutlined />,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: '退出登录',
      icon: <AllIcons.LogoutOutlined />,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        message.info('系统设置功能开发中...');
        break;
      default:
        break;
    }
  };

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
            <div className={styles.headerTitle}>{getPageTitle()}</div>
            <div className={styles.headerStats}>
              <Tooltip title='在线用户数量' placement='bottom'>
                <div className={styles.statItem}>
                  <TeamOutlined className={styles.statIcon} />
                  <div className={styles.statNumber}>{stats.onlineUsers}</div>
                  <div className={styles.statLabel}>在线</div>
                </div>
              </Tooltip>
              <Tooltip title='今日访问量' placement='bottom'>
                <div className={styles.statItem}>
                  <DashboardOutlined className={styles.statIcon} />
                  <div className={styles.statNumber}>
                    {stats.todayVisits > 999 ? '1.2K' : stats.todayVisits}
                  </div>
                  <div className={styles.statLabel}>访问</div>
                </div>
              </Tooltip>
              <Tooltip title='博客文章总数' placement='bottom'>
                <div className={styles.statItem}>
                  <FileTextOutlined className={styles.statIcon} />
                  <div className={styles.statNumber}>{stats.totalBlogs}</div>
                  <div className={styles.statLabel}>博客</div>
                </div>
              </Tooltip>
              <Tooltip title='待处理评论' placement='bottom'>
                <div className={styles.statItem}>
                  <ClockCircleOutlined className={styles.statIcon} />
                  <div className={styles.statNumber}>{stats.pendingComments}</div>
                  <div className={styles.statLabel}>待处理</div>
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Header右侧 */}
          <div className={styles.headerRight}>
            {/* 通知铃铛 */}
            <Tooltip title='通知消息' placement='bottom'>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: 'rgba(102, 126, 234, 0.05)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <Badge count={stats.pendingComments} size='small'>
                  <BellOutlined
                    style={{
                      fontSize: 18,
                      color: '#667eea',
                    }}
                  />
                </Badge>
              </div>
            </Tooltip>

            {/* 用户信息 */}
            <Dropdown
              menu={{ items: userMenuItems as MenuItemProps[], onClick: handleMenuClick }}
              placement='bottomRight'
              trigger={['click']}
            >
              <div className={styles.userInfo}>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>
                    {getGreeting()}，{user?.username || 'Admin'}
                  </div>
                  <div className={styles.userRole}>超级管理员</div>
                </div>
                <Avatar
                  className={styles.avatar}
                  size={40}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                </Avatar>
              </div>
            </Dropdown>
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
