import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import { selectIsAuthenticated } from '../../../store/slices/authSlice';
import { PublicRouteProps } from '../../../types';

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // 如果已经登录，重定向到仪表板
  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  // 如果未登录，渲染子组件
  return <>{children}</>;
};

export default PublicRoute;
