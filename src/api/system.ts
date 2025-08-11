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
  uploadEnabled: boolean;
  commentsEnabled: boolean;
  registrationEnabled: boolean;
}

export interface SecuritySettings {
  corsOrigins: string[];
  helmetEnabled: boolean;
}

export interface SystemSettings {
  rateLimit: RateLimitSettings;
  validation: ValidationSettings;
  security: SecuritySettings;
  _updatedAt?: string;
}

export const getSystemSettings = () => api.get('/api/system/settings');

export const updateSystemSettings = (data: SystemSettings) => api.put('/api/system/settings', data);

export const resetSystemSettings = () => api.post('/api/system/settings/reset');
