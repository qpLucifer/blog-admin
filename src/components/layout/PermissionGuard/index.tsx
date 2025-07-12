import React from 'react';
import { useAppSelector } from '../../../hooks';
import { selectUser } from '../../../store/slices/authSlice';
import { PermissionType, Role } from '../../../types';
import { hasActionPermission } from '../../../utils/menuUtils';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: PermissionType;
  role?: Role;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  permission, 
  role,
  fallback = null 
}) => {
  const user = useAppSelector(selectUser);
  
  // 如果没有设置权限和角色要求，直接渲染
  if (!permission && !role) {
    return <>{children}</>;
  }
  
  if (permission) {
    const hasPermission = hasActionPermission(user?.menus || [], permission);
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }
  
  // 检查角色
  if (role) {
    const hasRole = user?.roles?.includes(role) || false;
    if (!hasRole) {
      return <>{fallback}</>;
    }
  }
  
  // 有权限或角色，渲染子组件
  return <>{children}</>;
};

export default PermissionGuard; 