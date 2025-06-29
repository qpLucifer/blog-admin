import api from './index';
import { User, CreateUserData, UpdateUserData } from '../types';

// 获取用户列表
export const getUsers = () => {
  return api.get('/admin/users');
};

// 创建用户
export const createUser = (data: CreateUserData) => {
  return api.post('/admin/users', data);
};

// 更新用户
export const updateUser = (id: number | string, data: UpdateUserData) => {
  return api.put(`/admin/users/${id}`, data);
};

// 删除用户
export const deleteUser = (id: number | string) => {
  return api.delete(`/admin/users/${id}`);
};

// 获取用户详情
export const getUserById = (id: number) => {
  return api.get(`/admin/users/${id}`);
};
