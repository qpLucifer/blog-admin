import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks';
import { initializeAuth } from '../../../store/slices/authSlice';

const AuthInitializer: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 应用启动时初始化认证状态
    dispatch(initializeAuth());
  }, [dispatch]);

  // 这个组件不渲染任何内容，只负责初始化
  return null;
};

export default AuthInitializer; 