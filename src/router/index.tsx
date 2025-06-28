import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styles from './index.module.css';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Users = lazy(() => import('../pages/Users'));
const Roles = lazy(() => import('../pages/Roles'));
const Permissions = lazy(() => import('../pages/Permissions'));
const Menus = lazy(() => import('../pages/Menus'));
const DaySentence = lazy(() => import('../pages/DaySentence'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));

const AppRouter = () => (
  <Router>
    <Suspense fallback={<div className={styles.loading}>加载中...</div>}>
      <Routes>
        {/* 公共路由 - 登录页 */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* 受保护的路由 */}
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="menus" element={<Menus />} />
          <Route path="day-sentence" element={<DaySentence />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* 404页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter; 