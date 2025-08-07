import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stats: statsReducer,
  },
  // 启用Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
