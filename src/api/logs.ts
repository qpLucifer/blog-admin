import { request } from '@/utils/request';

export interface LogFile {
  name: string;
  size: number;
  modified: string;
  type: 'error' | 'auth' | 'business' | 'system';
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  meta: any;
  raw: string;
}

export interface LogStats {
  totalFiles: number;
  totalSize: number;
  fileTypes: {
    error: number;
    auth: number;
    business: number;
    system: number;
  };
  recentLogs: LogFile[];
}

export interface LogContentResponse {
  list: LogEntry[];
  total: number;
  page: number;
  pageSize: number;
  filename: string;
}

// 获取日志文件列表
export const getLogFiles = () => {
  return request.get<LogFile[]>('/api/logs/files');
};

// 获取日志文件内容
export const getLogContent = (
  filename: string,
  params?: {
    page?: number;
    pageSize?: number;
    level?: string;
    search?: string;
  }
) => {
  return request.get<LogContentResponse>(`/api/logs/content/${filename}`, { params });
};

// 下载日志文件
export const downloadLogFile = (filename: string) => {
  return `/api/logs/download/${filename}`;
};

// 清理日志文件
export const cleanLogFiles = (days: number) => {
  return request.delete('/api/logs/clean', { data: { days } });
};

// 获取日志统计信息
export const getLogStats = () => {
  return request.get<LogStats>('/api/logs/stats');
};
