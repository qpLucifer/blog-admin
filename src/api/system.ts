import api from './index';

export interface RateLimitSettings {
  windowMs: number;
  max: number;
  loginWindowMs: number;
  loginMax: number;
  uploadWindowMs: number;
  uploadMax: number;
}

export interface ValidationSettings {
  usernameMin: number;
  usernameMax: number;
  passwordMin: number;
  passwordMax: number;
  enforceStrongPassword: boolean;
}

export interface SystemSettings {
  rateLimit: RateLimitSettings;
  validation: ValidationSettings;
}

export const getSystemSettings = () => api.get('/api/system/settings');

export const updateSystemSettings = (data: SystemSettings) => api.put('/api/system/settings', data);
