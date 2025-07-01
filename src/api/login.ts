import api from './index';

export const login = (data: { username: string; password: string }) => {
  return api.post('/api/login', data);
};

export const logout = () => {
  return api.post('/api/logout');
};