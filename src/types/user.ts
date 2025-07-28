/**
 * 用户相关类型定义
 * 包含用户、角色、权限、认证等相关类型
 */

import { BaseEntity } from './common';

// 用户基础信息
export interface User extends BaseEntity {
  username: string;
  email?: string;
  roles?: { id: number; name: string }[];
  is_active: boolean;
  signature?: string;
  mood?: string;
}

// 创建用户数据
export interface CreateUserData {
  username: string;
  password: string;
  email?: string;
  role_ids?: number[];
  status?: number;
}

// 更新用户数据
export interface UpdateUserData {
  username?: string;
  email?: string;
  role_ids?: number[];
  status?: number;
}

// 角色信息
export interface Role {
  id: number | string;
  name: string;
  description?: string;
  menus?: Menu[];
}

// 创建角色数据
export interface CreateRoleData {
  name: string;
  description?: string;
  permission_ids?: number[];
}

// 更新角色数据
export interface UpdateRoleData {
  name?: string;
  description?: string;
  permission_ids?: number[];
}

// 权限信息
export interface Permission {
  id: number;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

// 创建权限数据
export interface CreatePermissionData {
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

// 更新权限数据
export interface UpdatePermissionData {
  name?: string;
  description?: string;
  resource?: string;
  action?: string;
}

// 用户详细信息（包含权限）
export interface UserInfo extends BaseEntity {
  username: string;
  roles: Role[];
  email?: string;
  is_active: boolean;
  permissions?: Permission[];
  signature?: string;
  mood?: string;
  menus?: Menu[];
}

// 登录凭据
export interface LoginCredentials {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: UserInfo;
}

// 菜单信息
export interface Menu extends BaseEntity {
  name: string;
  icon?: string;
  path: string;
  order: number;
  parent_id: number;
  children?: Menu[];
  roleMenu?: RoleMenu;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

// 角色菜单权限
export interface RoleMenu {
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

// 创建菜单数据
export interface CreateMenuData {
  name: string;
  icon?: string;
  path: string;
  parent_id: number;
  order: number;
}

// 更新菜单数据
export interface UpdateMenuData {
  name?: string;
  icon?: string;
  path?: string;
  parent_id?: number;
  order?: number;
}

// 认证状态类型
export interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Redux认证状态类型
export interface AuthReducer {
  auth: {
    user: UserInfo | null;
    token: string | null;
  };
}

// 用户查询参数
export interface UserQueryParams {
  currentPage?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  is_active?: number;
}

// 角色查询参数
export interface RoleQueryParams {
  currentPage?: number;
  pageSize?: number;
  name?: string;
  description?: string;
}

// 权限查询参数
export interface PermissionQueryParams {
  currentPage?: number;
  pageSize?: number;
  name?: string;
  resource?: string;
  action?: string;
}

// 菜单查询参数
export interface MenuQueryParams {
  currentPage?: number;
  pageSize?: number;
  name?: string;
  path?: string;
  parent_id?: number;
}
