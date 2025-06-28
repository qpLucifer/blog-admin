import api from './index';

export const login = (data: { username: string; password: string }) => {
  return api.post('/login', data);
};

export const logout = () => {
  return api.post('/logout');
};