import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Row, Col, Avatar, Space, Dropdown, Button } from "antd"; 
import { 
    FacebookFilled, YoutubeFilled, InstagramFilled, 
    MailOutlined, PhoneOutlined, EnvironmentOutlined, 
    LogoutOutlined, UserOutlined, DownOutlined,
    SafetyCertificateFilled 
} from '@ant-design/icons';

// 1. IMPORT REDUX
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice'; // Đảm bảo đường dẫn đúng tới file authSlice

import './style.scss';

function Layout() {
    // 2. LẤY DỮ LIỆU THẬT TỪ REDUX
    // Thay thế dòng const isLogin = false; bằng đoạn này:
    const { isLogin, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 3. HÀM XỬ LÝ ĐĂNG XUẤT
    const handleLogout = () => {
        dispatch(logout()); // Xóa data trong Redux
        navigate('/');      // Chuyển hướng về trang chủ
    };

    // Menu dropdown khi đã đăng nhập
    const userMenu = [
        {
            key: '1',
            label: <NavLink to="/profile">Hồ sơ cá nhân</NavLink>,
        },
        {
            key: '2',
            label: <NavLink to="/my-courses">Khóa học của tôi</NavLink>,
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            // Sửa lại chỗ này để gọi hàm handleLogout khi click
            label: (
                <div onClick={handleLogout} style={{color: 'red', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <LogoutOutlined /> Đăng xuất
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="body">
                <div className="layout__default">
            
            {/* --- HEADER --- */}
            <header className="layout__header">
                <div className="layout__header-container">
                    
                    {/* 1. LOGO */}
                    <div className="layout__logo">
                        <NavLink to="/">English AI</NavLink>
                    </div>

                    {/* 2. MENU GIỮA */}
                    <nav className="layout__menu">
                        <ul>
                            <li><NavLink to="/">Trang chủ</NavLink></li>
                            <li><NavLink to="/conversation">Luyện hội thoại</NavLink></li>
                            {/* Chỉ hiện menu Từ vựng khi đã đăng nhập (Optional) */}
                            {isLogin && <li><NavLink to="/mindmap">Từ vựng</NavLink></li>}
                        </ul>
                    </nav>

                    {/* 3. KHU VỰC TÀI KHOẢN */}
                    <div className="layout__auth">
                        {isLogin ? (
                            // TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP (Lấy dữ liệu thật từ Redux)
                            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                                <Space className="user-info" style={{cursor: 'pointer'}}>
                                    {/* Hiển thị Avatar thật hoặc icon mặc định */}
                                    <Avatar 
                                        src={user?.avatar} 
                                        style={{ backgroundColor: '#0075F3' }} 
                                        icon={<UserOutlined />} 
                                    />
                                    {/* Hiển thị Tên thật */}
                                    <span className="user-name">
                                        {user?.name || "Học viên"} <DownOutlined style={{fontSize: '12px'}}/>
                                    </span>
                                </Space>
                            </Dropdown>
                        ) : (
                            // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP
                            <div className="auth-buttons">
                                <NavLink to="/login" className="link-login">Đăng nhập</NavLink>
                                <NavLink to="/register">
                                    <Button type="primary" shape="round" className="btn-register">
                                        Đăng ký miễn phí
                                    </Button>
                                </NavLink>
                            </div>
                        )}
                    </div>

                </div>
            </header>
            
            <div style={{ height: '80px' }}></div> 

            <main className="layout__main">
                <Outlet />
            </main>

            {/* --- FOOTER STYLE PREP (PHIÊN BẢN WEBSITE) --- */}
                    <footer className="layout__footer auto-hide"> 
                        <div className="layout__footer-container">
                            
                            {/* PHẦN TRÊN: CÁC CỘT LIÊN KẾT */}
                            <div className="footer-top">
                                <Row gutter={[40, 40]}>
                                    <Col xs={24} sm={12} md={7}>
                                        <div className="layout__footer-logo" style={{ color: '#0075F3', fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>
                                            English AI
                                        </div>
                                        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                            Nền tảng học tiếng Anh trực tuyến ứng dụng công nghệ AI, giúp học viên tối ưu hóa lộ trình và bứt phá kỹ năng giao tiếp.
                                        </p>
                                        <h4>KẾT NỐI VỚI CHÚNG TÔI</h4>
                                        <Space size="middle">
                                            <Button shape="circle" icon={<FacebookFilled />} />
                                            <Button shape="circle" icon={<YoutubeFilled />} />
                                            <Button shape="circle" icon={<InstagramFilled />} />
                                        </Space>
                                    </Col>

                                    <Col xs={24} sm={12} md={5}>
                                        <h4>CHƯƠNG TRÌNH HỌC</h4>
                                        <ul className="footer-links">
                                            <li><NavLink to="/conversation">Luyện hội thoại AI</NavLink></li>
                                            <li><NavLink to="/mindmap">Từ vựng Mindmap</NavLink></li>
                                            <li><NavLink to="#">Tiếng Anh cơ bản</NavLink></li>
                                            <li><NavLink to="#">Luyện phát âm chuẩn</NavLink></li>
                                        </ul>
                                    </Col>

                                    <Col xs={24} sm={12} md={6}>
                                        <h4>HỖ TRỢ KHÁCH HÀNG</h4>
                                        <ul className="footer-links">
                                            <li><NavLink to="#">Hướng dẫn học tập</NavLink></li>
                                            <li><NavLink to="#">Kích hoạt mã Premium</NavLink></li>
                                            <li><NavLink to="#">Câu hỏi thường gặp (FAQs)</NavLink></li>
                                            <li><NavLink to="#">Chính sách hoàn tiền</NavLink></li>
                                        </ul>
                                    </Col>

                                    <Col xs={24} sm={12} md={6}>
                                        <h4>VỀ CHÚNG TÔI</h4>
                                        <ul className="footer-links">
                                            <li><NavLink to="/about">Câu chuyện thương hiệu</NavLink></li>
                                            <li><NavLink to="#">Chính sách bảo mật</NavLink></li>
                                            <li><NavLink to="#">Điều khoản dịch vụ</NavLink></li>
                                            <li><NavLink to="#">Liên hệ</NavLink></li>
                                        </ul>
                                    </Col>
                                </Row>
                            </div>

                            <div className="footer-divider"></div>

                            {/* PHẦN DƯỚI: THÔNG TIN PHÁP LÝ & CÔNG TY */}
                            <div className="footer-bottom">
                                <Row gutter={[40, 20]}>
                                    <Col xs={24} md={14}>
                                        <h5>CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC ENGLISH AI</h5>
                                        <p><strong>Mã số doanh nghiệp:</strong> 0123456789 do Sở Kế hoạch và Đầu tư TP.HCM cấp.</p>
                                        <p><strong>Địa chỉ:</strong> Tòa nhà English AI, Đặng Thùy Trâm, Phường 13, Quận Bình Thạnh, TP. Hồ Chí Minh.</p>
                                        <p><strong>Đại diện pháp luật:</strong> Đặng Anh Tường.</p>
                                    </Col>
                                    <Col xs={24} md={10}>
                                        <h5>TRUNG TÂM NGOẠI NGỮ ENGLISH AI</h5>
                                        <p><PhoneOutlined /> <strong>Hotline:</strong> +84 942 217 271 (8:00 - 21:00)</p>
                                        <p><MailOutlined /> <strong>Email:</strong> danganhtuongg@gmail.com</p>
                                        <div className="cert-logos">
                                            <Space size="large">
                                                <div className="bct-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <SafetyCertificateFilled style={{ fontSize: 28, color: '#13c2c2' }} />
                                                    <span style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG</span>
                                                </div>
                                            </Space>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            
                            <div className="layout__footer-copyright" style={{ textAlign: 'center', marginTop: '30px', color: '#bbb', fontSize: '12px' }}>
                                © 2025 English AI. All rights reserved. @Copyright by Dang Anh Tuongg
                            </div>
                        </div>
                    </footer>

                </div>
            </div>
        </>
    );
}

export default Layout;