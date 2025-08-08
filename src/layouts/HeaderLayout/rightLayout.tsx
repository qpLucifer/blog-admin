import { Tooltip } from 'antd';
import styles from '../index.module.css';
import React from 'react';
import { Avatar, Dropdown, Badge, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { selectUser } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice';
import wsManager from '../../utils/websocket';
import { useSelector } from 'react-redux';
import { selectStats } from '../../store/slices/statsSlice';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
const RightLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const stats = useSelector(selectStats);
  interface MenuItemProps {
    key: string;
    label: string;
    icon?: React.ReactNode;
    children?: MenuItemProps[];
  }

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
      icon: <LogoutOutlined />,
    },
  ];

  // 获取当前时间和问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      wsManager.disconnect();
      message.success('登出成功');
    } catch (error) {
      message.error('登出失败');
      console.error('登出失败:', error);
    }
  };

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
    <>
      <Tooltip title='错误日志通知' placement='bottom'>
        <Badge count={stats.errorLogs} size='small'>
          <BellOutlined
            style={{
              fontSize: 18,
              color: '#667eea',
            }}
          />
        </Badge>
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
    </>
  );
};

export default RightLayout;
