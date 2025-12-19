import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './redux/authSlice'; // Import hàm kiểm tra đăng nhập
import Allroutes from './components/allroutes';
import './App.css';

function App() {
  const dispatch = useDispatch();

  // useEffect này chạy 1 lần duy nhất khi web vừa tải xong
  useEffect(() => {
    // Gọi hàm checkAuth để xem trong LocalStorage có lưu user không
    // Nếu có -> Tự động set isLogin = true
    dispatch(checkAuth()); 
  }, [dispatch]);

  return (
    <>
      <Allroutes />
    </>
  );
}

export default App;