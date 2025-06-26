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

// instance.interceptors.response.use(
//   response => response.data,
//   error => {
//     if (error.response && error.response.status === 401) {
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default instance; 