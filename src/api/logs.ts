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
