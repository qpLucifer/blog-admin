// 认证相关的工具函数

import { Role, UserInfo, Menu } from '../types';


/**
 * 获取当前token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * 设置token
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * 移除token
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): UserInfo | null => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 设置用户信息
 */
export const setUserInfo = (userInfo: UserInfo): void => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};


/**
 * 获取用户菜单
 */
export const getUserMenus = (): Menu[] => {
  const menus = localStorage.getItem('userMenus');
  return menus ? JSON.parse(menus) : [];
};


/**
 * 设置用户菜单
 */
export const setUserMenus = (menus: Menu[]): void => {
  localStorage.setItem('userMenus', JSON.stringify(menus));
};

/**
 * 检查用户是否有指定角色
 */
export const hasRole = (role: Role): boolean => {
  const userInfo = getUserInfo();
  return userInfo?.roles.includes(role) || false;
};

/**
 * 清除所有认证信息
 */
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userMenus');
};

/**
 * 登录处理
 */
export const handleLogin = (loginData: { token: string; user: UserInfo }): void => {
  setToken(loginData.token);
  setUserInfo(loginData.user);
  if (loginData.user.menus) {
    setUserMenus(loginData.user.menus);
  }
};

/**
 * 登出处理
 */
export const handleLogout = (): void => {
  clearAuth();
  window.location.href = '/login';
}; 