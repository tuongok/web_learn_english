import React from 'react';
import { Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    ArrowRightOutlined, AudioOutlined, BankOutlined, CarOutlined,
    CheckCircleFilled, ClusterOutlined, CoffeeOutlined, DashboardOutlined,
    GlobalOutlined, HeartOutlined, ReadOutlined, RightOutlined,
    RiseOutlined, RobotOutlined, ShopOutlined, StarFilled
} from '@ant-design/icons';
import s1 from "../../img/nentienganh.jpg"; // Đảm bảo đường dẫn ảnh đúng
import "./style.css"; // Đảm bảo file css tồn tại

// Dữ liệu gói cước (Pricing)
const PACKAGES = [
    {
        id: 1,
        name: 'CƠ BẢN',
        type: 'basic',
        price: '199.000đ',
        duration: '/ 1 tháng',
        features: ['Truy cập mọi bài học', 'Luyện nói AI cơ bản', 'Tra từ điển Mindmap'],
        discount: null
    },
    {
        id: 2,
        name: 'TIÊU CHUẨN',
        type: 'standard',
        price: '499.000đ',
        duration: '/ 3 tháng',
        features: ['Tất cả tính năng Cơ bản', 'Luyện nói không giới hạn', 'Không quảng cáo', 'Tiết kiệm 20%'],
        discount: '-20%'
    },
    {
        id: 3,
        name: 'CAO CẤP',
        type: 'premium',
        price: '899.000đ',
        duration: '/ 6 tháng',
        features: ['Full tính năng Tiêu chuẩn', 'Chứng chỉ hoàn thành', 'Hỗ trợ 1-1 ưu tiên', 'Tiết kiệm 40%'],
        discount: '-40%'
    }
];

