import api from './index';
import { CreateUserData, UpdateUserData } from '../types';

// 获取用户列表
export const getUsers = () => {
  return api.get('/api/admin/users');
};

// 创建用户
export const createUser = (data: CreateUserData) => {
  return api.post('/api/register', data);
};

// 更新用户
export const updateUser = (id: number | string, data: UpdateUserData) => {
  return api.put(`/api/admin/users/${id}`, data);
};

// 更新用户个人信息
export const updateUserProfile = (id: number | string, data: { mood?: string; signature?: string }) => {
  return api.put(`/api/admin/users/${id}/profile`, data);
};

// 删除用户
export const deleteUser = (id: number | string) => {
  return api.delete(`/api/admin/users/${id}`);
};

// 获取用户详情
export const getUserById = (id: number) => {
  return api.get(`/api/admin/users/${id}`);
};
