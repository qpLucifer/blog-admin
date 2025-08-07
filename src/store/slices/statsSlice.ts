import { createSlice } from '@reduxjs/toolkit';
const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    onlineUsers: 0,
    totalBlogs: 0,
    totalViews: 0,
    pendingComments: 0,
    errorLogs: 0,
  },
  reducers: {
    setStats: (state, action) => {
      state.onlineUsers = action.payload.onlineUsers;
      state.totalBlogs = action.payload.totalBlogs;
      state.totalViews = action.payload.totalViews;
      state.pendingComments = action.payload.pendingComments;
      state.errorLogs = action.payload.errorLogs;
    },
  },
});

export const { setStats } = statsSlice.actions;
export const selectStats = (state: any) => state.stats;
export default statsSlice.reducer;
