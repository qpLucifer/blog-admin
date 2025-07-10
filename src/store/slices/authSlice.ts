import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as loginApi, logout } from '../../api/login';
import { handleLogin, clearAuth } from '../../utils/auth';
import { UserInfo, LoginCredentials, LoginResponse, Permission, Menu } from '../../types';


// 认证状态接口
interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userMenus: Menu[] | [];
}

// 初始状态
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'), // 从localStorage恢复token
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  userMenus: localStorage.getItem('userMenus') ? JSON.parse(localStorage.getItem('userMenus') || '[]') : [],
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
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    const userMenus = localStorage.getItem('userMenus');
    if (token && userInfo) {
      const user = JSON.parse(userInfo);
      if (userMenus) {
        user.menus = JSON.parse(userMenus);
      }
      return { user, token };
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

    updateMenuPermissions: (state, action: PayloadAction<Menu[]>) => {
      if (state.user) {
        state.user.menus = action.payload;
        // 同步到localStorage
        localStorage.setItem('userMenus', JSON.stringify(action.payload));
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
        state.userMenus = action.payload.user.menus || [];
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
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.userMenus = action.payload.user.menus || [];
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
export const { clearError, updateUserInfo, updateMenuPermissions } = authSlice.actions;


// 导出selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserMenus = (state: { auth: AuthState }) => state.auth.userMenus || [];


// 导出reducer
export default authSlice.reducer; 