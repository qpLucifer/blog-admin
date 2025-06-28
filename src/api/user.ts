import api from './index';

export interface User {
  id: number;
  username: string;
  roles: string[];
  email?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  email?: string;
  role_ids?: number[];
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role_ids?: number[];
  status?: number;
}

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
