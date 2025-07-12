import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import { selectIsAuthenticated, selectUserMenus } from '../../../store/slices/authSlice';
import { hasRoutePermission } from '../../../utils/menuUtils';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userMenus = useAppSelector(selectUserMenus);  
  if (!isAuthenticated || !userMenus.length) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const hasPermission = hasRoutePermission(userMenus, location.pathname);
  const homePage = location.pathname === '/';
  if (!hasPermission && !homePage) {
    return <Navigate to="/404" state={{ from: location }} replace/>;
  }
  
  // 如果已登录，渲染子组件
  return <>{children}</>;
};

export default PrivateRoute; 