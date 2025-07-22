import api from './index';
import { TagData } from '../types';

// 获取标签列表
export const getTags = (data: { name: string, pageSize: number, currentPage: number }) => {
  return api.get('/api/tag/list', data);
};

// 新建标签
export const createTag = (data: TagData) => {
  return api.post('/api/tag/add', data);
};

// 更新标签
export const updateTag = (id: number | string, data: TagData) => {
  return api.put(`/api/tag/update/${id}`, data);   
};

// 删除标签
export const deleteTag = (id: number | string) => {
  return api.delete(`/api/tag/delete/${id}`);
}; 