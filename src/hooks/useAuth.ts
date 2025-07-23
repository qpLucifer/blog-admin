import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  loginUser,
  logoutUser,
  initializeAuth,
  selectUser,
  selectIsAuthenticated,
  selectLoading,
} from '../store/slices/authSlice';
import { LoginCredentials } from '../types';

/**
 * 认证相关的自定义 Hook
 * 整合了登录、登出、用户信息等认证相关功能
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectLoading);

  // 登录
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await dispatch(loginUser(credentials)).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message || '登录失败' };
      }
    },
    [dispatch]
  );

  // 登出
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || '登出失败' };
    }
  }, [dispatch]);

  // 初始化认证状态
  const initialize = useCallback(async () => {
    try {
      await dispatch(initializeAuth()).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || '初始化失败' };
    }
  }, [dispatch]);

  return {
    // 状态
    user,
    isAuthenticated,
    loading,

    // 方法
    login,
    logout,
    initialize,
  };
}
