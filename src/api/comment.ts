import api from './index';
import { CommentData } from '../types';

// 获取评论列表
export const getComments = () => {
  return api.get('/api/comments/list');
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
