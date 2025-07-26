import api from './index';
import { CreateUserData, UpdateUserData } from '../types';

// 获取用户列表
export const getUsersAll = () => {
  return api.get('/api/user/listAll');
};
// 获取用户列表
export const getUsersPage = (params?: {
  currentPage?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  is_active?: number;
}) => {
  return api.get('/api/user/listPage', params);
};

// 注册用户
export const registerUser = (data: CreateUserData) => {
  return api.post('/api/register', data);
};

// 创建用户
export const createUser = (data: CreateUserData) => {
  return api.post('/api/user/users', data);
};

// 更新用户
export const updateUser = (id: number | string, data: UpdateUserData) => {
  return api.put(`/api/user/users/${id}`, data);
};

// 更新用户个人信息
export const updateUserProfile = (
  id: number | string,
  data: { mood?: string; signature?: string }
) => {
  return api.put(`/api/user/users/${id}/profile`, data);
};

// 删除用户
export const deleteUser = (id: number | string) => {
  return api.delete(`/api/user/users/${id}`);
};

// 获取用户详情
export const getUserById = (id: number) => {
  return api.get(`/api/user/users/${id}`);
};

// 导出用户
export const exportUsers = (data: { username?: string; email?: string; is_active?: boolean }) => {
  return api.get('/api/user/export', data, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
};
