import api from './index';
import { BlogData, BlogQueryParams } from '../types';

// 获取所有博客
export const getBlogsAll = () => {
  return api.get('/api/blog/listAll');
};

// 分页获取博客列表
export const getBlogsPage = (data: BlogQueryParams) => {
  return api.get('/api/blog/listPage?', data);
};

// 新建博客
export const createBlog = (data: BlogData) => {
  return api.post('/api/blog/add', data);
};

// 更新博客
export const updateBlog = (id: number | string, data: BlogData) => {
  return api.put(`/api/blog/update/${id}`, data);
};

// 删除博客
export const deleteBlog = (id: number | string) => {
  return api.delete(`/api/blog/delete/${id}`);
};

// 获取单篇博客
export const getBlog = (id: number) => {
  return api.get(`/api/blog/${id}`);
};

// 导出博客
export const exportBlogs = (data: {
  title?: string;
  is_published?: boolean;
  is_choice?: boolean;
  author_id?: string;
}) => {
  return api.get('/api/blog/export', data, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
};
