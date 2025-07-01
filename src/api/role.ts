import api from './index';
import { CreateRoleData, UpdateRoleData } from '../types';

// 获取角色列表
export const getRoles = () => {
  return api.get('/api/admin/roles');
};

// 创建角色
export const createRole = (data: CreateRoleData) => {
  return api.post('/api/admin/roles', data);
};

// 更新角色
export const updateRole = (id: number | string, data: UpdateRoleData) => {
  return api.put(`/api/admin/roles/${id}`, data);
};

// 删除角色
export const deleteRole = (id: number | string) => {
  return api.delete(`/api/admin/roles/${id}`);
};

// 获取角色详情
export const getRoleById = (id: number) => {
  return api.get(`/api/admin/roles/${id}`);
};