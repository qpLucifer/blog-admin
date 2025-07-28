import api from './index';
import { CreateMenuData, UpdateMenuData, MenuQueryParams } from '../types';

export const getMenuList = () => {
  return api.get('/api/menu');
};

export const getMenuTree = (params?: Pick<MenuQueryParams, 'name' | 'path'>) => {
  return api.get('/api/menu/tree', params);
};

export const addMenu = (data: CreateMenuData) => {
  return api.post('/api/menu', data);
};

export const updateMenu = (id: number | string, data: UpdateMenuData) => {
  return api.put(`/api/menu/${id}`, data);
};

export const deleteMenu = (id: number | string) => {
  return api.delete(`/api/menu/${id}`);
};

// 导出菜单
export const exportMenus = (data: { name?: string; path?: string }) => {
  return api.get('/api/menu/export', data, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
};
