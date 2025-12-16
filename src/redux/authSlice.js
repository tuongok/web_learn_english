import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
      localStorage.removeItem('user');
    },
    // Hàm này để giữ trạng thái đăng nhập khi F5
    checkAuth: (state) => {
      const user = localStorage.getItem('user');
      if (user) {
        state.isLogin = true;
        state.user = JSON.parse(user);
      }
    }
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;