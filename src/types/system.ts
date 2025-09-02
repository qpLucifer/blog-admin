/**
 * 系统设置相关类型定义
 */

// 限流设置
export interface RateLimitSettings {
  windowMs: number;
  max: number;
  loginWindowMs: number;
  loginMax: number;
  uploadWindowMs: number;
  uploadMax: number;
}

// 验证设置
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

// 安全设置
export interface SecuritySettings {
  corsOrigins: string[];
  helmetEnabled: boolean;
}

// 系统设置
export interface SystemSettings {
  rateLimit: RateLimitSettings;
  validation: ValidationSettings;
  security: SecuritySettings;
  _updatedAt?: string;
}
