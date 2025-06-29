// API 相关常量
export const API_BASE_URL = process.env.REACT_APP_BASIC_API_URL || '';

// API 超时时间
export const API_TIMEOUT = 10000;

// API 状态码
export const API_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// API 错误消息
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败',
  TIMEOUT_ERROR: '请求超时',
  SERVER_ERROR: '服务器错误',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '禁止访问',
  NOT_FOUND: '资源不存在',
} as const; 