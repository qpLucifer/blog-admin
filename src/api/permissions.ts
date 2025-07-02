import api from './index';
import { CreatePermissionData, UpdatePermissionData } from '../types';

// 获取权限列表
export const getPermissions = () => {
  return api.get('/api/admin/permissions');
};

// 创建权限
export const createPermission = (data: CreatePermissionData) => {
  return api.post('/api/admin/permissions', data);
};

// 更新权限
export const updatePermission = (id: number | string, data: UpdatePermissionData) => {
  return api.put(`/api/admin/permissions/${id}`, data);
};

// 删除权限
export const deletePermission = (id: number | string) => {
  return api.delete(`/api/admin/permissions/${id}`);
};