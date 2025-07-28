import api from './index';
import { CreateDaySentenceData, UpdateDaySentenceData, DaySentenceQueryParams } from '../types';

// 获取所有每日一句
export const getDaySentenceAll = () => {
  return api.get('/api/daySentence/listAll');
};

// 分页获取每日一句列表
export const getDaySentenceList = (params?: DaySentenceQueryParams) => {
  return api.get('/api/daySentence/listPage', params);
};

// 添加每日一句
export const addDaySentence = (data: CreateDaySentenceData) => {
  return api.post('/api/daySentence/add', data);
};

// 删除每日一句
export const deleteDaySentence = (id: number | string) => {
  return api.delete(`/api/daySentence/delete/${id}`);
};

// 导出每日一句
export const exportDaySentences = (data: { auth?: string; day_sentence?: string }) => {
  return api.get('/api/daySentence/export', data, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
};

// 更新每日一句
export const updateDaySentence = (id: number | string, data: UpdateDaySentenceData) => {
  return api.put(`/api/daySentence/update/${id}`, data);
};

//
