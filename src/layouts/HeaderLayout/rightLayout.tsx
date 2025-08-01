import { Tooltip } from 'antd';
import styles from '../index.module.css';
import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Badge, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { selectUser } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice';
import wsManager from '../../utils/websocket';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
const RightLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [errLog, setErrLog] = useState(0);

  interface MenuItemProps {
    key: string;
    label: string;
    icon?: React.ReactNode;
    children?: MenuItemProps[];
  }

  useEffect(() => {
    const errorLogUpdate = (count: number) => {
      setErrLog(count);
    };

    wsManager.on('errorLog', errorLogUpdate);

    return () => {
      // 清理事件监听器
      wsManager.off('errorLog', errorLogUpdate);
    };
  }, []);

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
          <Badge count={errLog} size='small'>
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
    </>
  );
};

export default RightLayout;
