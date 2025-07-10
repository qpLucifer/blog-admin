import api from './index';
import { CommentData } from '../types';

// 获取评论列表
export const getComments = () => {
  return api.get('/api/blog/comments');
};

// 新建评论
export const createComment = (data: CommentData) => {
  return api.post('/api/blog/comments', data);
};

// 更新评论
export const updateComment = (id: number | string, data: CommentData) => {
  return api.put(`/api/blog/comments/${id}`, data);   
};

// 删除评论
export const deleteComment = (id: number | string) => {
  return api.delete(`/api/blog/comments/${id}`);
}; 
