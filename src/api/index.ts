import axios from 'axios';
import { store } from '../store';
import { API_BASE_URL, API_TIMEOUT, API_STATUS } from '../constants';
import { logoutUser } from '../store/slices/authSlice';
import { message } from 'antd';

const instance = axios.create({
  // 使用相对路径，通过代理转发到后端
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

instance.interceptors.request.use(
  config => {
    // 从Redux store获取token
    const token = store.getState().auth.token;
    if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => {
    const data: any = response.data;
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === API_STATUS.SUCCESS) {
        return data.data;
      } else {
        const error = new Error(data.message || '请求失败');
        (error as any).response = { data };
        (error as any).code = data.code;
        (error as any).handled = true; // 标记已处理
        return Promise.reject(error);
      }
    }
    return data;
  },
  async error => {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请稍后重试');
      } else {
        message.error('网络连接失败，请检查网络设置');
      }
      error.handled = true; // 标记已处理
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case API_STATUS.UNAUTHORIZED:
        message.error('登录已过期，请重新登录');
        await store.dispatch(logoutUser());
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case API_STATUS.FORBIDDEN:
        message.error('权限不足，无法执行此操作');
        break;
      case API_STATUS.NOT_FOUND:
        message.error('请求的资源不存在');
        break;
      case API_STATUS.SERVER_ERROR:
        message.error('服务器内部错误，请稍后重试');
        break;
      default:
        const errorMessage = data?.message || data?.error || `请求失败 (${status})`;
        message.error(errorMessage);
    }

    error.message = data?.message || data?.error || error.message || '请求失败';
    error.handled = true; // 标记已处理

    return Promise.reject(error);
  }
);

// 封装常用的 API 方法
const api = {
  get: (url: string, params?: any, config?: any) => {
    const finalConfig = {
      params,
      ...config,
    };
    return instance.get(url, finalConfig);
  },
  post: (url: string, data?: any) => instance.post(url, data),
  put: (url: string, data?: any) => instance.put(url, data),
  delete: (url: string) => instance.delete(url),
};

export default api;
