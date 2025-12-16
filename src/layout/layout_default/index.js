import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Row, Col, Avatar, Space, Dropdown, Button } from "antd"; 
import { 
    FacebookFilled, YoutubeFilled, InstagramFilled, 
    MailOutlined, PhoneOutlined, EnvironmentOutlined, 
    LogoutOutlined, UserOutlined, DownOutlined 
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

            {/* --- FOOTER GIỮ NGUYÊN --- */}
            <footer className="layout__footer">
                <div className="layout__footer-container">
                    <Row gutter={[40, 40]}>
                        <Col xs={24} sm={12} md={8}>
                            <div className="layout__footer-logo">English AI</div>
                            <p className="layout__footer-desc">
                                Nền tảng học tiếng Anh thông minh, giúp bạn bứt phá kỹ năng giao tiếp.
                            </p>
                            <div className="layout__footer-socials">
                                <FacebookFilled /> <YoutubeFilled /> <InstagramFilled />
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <h4>Liên kết nhanh</h4>
                            <ul className="layout__footer-list">
                                <li><NavLink to="/">Trang chủ</NavLink></li>
                                <li><NavLink to="/conversation">Hội thoại</NavLink></li>
                                <li><NavLink to="/about">Về chúng tôi</NavLink></li>
                            </ul>
                        </Col>
                        <Col xs={24} sm={12} md={10}>
                            <h4>Liên hệ</h4>
                            <ul className="layout__footer-contact">
                                <li><EnvironmentOutlined /> <span>Đặng Thùy Trâm, Bình Thạnh, HCM</span></li>
                                <li><PhoneOutlined /> <span>+84 942 217 271</span></li>
                                <li><MailOutlined /> <span>danganhtuongg@gmail.com</span></li>
                            </ul>
                        </Col>
                    </Row>
                    <div className="layout__footer-copyright">
                        @Copyright by Dang Anh Tuongg
                    </div>
                </div>
            </footer>
                </div>
            </div>
        </>
    )
}
export default Layout;