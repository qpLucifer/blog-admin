import api from './index';
import { TagData } from '../types';

// 获取标签列表
export const getTags = () => {
  return api.get('/api/blog/tags');
};

// 新建标签
export const createTag = (data: TagData) => {
  return api.post('/api/blog/tags', data);
};

// 更新标签
export const updateTag = (id: number | string, data: TagData) => {
  return api.put(`/api/blog/tags/${id}`, data);   
};

// 删除标签
export const deleteTag = (id: number | string) => {
  return api.delete(`/api/blog/tags/${id}`);
}; 