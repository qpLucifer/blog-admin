import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as loginApi, logout } from '../../api/login';
import { handleLogin, clearAuth } from '../../utils/auth';
import { UserInfo, LoginCredentials, LoginResponse, Permission } from '../../types';


// 认证状态接口
interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'), // 从localStorage恢复token
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// 异步登录action
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      const loginData = response as unknown as LoginResponse;
      handleLogin(loginData); // 用工具函数
      return loginData;
    } catch (error: any) {
      return rejectWithValue(error?.message || '登录失败');
    }
  }
);

// 异步登出action
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout(); // 用工具函数
      clearAuth(); // 用工具函数
      return true;
    } catch (error: any) {
      return rejectWithValue('登出失败');
    }
  }
);

// 初始化用户信息action
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    
    if (token) {
      // 从localStorage恢复用户信息
      const userInfo = localStorage.getItem('userInfo');
      const userPermissions = localStorage.getItem('userPermissions');
      
      if (userInfo) {
        const user = JSON.parse(userInfo);
        if (userPermissions) {
          user.permissions = JSON.parse(userPermissions);
        }
        return user;
      }
    }
    
    return null;
  }
);

// 创建slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },
    
    // 更新用户信息
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // 同步到localStorage
        localStorage.setItem('userInfo', JSON.stringify(state.user));
      }
    },
    
    // 更新用户权限
    updateUserPermissions: (state, action: PayloadAction<Permission[]>) => {
      if (state.user) {
        state.user.permissions = action.payload;
        // 同步到localStorage
        localStorage.setItem('userPermissions', JSON.stringify(action.payload));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 登出
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 初始化
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      });
  },
});

// 导出actions
export const { clearError, updateUserInfo, updateUserPermissions } = authSlice.actions;

// 导出selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserMenus = (state: { auth: AuthState }) => state.auth.user?.menus || [];


// 导出reducer
export default authSlice.reducer; 