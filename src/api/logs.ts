import api from './index';
import { UserLogQueryParams, LogCleanParams } from '../types';

// 获取操作日志列表
export const getUserLogs = (params?: UserLogQueryParams) => {
  return api.get('/api/logs/list', params);
};

// 获取日志统计信息
export const getLogStats = () => {
  return api.get('/api/logs/stats');
};

// 获取失败日志统计（总失败/未读失败/按模块统计）
export const getFailedLogStats = () => {
  return api.get('/api/logs/failed-stats');
};

// 一键标记失败日志为已读
export const markFailedLogsRead = () => {
  return api.post('/api/logs/mark-read-failed');
};

// 清理日志文件
export const cleanLogFiles = (params: LogCleanParams) => {
  return api.delete('/api/logs/clean', params);
};

// 导出日志文件
export const exportLogFiles = (params?: UserLogQueryParams) => {
  return api.get('/api/logs/export', params, {
    responseType: 'blob',
  });
};

// 标记日志为已读
export const markLogAsRead = (logId: number) => {
  return api.post('/api/logs/mark-read', { logId });
};
