import { Row, Col, Select, Button } from 'antd';
import { ArrowRightOutlined, AudioOutlined, BankOutlined, CarOutlined, CheckCircleFilled, ClusterOutlined, CoffeeOutlined, DashboardOutlined, GlobalOutlined, HeartOutlined, ReadOutlined, RightOutlined, RiseOutlined, RobotOutlined, ShopOutlined, StarFilled } from '@ant-design/icons';
import s1 from "../../img/nentienganh.jpg";

import "./style.css";

function Home() {

  return (

    <>

     <div className="section1">
        {/* Thêm div container để căn giữa nội dung */}
        <div className="container"> 
          
          <Row justify="space-between" align="middle" gutter={[40, 40]}>
            
            {/* CỘT CHỮ: Mobile chiếm hết (24), PC chiếm một nửa (12) */}
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

                {/* Các thẻ tag ưu điểm */}
                <div className="tags-wrapper">
                  <span className="tag-item"><CheckCircleFilled style={{color: '#0075F3'}} /> Phương pháp hiệu quả</span>
                  <span className="tag-item"><CheckCircleFilled style={{color: '#0075F3'}} /> Kết quả như mong đợi</span>
                </div>

                <Button type="primary" size="large" className="btn-orange">
                   Dùng thử miễn phí <RightOutlined />
                </Button>
              </div>
            </Col>

            {/* CỘT ẢNH: Mobile chiếm hết (24), PC chiếm một nửa (12) */}
            <Col xs={24} md={12} lg={12} className="col-img">
              <div className="img-wrapper">  
                <img src={s1} alt="Banner Tiếng Anh" />
              </div>
            </Col>
            
          </Row>
        </div>
      </div>
    <div className="section2">
    <div className="container">
        {/* Tiêu đề của Section */}
        <div className="section-title">
            <h2>Học tiếng Anh toàn diện</h2>
            <p>Công nghệ AI giúp bạn bứt phá mọi kỹ năng</p>
        </div>

        <Row gutter={[30, 30]} justify="center">
            {/* CARD 1: LUYỆN HỘI THOẠI */}
            <Col xs={24} sm={12} md={8}>
                <div className="feature-card">
                    <div className="icon-box icon-blue">
                        <AudioOutlined />
                    </div>
                    <h3>Luyện Hội Thoại</h3>
                    <p>Đóng vai cùng AI trong các tình huống thực tế. Chỉnh sửa phát âm chuẩn bản xứ ngay lập tức.</p>
                    <a href="/conversation" className="learn-more">
                        Học ngay <ArrowRightOutlined />
                    </a>
                </div>
            </Col>

            {/* CARD 2: TỪ VỰNG MINDMAP */}
            <Col xs={24} sm={12} md={8}>
                <div className="feature-card">
                    <div className="icon-box icon-green">
                        <ClusterOutlined />
                    </div>
                    <h3>Từ Vựng Mindmap</h3>
                    <p>Học từ vựng theo sơ đồ tư duy. Hiểu sâu mối liên hệ giữa các từ, nhớ lâu hơn gấp 3 lần.</p>
                    <a href="/mindmap" className="learn-more">
                        Khám phá <ArrowRightOutlined />
                    </a>
                </div>
            </Col>

            {/* CARD 3: CHAT PHẢN XẠ AI */}
            <Col xs={24} sm={12} md={8}>
                <div className="feature-card">
                    <div className="icon-box icon-purple">
                        <RobotOutlined />
                    </div>
                    <h3>Chat Phản Xạ AI</h3>
                    <p>Trò chuyện tự do với trợ lý ảo thông minh. Rèn luyện khả năng phản xạ và tư duy ngôn ngữ.</p>
                    <a href="/chatbox" className="learn-more">
                        Chat ngay <ArrowRightOutlined />
                    </a>
                </div>
            </Col>
        </Row>
    </div>
</div>   
<div className="section3">
    <div className="container">
        
        {/* Tiêu đề Section */}
        <div className="section-title">
            <h2>Chủ đề đa dạng</h2>
            <p>Lựa chọn lộ trình phù hợp với mục tiêu của bạn</p>
        </div>

        {/* Grid danh sách chủ đề */}
        <Row gutter={[20, 20]}>
            {/* Chúng ta dùng hàm map để render cho gọn code, thay vì viết thủ công 8 lần */}
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
                        <div className="topic-icon">
                            {item.icon}
                        </div>
                        <div className="topic-info">
                            <h4>{item.title}</h4>
                            <span>{item.count}</span>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
        
        {/* Nút xem tất cả */}
        <div style={{textAlign: 'center', marginTop: '40px'}}>
             <Button className="btn-outline">Xem tất cả chủ đề</Button>
        </div>

    </div>
</div>
<div className="section-test">
    <div className="container">
        <div className="test-banner">
            <Row align="middle" gutter={[30, 30]}>
                
                {/* CỘT TRÁI: TEXT KÊU GỌI */}
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

                {/* CỘT PHẢI: HÌNH ẢNH MINH HỌA (Dùng Icon to hoặc Ảnh) */}
                <Col xs={24} md={10}>
                    <div className="test-image-box">
                        {/* Ở đây tôi giả lập hình ảnh bằng Icon cho nhẹ web, 
                            bạn có thể thay bằng thẻ <img src={...} /> nếu có ảnh thật */}
                        <div className="score-circle">
                            <DashboardOutlined style={{fontSize: '60px', color: '#fff'}} />
                            <div className="score-text">AI Test</div>
                        </div>
                        {/* Trang trí thêm vài cái chấm tròn cho đẹp */}
                        <div className="decor-dot dot-1"></div>
                        <div className="decor-dot dot-2"></div>
                    </div>
                </Col>

            </Row>
        </div>
    </div>
</div>
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