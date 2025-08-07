import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StatsState {
  onlineUsers: number;
  totalBlogs: number;
  totalViews: number;
  pendingComments: number;
  errorLogs: number;
}

const initialState: StatsState = {
  onlineUsers: 0,
  totalBlogs: 0,
  totalViews: 0,
  pendingComments: 0,
  errorLogs: 0,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    // 更新完整统计数据
    setStats: (state, action: PayloadAction<StatsState>) => {
      return { ...state, ...action.payload };
    },

    // 更新在线用户数
    updateOnlineUsers: (state, action: PayloadAction<number>) => {
      state.onlineUsers = action.payload;
    },

    // 更新博客统计
    updateBlogStats: (state, action: PayloadAction<{ totalBlogs: number; totalViews: number }>) => {
      state.totalBlogs = action.payload.totalBlogs;
      state.totalViews = action.payload.totalViews;
    },

    // 更新错误日志数量
    updateErrorLogs: (state, action: PayloadAction<number>) => {
      state.errorLogs = action.payload;
    },

    // 重置统计数据
    resetStats: () => initialState,
  },
});

export const { setStats, updateOnlineUsers, updateBlogStats, updateErrorLogs, resetStats } =
  statsSlice.actions;

export const selectStats = (state: { stats: StatsState }) => state.stats;
export const selectOnlineUsers = (state: { stats: StatsState }) => state.stats.onlineUsers;
export const selectErrorLogs = (state: { stats: StatsState }) => state.stats.errorLogs;

export default statsSlice.reducer;
