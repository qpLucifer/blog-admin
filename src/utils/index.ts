// 重新导出认证相关工具函数
export { 
  getToken, 
  setToken, 
  removeToken, 
  isAuthenticated, 
  getUserInfo, 
  setUserInfo, 
  getUserPermissions, 
  setUserPermissions, 
  hasPermission as hasPermissionUtil, 
  hasRole, 
  clearAuth, 
  handleLogin, 
  handleLogout 
} from './auth';

export * from './authRedux';

// 通用工具函数
export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN');
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('zh-CN');
};

// 权限检查工具（避免与auth.ts中的hasPermission冲突）
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

// 数据验证工具
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 本地存储工具
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
  // 便捷方法
  getToken: () => storage.get('token'),
  setToken: (token: string) => storage.set('token', token),
  removeToken: () => storage.remove('token'),
  getUserInfo: () => storage.get('userInfo'),
  setUserInfo: (userInfo: any) => storage.set('userInfo', userInfo),
  removeUserInfo: () => storage.remove('userInfo'),
}; 