// 认证相关的工具函数

export interface UserInfo {
  id: number;
  username: string;
  roles: string[];
  permissions?: string[];
}

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
 * 获取用户权限
 */
export const getUserPermissions = (): string[] => {
  const permissions = localStorage.getItem('userPermissions');
  return permissions ? JSON.parse(permissions) : [];
};

/**
 * 设置用户权限
 */
export const setUserPermissions = (permissions: string[]): void => {
  localStorage.setItem('userPermissions', JSON.stringify(permissions));
};

/**
 * 检查用户是否有指定权限
 */
export const hasPermission = (permission: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

/**
 * 检查用户是否有指定角色
 */
export const hasRole = (role: string): boolean => {
  const userInfo = getUserInfo();
  return userInfo?.roles.includes(role) || false;
};

/**
 * 清除所有认证信息
 */
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userPermissions');
};

/**
 * 登录处理
 */
export const handleLogin = (loginData: { token: string; user: UserInfo }): void => {
  setToken(loginData.token);
  setUserInfo(loginData.user);
  if (loginData.user.permissions) {
    setUserPermissions(loginData.user.permissions);
  }
};

/**
 * 登出处理
 */
export const handleLogout = (): void => {
  clearAuth();
  window.location.href = '/login';
}; 