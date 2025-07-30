import api from './index';
import { LogQueryParams, LogCleanParams, LogFileQueryParams } from '../types';

// 获取日志文件列表
export const getLogFiles = (params?: LogFileQueryParams) => {
  return api.get('/api/logs/files', params);
};

// 读取日志文件内容
export const getLogContent = (type: string, filename: string, params?: LogQueryParams) => {
  return api.get(`/api/logs/content/${type}/${filename}`, params);
};

// 下载日志文件
export const downloadLogFile = (type: string, filename: string) => {
  return api.get(`/api/logs/download/${type}/${filename}`, undefined, {
    responseType: 'blob',
  });
};

// 清理日志文件
export const cleanLogFiles = (params: LogCleanParams) => {
  return api.delete('/api/logs/clean', params);
};

// 获取日志统计信息
export const getLogStats = () => {
  return api.get('/api/logs/stats');
};

// 导出日志文件（如果后端支持）
export const exportLogFiles = (params?: any) => {
  return api.get('/api/logs/export', params, {
    responseType: 'blob',
  });
};

// 实时获取最新日志（轮询用）
export const getLatestLogs = (type: string, filename: string, lastTimestamp?: string) => {
  return api.get(`/api/logs/content/${type}/${filename}`, {
    page: 1,
    pageSize: 50,
    since: lastTimestamp,
  });
};

// 搜索日志内容
export const searchLogs = (type: string, filename: string, searchParams: LogQueryParams) => {
  return api.get(`/api/logs/content/${type}/${filename}`, searchParams);
};

// 获取日志级别统计
export const getLogLevelStats = (type: string, filename: string) => {
  return api.get(`/api/logs/content/${type}/${filename}/stats`);
};

// 批量下载日志文件
export const batchDownloadLogs = (filenames: string[]) => {
  return api.post(
    '/api/logs/batch-download',
    { filenames },
    {
      responseType: 'blob',
    }
  );
};
