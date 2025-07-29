import { request } from '@/utils/request';

export interface RealtimeData {
  timestamp: string;
  system: {
    cpu: {
      count: number;
      model: string;
      usage: number;
      loadAverage: number[];
    };
    memory: {
      total: number;
      free: number;
      used: number;
      usage: string;
    };
    uptime: number;
    platform: string;
    arch: string;
    hostname: string;
  };
  process: {
    pid: number;
    uptime: number;
    memory: any;
    cpu: any;
    version: string;
    env: string;
  };
  performance: {
    responseTime: any;
    cache: any;
  };
  health: {
    status: string;
    checks: any;
  };
}

export interface ApiRoute {
  route: string;
  totalRequests: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
}

export interface ApiStats {
  routes: ApiRoute[];
  summary: {
    totalRoutes: number;
    totalRequests: number;
    avgResponseTime: number;
  };
}

export interface HistoryData {
  timestamp: string;
  cpu: number;
  memory: number;
  responseTime: number;
  requests: number;
  errors: number;
}

export interface TrendData {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
  requests: number;
  responseTime: number;
}

export interface ErrorStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byType: Record<string, number>;
  recentErrors: Array<{
    timestamp: string;
    type: string;
    message: string;
    endpoint: string;
    count: number;
  }>;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  efficiency: {
    excellent: boolean;
    good: boolean;
    poor: boolean;
  };
  recommendations: string[];
}

// 获取实时性能数据
export const getRealtimeData = () => {
  return request.get<RealtimeData>('/api/performance/realtime');
};

// 获取历史性能数据
export const getHistoryData = (hours = 24) => {
  return request.get<{
    data: HistoryData[];
    period: string;
    total: number;
  }>('/api/performance/history', { params: { hours } });
};

// 获取API响应时间统计
export const getApiStats = () => {
  return request.get<ApiStats>('/api/performance/api-stats');
};

// 获取错误统计
export const getErrorStats = () => {
  return request.get<ErrorStats>('/api/performance/errors');
};

// 获取缓存统计
export const getCacheStats = () => {
  return request.get<CacheStats>('/api/performance/cache');
};

// 重置性能统计数据
export const resetStats = (type: 'response' | 'cache' | 'all') => {
  return request.post('/api/performance/reset', { type });
};

// 获取系统资源使用趋势
export const getTrends = (period = '1h') => {
  return request.get<{
    period: string;
    data: TrendData[];
    summary: {
      avgCpu: number;
      avgMemory: number;
      avgResponseTime: number;
      totalRequests: number;
    };
  }>('/api/performance/trends', { params: { period } });
};
