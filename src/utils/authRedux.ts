// 基于Redux的认证工具函数

import { store } from '../store';
import { selectUser, selectToken, selectIsAuthenticated } from '../store/slices/authSlice';
import { Permission,Role } from '../types';

/**
 * 获取当前token
 */
export const getToken = (): string | null => {
  return selectToken(store.getState());
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return selectIsAuthenticated(store.getState());
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return selectUser(store.getState());
};

/**
 * 获取用户权限
 */
export const getUserPermissions = (): Permission[] => {
  const user = selectUser(store.getState());
  return user?.permissions || [];
};

/**
 * 检查用户是否有指定权限
 */
export const hasPermission = (permission: Permission): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

/**
 * 检查用户是否有指定角色
 */
export const hasRole = (role: Role): boolean => {
  const user = getUserInfo();
  return user?.roles.includes(role) || false;
};

/**
 * 清除所有认证信息
 */
export const clearAuth = (): void => {
  // 通过dispatch清除认证状态
  store.dispatch({ type: 'auth/logoutUser/fulfilled', payload: true });
};

/**
 * 登出处理
 */
export const handleLogout = (): void => {
  clearAuth();
  window.location.href = '/login';
}; 