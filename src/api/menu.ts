import api from './index';
import { CreateMenuData, UpdateMenuData } from '../types';


export const getMenuList = () => {
  return api.get('/api/menu');
};  

export const getMenuTree = () => {
  return api.get('/api/menu/tree');
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