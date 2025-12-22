import { createSlice } from '@reduxjs/toolkit';

// 1. Tối ưu: Lấy dữ liệu ngay khi khởi tạo để F5 không bị mất login
const userFromStorage = localStorage.getItem('user');
const userParsed = userFromStorage ? JSON.parse(userFromStorage) : null;

const initialState = {
  isLogin: !!userParsed, // true nếu có user, false nếu null
  user: userParsed,
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
    checkAuth: (state) => {
      const user = localStorage.getItem('user');
      if (user) {
        state.isLogin = true;
        state.user = JSON.parse(user);
      }
    },
    // --- BỔ SUNG HÀM updateUser ---
    updateUser: (state, action) => {
      // Gộp thông tin cũ (email, id...) với thông tin mới (avatar, name...)
      state.user = { ...state.user, ...action.payload };
      // Lưu lại vào LocalStorage để F5 vẫn giữ thông tin mới
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
});

// --- QUAN TRỌNG: PHẢI CÓ 'updateUser' Ở DÒNG DƯỚI NÀY THÌ PROFILE MỚI DÙNG ĐƯỢC ---
export const { login, logout, checkAuth, updateUser } = authSlice.actions;

export default authSlice.reducer;