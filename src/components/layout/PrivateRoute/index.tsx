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
  if (!isAuthenticated || !userMenus.length) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // if (ROUTES.DASHBOARD.includes(location.pathname)) return <>{children}</>;

  // 检查是否有权限访问当前路由
  // 支持子路由匹配（如 /dashboard/xxx 也算有权限）
  const hasPermission = userMenus.some(menu => location.pathname.startsWith(menu.path));
  const homePage = location.pathname === '/'
  if (!hasPermission && !homePage) {
    return <Navigate to="/404" state={{ from: location }} replace/>;
  }
  
  // 如果已登录，渲染子组件
  return <>{children}</>;
};

export default PrivateRoute; 