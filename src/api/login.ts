import api from './index';
import { LoginCredentials } from '../types';

export const login = (data: LoginCredentials) => {
  return api.post('/api/login', data);
};

export const logout = () => {
  return api.post('/api/logout');
};
