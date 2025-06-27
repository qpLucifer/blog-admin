import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // 根据实际后端接口前缀调整
  timeout: 10000,
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
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
