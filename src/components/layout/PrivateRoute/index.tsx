import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import { selectIsAuthenticated, selectUserMenus } from '../../../store/slices/authSlice';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userMenus = useAppSelector(selectUserMenus);
  
  // 检查是否已登录
  if (!isAuthenticated || !userMenus.length) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // 检查是否有权限访问当前路由
  const hasPermission = userMenus.some(menu => menu.path === location.pathname);
  if (!hasPermission) {
    return <Navigate to="/404" state={{ from: location }} replace/>;
  }
  
  // 如果已登录，渲染子组件
  return <>{children}</>;
};

export default PrivateRoute; 