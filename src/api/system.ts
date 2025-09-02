import api from './index';
import { SystemSettings } from '../types';

export const getSystemSettings = () => api.get('/api/system/settings');

export const updateSystemSettings = (data: SystemSettings) => api.put('/api/system/settings', data);

export const resetSystemSettings = () => api.post('/api/system/settings/reset');
