import api from './index';
import { TagData, TagQueryParams } from '../types';

// 获取所有标签列表
export const getTagsAll = () => {
  return api.get('/api/tag/listAll');
};

// 分页获取标签列表
export const getTagsPage = (data: TagQueryParams) => {
  return api.get('/api/tag/listPage', data);
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

// 导出标签
export const exportTags = (data: { name?: string }) => {
  return api.get('/api/tag/export', data, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
};
