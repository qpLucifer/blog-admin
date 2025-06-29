// 用户相关类型
export interface User {
  id: number;
  username: string;
  email?: string;
  roles?: string[];
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  email?: string;
  role_ids?: number[];
  status?: number;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role_ids?: number[];
  status?: number;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

// 认证相关类型
export interface UserInfo {
  id: number;
  username: string;
  roles: string[];
  permissions?: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 表单相关类型
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'switch' | 'datePicker';
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  rules?: any[];
}

// 通用类型
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  render?: (value: any, record: any) => React.ReactNode;
  fixed?: 'left' | 'right';
} 