import React, { useState } from 'react';
import { Modal, Steps, Form, Input, Button, message, Result } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;

function ForgotPasswordModal({ isVisible, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(''); // Lưu email để gửi OTP

    // Form instances để reset khi cần
    const [formEmail] = Form.useForm();
    const [formOTP] = Form.useForm();
    const [formPassword] = Form.useForm();

    // --- XỬ LÝ BƯỚC 1: KIỂM TRA EMAIL ---
    const handleCheckEmail = (values) => {
        setLoading(true);
        // GIẢ LẬP GỌI API CHECK EMAIL
        setTimeout(() => {
            setLoading(false);
            // Giả sử chỉ có email này là đúng
            if (values.email === 'admin@gmail.com') { 
                setEmail(values.email);
                message.success('Mã OTP đã được gửi đến email của bạn!');
                setCurrentStep(1); // Chuyển sang bước nhập OTP
            } else {
                message.error('Bạn đã nhập sai thông tin. Email không tồn tại!');
            }
        }, 1500);
    };

    // --- XỬ LÝ BƯỚC 2: KIỂM TRA OTP ---
    const handleCheckOTP = (values) => {
        setLoading(true);
        // GIẢ LẬP GỌI API CHECK OTP
        setTimeout(() => {
            setLoading(false);
            if (values.otp === '123456') { // Giả sử OTP đúng là 123456
                message.success('Xác thực thành công!');
                setCurrentStep(2); // Chuyển sang bước đổi mật khẩu
            } else {
                message.error('Mã OTP không chính xác!');
            }
        }, 1000);
    };

    // --- XỬ LÝ BƯỚC 3: ĐỔI MẬT KHẨU ---
    const handleResetPassword = (values) => {
        setLoading(true);
        // GIẢ LẬP GỌI API CẬP NHẬT PASS
        setTimeout(() => {
            setLoading(false);
            message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            handleClose(); // Đóng modal
        }, 1500);
    };

    const handleClose = () => {
        // Reset lại toàn bộ trạng thái khi tắt popup
        setCurrentStep(0);
        formEmail.resetFields();
        formOTP.resetFields();
        formPassword.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Khôi Phục Mật Khẩu"
            open={isVisible}
            onCancel={handleClose}
            footer={null} // Tắt nút mặc định để dùng nút trong form
            maskClosable={false} // Bắt buộc bấm X mới tắt
        >
            {/* THANH TIẾN TRÌNH */}
            <Steps current={currentStep} style={{ marginBottom: 30 }} size="small">
                <Step title="Xác minh" icon={<UserOutlined />} />
                <Step title="OTP" icon={<SafetyCertificateOutlined />} />
                <Step title="Đổi Pass" icon={<LockOutlined />} />
            </Steps>

            {/* --- NỘI DUNG TỪNG BƯỚC --- */}
            
            {/* BƯỚC 1: NHẬP EMAIL */}
            {currentStep === 0 && (
                <Form form={formEmail} layout="vertical" onFinish={handleCheckEmail}>
                    <p>Vui lòng nhập Email hoặc SĐT bạn đã đăng ký để nhận mã xác thực.</p>
                    <Form.Item 
                        name="email" 
                        label="Email / Số điện thoại" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập thông tin!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="admin@gmail.com" size="large" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} size="large">
                        Gửi mã OTP
                    </Button>
                </Form>
            )}

            {/* BƯỚC 2: NHẬP OTP */}
            {currentStep === 1 && (
                <Form form={formOTP} layout="vertical" onFinish={handleCheckOTP}>
                    <p>Mã OTP đã được gửi về: <strong>{email}</strong></p>
                    <Form.Item 
                        name="otp" 
                        label="Nhập mã OTP (6 số)" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập OTP!' },
                            { len: 6, message: 'OTP phải có 6 ký tự!' }
                        ]}
                    >
                        <Input 
                            prefix={<SafetyCertificateOutlined />} 
                            placeholder="123456" 
                            size="large" 
                            style={{ letterSpacing: 5, textAlign: 'center', fontWeight: 'bold' }}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} size="large">
                        Xác nhận
                    </Button>
                    <div style={{ marginTop: 10, textAlign: 'center' }}>
                        <Button type="link" onClick={() => setCurrentStep(0)}>Gửi lại mã?</Button>
                    </div>
                </Form>
            )}

            {/* BƯỚC 3: ĐẶT MẬT KHẨU MỚI */}
            {currentStep === 2 && (
                <Form form={formPassword} layout="vertical" onFinish={handleResetPassword}>
                    <Form.Item 
                        name="password" 
                        label="Mật khẩu mới" 
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" size="large" />
                    </Form.Item>
                    
                    <Form.Item 
                        name="confirm" 
                        label="Nhập lại mật khẩu" 
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" size="large" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading} size="large">
                        Đổi mật khẩu
                    </Button>
                </Form>
            )}
        </Modal>
    );
}

export default ForgotPasswordModal;