function Home() {
    const navigate = useNavigate();

    // --- [SỬA LỖI TẠI ĐÂY] ---
    const handleRegister = (pkg) => {
        // 1. Xử lý giá tiền: "199.000đ" -> 199000
        const rawPrice = parseInt(pkg.price.toString().replace(/\./g, '').replace('đ', ''));
        
        // 2. Xử lý thời hạn: "/ 3 tháng" -> 3
        const durationMatch = pkg.duration.match(/\d+/);
        const durationNum = durationMatch ? parseInt(durationMatch[0]) : 1;

        // 3. Chuyển hướng và gửi state đúng cấu trúc 'selectedPackage'
        navigate('/payment', { 
            state: { 
                selectedPackage: {   // <--- QUAN TRỌNG: Phải bọc trong 'selectedPackage'
                    id: pkg.id,
                    name: pkg.name, 
                    price: rawPrice, 
                    duration: durationNum 
                }
            } 
        });
    };

    return (
        <>
            {/* 1. HERO SECTION */}
            <div className="section1">
                <div className="container">
                    <Row justify="space-between" align="middle" gutter={[40, 40]}>
                        <Col xs={24} md={12} lg={12} className="col-text">
                            <div className="content-wrapper">
                                <h3 className="sub-title">Chỉ 1 Lộ Trình</h3>
                                <h1 className="main-title">
                                    Đạt Ngay Mục Tiêu <br />
                                    <span className="highlight-text">Mơ Ước !!!</span>
                                </h1>
                                <p className="description">
                                    Học Tiếng Anh online cùng AI - Bật máy là bật band!
                                </p>
                                <div className="tags-wrapper">
                                    <span className="tag-item"><CheckCircleFilled style={{ color: '#0075F3' }} /> Phương pháp hiệu quả</span>
                                    <span className="tag-item"><CheckCircleFilled style={{ color: '#0075F3' }} /> Kết quả như mong đợi</span>
                                </div>
                                <Button type="primary" size="large" className="btn-orange">
                                    Dùng thử miễn phí <RightOutlined />
                                </Button>
                            </div>
                        </Col>
                        <Col xs={24} md={12} lg={12} className="col-img">
                            <div className="img-wrapper">
                                <img src={s1} alt="Banner Tiếng Anh" />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* 2. FEATURES SECTION */}
            <div className="section2">
                <div className="container">
                    <div className="section-title">
                        <h2>Học tiếng Anh toàn diện</h2>
                        <p>Công nghệ AI giúp bạn bứt phá mọi kỹ năng</p>
                    </div>
                    <Row gutter={[30, 30]} justify="center">
                        <Col xs={24} sm={12} md={8}>
                            <div className="feature-card">
                                <div className="icon-box icon-blue"><AudioOutlined /></div>
                                <h3>Luyện Hội Thoại</h3>
                                <p>Đóng vai cùng AI trong các tình huống thực tế. Chỉnh sửa phát âm chuẩn bản xứ ngay lập tức.</p>
                                <Link to="/conversation" className="learn-more">
                                    Học ngay <ArrowRightOutlined />
                                </Link>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <div className="feature-card">
                                <div className="icon-box icon-green"><ClusterOutlined /></div>
                                <h3>Từ Vựng Mindmap</h3>
                                <p>Học từ vựng theo sơ đồ tư duy. Hiểu sâu mối liên hệ giữa các từ, nhớ lâu hơn gấp 3 lần.</p>
                                <Link to="/mindmap" className="learn-more">
                                    Khám phá <ArrowRightOutlined />
                                </Link>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <div className="feature-card">
                                <div className="icon-box icon-purple"><RobotOutlined /></div>
                                <h3>Chat Phản Xạ AI</h3>
                                <p>Trò chuyện tự do với trợ lý ảo thông minh. Rèn luyện khả năng phản xạ và tư duy ngôn ngữ.</p>
                                <Link to="/chatbox" className="learn-more">
                                    Chat ngay <ArrowRightOutlined />
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* 3. TOPICS SECTION */}
            <div className="section3">
                <div className="container">
                    <div className="section-title">
                        <h2>Chủ đề đa dạng</h2>
                        <p>Lựa chọn lộ trình phù hợp với mục tiêu của bạn</p>
                    </div>
                    <Row gutter={[20, 20]}>
                        {[
                            { icon: <CoffeeOutlined />, title: 'Giao tiếp hàng ngày', count: '120 bài' },
                            { icon: <GlobalOutlined />, title: 'Du lịch & Khám phá', count: '85 bài' },
                            { icon: <ShopOutlined />, title: 'Mua sắm', count: '40 bài' },
                            { icon: <BankOutlined />, title: 'Nhà hàng & Khách sạn', count: '60 bài' },
                            { icon: <RiseOutlined />, title: 'Tiếng Anh Công sở', count: '150 bài' },
                            { icon: <HeartOutlined />, title: 'Sức khỏe & Đời sống', count: '55 bài' },
                            { icon: <ReadOutlined />, title: 'Giáo dục', count: '90 bài' },
                            { icon: <CarOutlined />, title: 'Giao thông', count: '45 bài' },
                        ].map((item, index) => (
                            <Col xs={12} sm={8} md={6} key={index}>
                                <div className="topic-card">
                                    <div className="topic-icon">{item.icon}</div>
                                    <div className="topic-info">
                                        <h4>{item.title}</h4>
                                        <span>{item.count}</span>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Button className="btn-outline">Xem tất cả chủ đề</Button>
                    </div>
                </div>
            </div>

            {/* 4. TEST BANNER */}
            <div className="section-test">
                <div className="container">
                    <div className="test-banner">
                        <Row align="middle" gutter={[30, 30]}>
                            <Col xs={24} md={14}>
                                <div className="test-content">
                                    <span className="badge-test"> <StarFilled /> Được đề xuất</span>
                                    <h2>Bạn không biết bắt đầu từ đâu?</h2>
                                    <p>
                                        Dành 15 phút làm bài kiểm tra năng lực chuẩn CEFR.
                                        AI sẽ phân tích điểm mạnh, điểm yếu và thiết kế lộ trình học riêng biệt cho bạn.
                                    </p>
                                    <Button type="primary" size="large" className="btn-white-outline">
                                        Làm bài kiểm tra ngay <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={24} md={10}>
                                <div className="test-image-box">
                                    <div className="score-circle">
                                        <DashboardOutlined style={{ fontSize: '60px', color: '#fff' }} />
                                        <div className="score-text">AI Test</div>
                                    </div>
                                    <div className="decor-dot dot-1"></div>
                                    <div className="decor-dot dot-2"></div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            {/* 5. PRICING SECTION */}
            <div className="home-pricing-section">
                <div className="container">
                    <h2 className="pricing-title">Chọn lộ trình thành công</h2>
                    <p className="pricing-subtitle">Đầu tư nhỏ cho kết quả lớn. Bắt đầu ngay hôm nay!</p>

                    <div className="pricing-container">
                        {PACKAGES.map((pkg) => (
                            <div key={pkg.id} className="pricing-card" onClick={() => handleRegister(pkg)}>
                                <div className={`card-header ${pkg.type}`}>
                                    {pkg.name}
                                </div>
                                {pkg.discount && <div className="discount-badge">{pkg.discount}</div>}
                                <div className="card-body">
                                    <div className="price-text">{pkg.price}</div>
                                    <div className="price-duration">{pkg.duration}</div>
                                    <ul className="feature-list">
                                        {pkg.features.map((feat, index) => (
                                            <li key={index}>
                                                <CheckCircleFilled style={{ color: '#52c41a', marginRight: 8 }} />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`btn-choose ${pkg.type}`}>
                                        Đăng ký ngay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. CTA FINAL */}
            <div className="section4-cta">
                <div className="container">
                    <Row justify="center" align="middle">
                        <Col xs={24} md={16} className="text-center">
                            <h2>Sẵn sàng bứt phá Tiếng Anh ngay hôm nay?</h2>
                            <p>Tham gia cộng đồng hơn 10.000 học viên và trải nghiệm công nghệ AI tiên tiến nhất.</p>
                            <Button type="primary" size="large" className="btn-white">
                                Đăng ký tài khoản miễn phí
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default Home;