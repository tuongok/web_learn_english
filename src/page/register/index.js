import React, { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined, FacebookFilled } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import './style.css'; 
import registerImg from '../../img/brainn.jpg'; // Dùng chung ảnh với login

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // --- GIẢ LẬP ĐĂNG KÝ SOCIAL ---
  const handleFakeSocialLogin = (platform) => {
    setSocialLoading(true);
    setTimeout(() => {
        setSocialLoading(false);
        const fakeUser = {
            name: platform === 'Google' ? 'Lê Trí Thiện (Google)' : 'Lê Trí Thiện (FB)',
            email: 'letrithien@gmail.com',
            avatar: registerImg,
            role: 'user',
        };
        dispatch(login(fakeUser));
        message.success(`Đăng ký bằng ${platform} thành công!`);
        navigate('/');
    }, 1500);
  };

  // --- GIẢ LẬP ĐĂNG KÝ THƯỜNG ---
  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        const newUser = {
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          avatar: registerImg,
          role: 'user'
        };
        dispatch(login(newUser));
        message.success('Đăng ký tài khoản thành công!');
        navigate('/');
    }, 1000);
  };

  return (
    <div className="auth-page"> {/* Dùng chung class auth-page */}
      
      {/* CỘT TRÁI */}
      <div className="auth-left">
        <div className="auth-left-content">
            <img src={registerImg} alt="English AI" className="hero-img"/>
            <h2>Tham gia cộng đồng English AI</h2>
            <p>Học tập không giới hạn - Kết nối toàn cầu</p>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Tạo tài khoản mới</h1>
          <span className="auth-subtitle">Điền thông tin bên dưới để bắt đầu hành trình.</span>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Email sai định dạng!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng tạo mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block className="btn-auth" loading={loading}>
              Đăng ký tài khoản
            </Button>
          </Form>

          <Divider style={{color: '#999', fontSize: 13}}>Hoặc đăng ký với</Divider>
          
          <div className="social-btn-group">
            <Button 
                block 
                icon={<GoogleOutlined />} 
                loading={socialLoading}
                onClick={() => handleFakeSocialLogin('Google')}
            >
                Google
            </Button>
            <Button 
                block 
                icon={<FacebookFilled style={{color: '#3b5998'}}/>} 
                loading={socialLoading}
                onClick={() => handleFakeSocialLogin('Facebook')}
            >
                Facebook
            </Button>
          </div>

          <div className="auth-action-footer">
             Đã có tài khoản? <NavLink to="/login" className="link-bold">Đăng nhập ngay</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;