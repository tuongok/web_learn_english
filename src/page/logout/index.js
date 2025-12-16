import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice'; // Import hành động logout

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Thực hiện hành động đăng xuất (Xóa Redux + LocalStorage)
    dispatch(logout());

    // 2. Chuyển hướng ngay lập tức về trang đăng nhập (hoặc trang chủ)
    navigate('/login'); 
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // Giao diện tạm thời trong tích tắc trước khi chuyển trang
    <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        fontSize: '20px',
        color: '#666'
    }}>
      Đang đăng xuất...
    </div>
  );
}

export default Logout;