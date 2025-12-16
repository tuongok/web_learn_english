import React from 'react';
import { Form, Input, Button, Checkbox, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookFilled } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import './style.css'; // Đã đổi thành CSS
import loginImg from '../../img/thienle.jpg'; // Thay ảnh minh họa của bạn vào đây

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    // Logic giả lập đăng nhập
    if (values.username && values.password) {
      const fakeUser = {
        name: 'Tường Đặng', // Tên giả
        email: values.username,
        avatar: loginImg,
        role: 'user'
      };
      
      // 1. Gửi dữ liệu vào Redux Store
      dispatch(login(fakeUser));
      
      // 2. Thông báo & Chuyển trang
      message.success('Đăng nhập thành công!');
      navigate('/');
    }
  };

  const onFinishFailed = () => {
    message.error('Vui lòng kiểm tra lại thông tin!');
  };

  return (
    <div className="login-page">
      
      {/* CỘT TRÁI */}
      <div className="login-left">
        <img src={loginImg} alt="English AI" />
        <h2>Học tiếng Anh cùng AI</h2>
        <p style={{color: '#666', marginTop: 10}}>Lộ trình cá nhân hóa - Bứt phá mọi kỹ năng</p>
      </div>

      {/* CỘT PHẢI */}
      <div className="login-right">
        <div className="login-form-container">
          <h1>Đăng nhập</h1>
          <span className="sub-text">Chào mừng bạn quay trở lại!</span>

          <Form
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
          >
            {/* Username */}
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email hoặc Số điện thoại" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            {/* Remember & Forgot Pass */}
            <Form.Item>
              <div className="auth-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>
                <NavLink to="/forgot-password">Quên mật khẩu?</NavLink>
              </div>
            </Form.Item>

            {/* Submit Button */}
            <Button type="primary" htmlType="submit" block className="btn-login">
              Đăng nhập
            </Button>
          </Form>

          {/* Social Login */}
          <Divider style={{color: '#999', fontSize: 13}}>Hoặc tiếp tục với</Divider>
          <div style={{display: 'flex', gap: 15}}>
            <Button block icon={<GoogleOutlined />}>Google</Button>
            <Button block icon={<FacebookFilled style={{color: '#3b5998'}}/>}>Facebook</Button>
          </div>

          <div className="auth-actions">
             Chưa có tài khoản? <NavLink to="/register" style={{marginLeft: 5}}>Đăng ký ngay</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;