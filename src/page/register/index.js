import React from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice'; // Đăng ký xong tự login luôn
import './style.css'; 
import registerImg from '../../img/thienle.jpg'; // Dùng lại ảnh cũ hoặc ảnh khác

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    // 1. Kiểm tra mật khẩu xác nhận (Nếu bạn muốn làm kỹ)
    // Ở đây mình giả lập đăng ký thành công luôn
    
    const newUser = {
      name: values.fullName,
      email: values.email,
      phone: values.phone,
      avatar: registerImg, // Mặc định có avatar luôn
      role: 'user'
    };

    // 2. Tự động đăng nhập luôn cho tiện
    dispatch(login(newUser));
    
    message.success('Đăng ký tài khoản thành công!');
    navigate('/'); // Về trang chủ
  };

  return (
    <div className="register-page">
      
      {/* CỘT TRÁI */}
      <div className="register-left">
        <img src={registerImg} alt="English AI" />
        <h2>Tham gia cộng đồng English AI</h2>
        <p style={{color: '#666', marginTop: 10}}>Học tập không giới hạn - Kết nối toàn cầu</p>
      </div>

      {/* CỘT PHẢI */}
      <div className="register-right">
        <div className="register-form-container">
          <h1>Tạo tài khoản mới</h1>
          <span className="sub-text">Điền thông tin bên dưới để bắt đầu hành trình.</span>

          <Form
            layout="vertical"
            onFinish={onFinish}
            size="large"
          >
            {/* Họ và tên */}
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ và tên của bạn" />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              name="phone"
              rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              rules={[
                  { required: true, message: 'Vui lòng nhập Email!' },
                  { type: 'email', message: 'Email không đúng định dạng!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Địa chỉ Email" />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng tạo mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            {/* Nút Đăng ký */}
            <Button type="primary" htmlType="submit" block className="btn-register">
              Đăng ký tài khoản
            </Button>
          </Form>

          <Divider style={{color: '#999', fontSize: 13}}>Hoặc đăng ký với</Divider>
          <Button block icon={<GoogleOutlined />}>Đăng ký bằng Google</Button>

          <div className="auth-actions">
             Đã có tài khoản? <NavLink to="/login" style={{marginLeft: 5}}>Đăng nhập ngay</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;