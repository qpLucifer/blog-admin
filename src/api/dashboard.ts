import api from './index';

// Dashboard统计数据接口
export interface DashboardStats {
  // 基础统计
  totalUsers: number;
  totalBlogs: number;
  totalComments: number;
  totalTags: number;

  // 今日统计
  todayNewUsers: number;
  todayNewBlogs: number;
  todayNewComments: number;
  todayNewTags: number;
  todayNewLogs: number;

  // 趋势数据
  weeklyStats: {
    date: string;
    users: number;
    blogs: number;
    comments: number;
    views: number;
  }[];

  // 当前时间范围数据
  timeRangeStats: {
    users: number;
    blogs: number;
    comments: number;
    views: number;
  };

  // 当前选择的时间范围
  currentTimeRange: string;

  // 热门内容
  topBlogs: Array<{
    id: number;
    title: string;
    views: number;
    likes: number;
    comments_count: number;
    created_at: string;
  }>;

  topTags: Array<{
    id: number;
    name: string;
    blog_count: number;
  }>;

  // 用户活跃度
  activeUsers: Array<{
    id: number;
    username: string;
    blog_count: number;
    comment_count: number;
  }>;

  // 系统状态
  systemStatus: {
    cpu: number;
    memory: number;
    disk: number;
    uptime: number;
    onlineUsers: number;
  };

  // 最近活动
  recentActivities: Array<{
    id: number;
    type: 'user' | 'blog' | 'comment' | 'system';
    action: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

// 获取Dashboard统计数据
export const getDashboardStats = (params?: { timeRange?: string }) => {
  return api.get('/api/dashboard/stats', { params });
};

// 获取实时统计数据
export const getRealTimeStats = () => {
  return api.get('/api/dashboard/realtime');
};

// 获取系统性能数据
export const getSystemPerformance = () => {
  return api.get('/api/dashboard/performance');
};

// 获取用户行为分析
export const getUserBehaviorAnalytics = (days: number = 30) => {
  return api.get(`/api/dashboard/user-behavior?days=${days}`);
};

// 获取内容质量分析
export const getContentQualityAnalytics = () => {
  return api.get('/api/dashboard/content-quality');
};
