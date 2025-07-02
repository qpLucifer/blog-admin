import React from 'react';
import { useAppSelector } from '../../../hooks';
import { selectUser } from '../../../store/slices/authSlice';
import { Permission, Role } from '../../../types';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: Permission;
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
  
  // 检查权限
  if (permission) {
    const hasPermission = user?.permissions?.includes(permission) || false;
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