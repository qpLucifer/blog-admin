import axios from 'axios';
import { store } from '../store';

const instance = axios.create({
  // 使用相对路径，通过代理转发到后端
  baseURL: process.env.REACT_APP_BASIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
    // 如果需要处理响应数据，可以在这里进行处理
    const data = response.data as { code?: number; data?: any };
    if (data.code === 200) {
      return data.data;
    }
    return data;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 401错误时，清除认证状态并重定向到登录页
      store.dispatch({ type: 'auth/logoutUser/fulfilled', payload: true });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 封装常用的 API 方法
const api = {
  get: (url: string, params?: any) => instance.get(url, { params }),
  post: (url: string, data?: any) => instance.post(url, data),
  put: (url: string, data?: any) => instance.put(url, data),
  delete: (url: string) => instance.delete(url),
};

export default api;
