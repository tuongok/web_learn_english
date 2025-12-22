import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookFilled } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import ForgotPasswordModal from '../Forgot_Password_Modal'; 
import './style.css';
import loginImg from '../../img/brainn.jpg'; // Ảnh trang trí cho trang login
import defaultUserAvatar from '../../img/avatar.jpg'; // Ảnh đại diện mặc định cho user

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [socialLoading, setSocialLoading] = useState(false); 

  // --- GIẢ LẬP ĐĂNG NHẬP SOCIAL ---
  const handleFakeSocialLogin = (platform) => {
    setSocialLoading(true);
    // Giả vờ đợi 1.5 giây
    setTimeout(() => {
        setSocialLoading(false);
        const fakeUser = {
            name: platform === 'Google' ? 'Lê Trí Thiện (Google)' : 'Lê Trí Thiện (FB)',
            email: 'letrithien@gmail.com',
            avatar: defaultUserAvatar, 
            role: 'user',
        };
        dispatch(login(fakeUser));
        message.success(`Đăng nhập bằng ${platform} thành công!`);
        navigate('/');
    }, 1500);
  };

  // --- GIẢ LẬP ĐĂNG NHẬP THƯỜNG ---
  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        if (values.username && values.password) {
            const fakeUser = {
                name: 'Lê Trí Thiện',
                email: values.username,
                avatar: defaultUserAvatar, 
                role: 'user'
            };
            dispatch(login(fakeUser));
            message.success('Đăng nhập thành công!');
            navigate('/');
        }
    }, 1000);
  };

  return (
    <div className="auth-page"> 
      
      {/* CỘT TRÁI */}
      <div className="auth-left">
        <div className="auth-left-content">
            <img src={loginImg} alt="English AI" className="hero-img"/>
            <h2>Học tiếng Anh cùng AI</h2>
            <p>Lộ trình cá nhân hóa - Bứt phá mọi kỹ năng</p>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Đăng nhập</h1>
          <span className="auth-subtitle">Chào mừng bạn quay trở lại!</span>

          <Form
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            style={{ marginTop: 20 }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email hoặc SĐT" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
              <div className="auth-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>
                <a className="forgot-pass-link" onClick={() => setIsModalOpen(true)}>
                    Quên mật khẩu?
                </a>
              </div>
            </Form.Item>

            <Button type="primary" htmlType="submit" block className="btn-auth" loading={loading}>
              Đăng nhập
            </Button>
          </Form>

          <Divider style={{color: '#999', fontSize: 13}}>Hoặc tiếp tục với</Divider>
          
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
             Chưa có tài khoản? <NavLink to="/register" className="link-bold">Đăng ký ngay</NavLink>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Login;