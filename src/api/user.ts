import api from './index';

export const getUsers = () => {
  return api.get('/admin/users');
};
