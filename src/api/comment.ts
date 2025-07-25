import api from './index';
import { CommentData } from '../types';

// 获取所有评论
export const getCommentsAll = () => {
  return api.get('/api/comments/listAll');
};

// 分页获取评论列表
export const getCommentsPage = (params?: {
  currentPage?: number;
  pageSize?: number;
  content?: string;
  user_id?: string;
  blog_id?: number;
}) => {
  return api.get('/api/comments/listPage', params);
};

// 新建评论
export const createComment = (data: CommentData) => {
  return api.post('/api/comments/add', data);
};

// 更新评论
export const updateComment = (id: number | string, data: CommentData) => {
  return api.put(`/api/comments/update/${id}`, data);
};

// 删除评论
export const deleteComment = (id: number | string) => {
  return api.delete(`/api/comments/delete/${id}`);
};
