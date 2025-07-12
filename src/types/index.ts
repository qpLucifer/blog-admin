// 用户相关类型
export interface User {
  id: number;
  username: string;
  email?: string;
  roles?: { id: number; name: string }[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  signature?: string;
  mood?: string;
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
  id: number | string;
  name: string;
  description?: string;
  menus?: Menu[];
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permission_ids?: number[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permission_ids?: number[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

// 权限类型别名
export type PermissionType = 'create' | 'read' | 'update' | 'delete';

export interface CreatePermissionData {
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

export interface UpdatePermissionData {
  name?: string;
  description?: string;
  resource?: string;
  action?: string;
}


// 认证相关类型
export interface UserInfo {
  id: number;
  username: string;
  roles: Role[];
  email?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  permissions?: Permission[];
  signature?: string;
  mood?: string;
  menus?: Menu[];
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

export interface authReducer {
  auth: {
    user: UserInfo | null;
    token: string | null;
  };
}

export interface Menu {
  id: number;
  name: string;
  icon?: string;
  path: string;
  order: number;
  parent_id: number;
  created_at?: string;
  updated_at?: string;
  children?: Menu[];
  roleMenu?: RoleMenu;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface RoleMenu {
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface CreateMenuData {
  name: string;
  icon?: string;
  path: string;
  parent_id: number;
  order: number;
}

export interface UpdateMenuData {
  name?: string;
  icon?: string;
  path?: string;
  parent_id?: number;
  order?: number;
}

export interface DaySentence {
  id: number;
  day_sentence: string;
  auth: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDaySentenceData {
  day_sentence: string;
  auth: string;
}

export interface UpdateDaySentenceData {
  day_sentence?: string;
  auth?: string;
}

// 博客相关类型
export interface BlogData {
  id?: number;
  title: string;
  cover_image?: string;
  content: string;
  summary?: string;
  author_id: number;
  tags?: number[];
  views?: number;
  likes?: number;
  comments_count?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 标签相关类型
export interface TagData {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// 评论相关类型
export interface CommentData {
  id?: number;
  blog_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
  created_at?: string;
  updated_at?: string;
}
