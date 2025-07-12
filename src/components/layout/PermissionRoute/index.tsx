import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import { selectUser } from '../../../store/slices/authSlice';
import { PermissionType } from '../../../types';
import { hasActionPermission } from '../../../utils/menuUtils';

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionType;
  fallbackPath?: string;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({ 
  children, 
  requiredPermission,
  fallbackPath = '/dashboard'
}) => {
  const user = useAppSelector(selectUser);
  
  // 如果没有设置权限要求，直接渲染
  if (!requiredPermission) {
    return <>{children}</>;
  }
  
  const hasPermission = hasActionPermission(user?.menus || [], requiredPermission);
  
  if (!hasPermission) {
    // 权限不足，重定向到指定页面
    return <Navigate to={fallbackPath} replace />;
  }
  
  // 有权限，渲染子组件
  return <>{children}</>;
};

export default PermissionRoute; 