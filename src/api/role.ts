import api from './index';
import { CreateRoleData, UpdateRoleData } from '../types';

// 获取所有角色
export const getRolesAll = () => {
  return api.get('/api/role/listAll');
};

// 分页获取角色列表
export const getRolesPage = (params?: {
  currentPage?: number;
  pageSize?: number;
  name?: string;
}) => {
  return api.get('/api/role/listPage', params);
};

// 创建角色
export const createRole = (data: CreateRoleData) => {
  return api.post('/api/role/roles', data);
};

// 更新角色
export const updateRole = (id: number | string, data: UpdateRoleData) => {
  return api.put(`/api/role/roles/${id}`, data);
};

// 删除角色
export const deleteRole = (id: number | string) => {
  return api.delete(`/api/role/roles/${id}`);
};

// 导出角色
export const exportRoles = (data: { name?: string }) => {
  return api.get('/api/role/export', data, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
};

// 获取角色详情
export const getRoleById = (id: number) => {
  return api.get(`/api/role/roles/${id}`);
};
