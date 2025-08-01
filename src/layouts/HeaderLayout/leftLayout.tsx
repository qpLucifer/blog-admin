import { Tooltip } from 'antd';
import styles from '../index.module.css';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import wsManager, { StatsData, BlogStats } from '../../utils/websocket';
import {
  LinkOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
const LeftLayout: React.FC = () => {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(wsManager.isConnected());
  const [stats, setStats] = useState<StatsData>({
    onlineUsers: 0,
    totalBlogs: 0,
    totalViews: 0,
    pendingComments: 0,
  });

  useEffect(() => {
    // 监听WebSocket连接状态
    const checkConnection = () => {
      setIsConnected(wsManager.isConnected());
    };

    // 定期检查连接状态
    const connectionInterval = setInterval(checkConnection, 1000);
    checkConnection();

    const handleStatsUpdate = (data: StatsData) => {
      setStats(data);
    };

    const handleOnlineUsersUpdate = (count: number) => {
      setStats(prev => ({ ...prev, onlineUsers: count }));
    };

    const handleBlogStatsUpdate = (data: BlogStats) => {
      setStats(prev => ({
        ...prev,
        totalBlogs: data.totalBlogs,
        totalViews: data.totalViews,
      }));
    };

    // 注册事件监听器
    wsManager.on('statsUpdate', handleStatsUpdate);
    wsManager.on('onlineUsersUpdate', handleOnlineUsersUpdate);
    wsManager.on('blogStatsUpdate', handleBlogStatsUpdate);

    // 心跳机制
    const heartbeatInterval = setInterval(() => {
      wsManager.ping();
    }, 5000);

    return () => {
      // 清理事件监听器
      wsManager.off('statsUpdate', handleStatsUpdate);
      wsManager.off('onlineUsersUpdate', handleOnlineUsersUpdate);
      wsManager.off('blogStatsUpdate', handleBlogStatsUpdate);
      clearInterval(heartbeatInterval);
      clearInterval(connectionInterval);
    };
  }, []);

  // 获取页面标题
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap: { [key: string]: string } = {
      '/dashboard': '仪表盘',
      '/system/users': '用户管理',
      '/system/roles': '角色管理',
      '/system/menus': '菜单管理',
      '/blogsManage/blogs': '博客管理',
      '/blogsManage/comments': '评论管理',
      '/blogsManage/tags': '标签管理',
      '/day-sentence': '每日一句',
      '/profile': '个人资料',
    };
    return titleMap[path] || '博客管理系统';
  };
  return (
    <>
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
              {stats.totalViews > 99 ? '99+' : stats.totalViews}
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
        <Tooltip title='ws连接状态' placement='bottom'>
          <div className={styles.statItem}>
            <LinkOutlined className={styles.statIcon} />
            <div className={styles.statNumber}>{isConnected ? '√' : '✘'}</div>
            <div className={styles.statLabel}>ws{isConnected ? '已' : '未'}连接</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default LeftLayout;
