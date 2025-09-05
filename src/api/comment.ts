import api from './index';
import { CommentData, CommentQueryParams } from '../types';

// 获取所有评论
export const getCommentsAll = () => {
  return api.get('/api/comments/listAll');
};

// 分页获取评论列表
export const getCommentsPage = (params?: CommentQueryParams) => {
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

// 导出评论
export const exportComments = (data: { content?: string; user_id?: string; blog_id?: string }) => {
  return api.get('/api/comments/export', data, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
};

// 获取待处理评论数量
export const getPendingCommentsCount = () => {
  return api.get('/api/comments/pending-count');
};

// 标记评论为已回复
export const markCommentAsReplied = (id: number | string) => {
  return api.put(`/api/comments/mark-replied/${id}`);
};
