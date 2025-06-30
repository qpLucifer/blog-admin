import axios from 'axios';
import { store } from '../store';
import { API_BASE_URL, API_TIMEOUT, API_STATUS } from '../constants';
import { logoutUser } from '../store/slices/authSlice';


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
    // 处理响应数据
    const data: any = response.data;
    
    // 如果后端返回的是标准格式 { code: 200, data: xxx, message: xxx }
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === API_STATUS.SUCCESS) {
        return data.data;
      } else {
        // 业务错误，抛出异常
        const error = new Error(data.message || '请求失败');
        (error as any).response = { data };
        return Promise.reject(error);
      }
    }
    
    // 直接返回数据
    return data;
  },
  async error => {
    if (error.response && error.response.status === API_STATUS.UNAUTHORIZED) {
      // 401错误时，清除认证状态并重定向到登录页
      await store.dispatch(logoutUser());
      // 如果当前页面不是登录页，重定向到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // 确保错误信息能正确传递
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message || error.response.data.error || '请求失败';
      error.message = errorMessage;
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
