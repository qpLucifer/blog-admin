import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/layout/PrivateRoute';
import PublicRoute from '../components/layout/PublicRoute';
import { RouteLoading } from '../components';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Users = lazy(() => import('../pages/Users'));
const Roles = lazy(() => import('../pages/Roles'));
const Menus = lazy(() => import('../pages/Menus'));
const DaySentence = lazy(() => import('../pages/DaySentence'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const Blogs = lazy(() => import('../pages/Blogs'));
const Comments = lazy(() => import('../pages/Comments'));
const Tags = lazy(() => import('../pages/Tags'));
const EditBlog = lazy(() => import('../pages/Blogs/Edit'));

const AppRouter = () => (
  <Router>
    <Suspense fallback={<RouteLoading tip='页面加载中，请稍候...' />}>
      <Routes>
        {/* 公共路由 - 登录页 */}
        <Route
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 受保护的路由 */}
        <Route
          path='/'
          element={
            <PrivateRoute>
              {' '}
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to='dashboard' replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='system/users' element={<Users />} />
          <Route path='system/roles' element={<Roles />} />
          <Route path='system/menus' element={<Menus />} />
          <Route path='day-sentence' element={<DaySentence />} />
          <Route path='profile' element={<Profile />} />
          <Route path='blogsManage/blogs' element={<Blogs />} />
          <Route path='blogsManage/blogs/new' element={<EditBlog />} />
          <Route path='blogsManage/blogs/edit/:id' element={<EditBlog />} />
          <Route path='blogsManage/comments' element={<Comments />} />
          <Route path='blogsManage/tags' element={<Tags />} />
        </Route>
        {/* 404页面，放在所有路由最后 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter;
