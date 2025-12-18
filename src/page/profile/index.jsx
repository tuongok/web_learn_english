import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import myAvatar from '../../img/avt.jpg';
import {
  Card, Row, Col, Avatar, Typography, Tabs, Button, Tag,
  List, Progress, Divider, Timeline, Form, Input, Upload, message, Statistic, Space, Badge, Tooltip, Modal, Table, DatePicker, Select
} from 'antd';
import {
  UserOutlined, UploadOutlined, SafetyCertificateOutlined,
  HistoryOutlined, WalletOutlined, EditOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CrownOutlined,
  LogoutOutlined, MailOutlined, PhoneOutlined, LockOutlined, RightOutlined, CreditCardOutlined,
  CalendarOutlined, HomeOutlined, ManOutlined, WomanOutlined, ArrowLeftOutlined // <--- Thêm icon ArrowLeft
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const customStyles = {
    cardShadow: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderRadius: 12,
        border: 'none',
        overflow: 'hidden'
    },
    primaryColor: '#13c2c2',
};

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();

  // --- STATE MODAL ---
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  // --- DỮ LIỆU USER ---
  const [user, setUser] = useState({
    name: 'Tường Đặng',
    email: 'tuongdang@gmail.com',
    phone: '0909123456',
    avatar: myAvatar,
    dob: dayjs('2000-01-01'),
    gender: 'male',
    address: 'Bình Thạnh, TP. Hồ Chí Minh',
    joinDate: '20/12/2023',
    lastLogin: dayjs().format('HH:mm DD/MM/YYYY'),
    level: 'B1 (Trung cấp)',
    levelProgress: 65,
    subscription: {
        plan: 'Gói 3 Tháng (Premium)',
        status: 'active',
        startDate: '01/01/2025',
        endDate: '01/04/2025',
        daysLeft: 75
    },
    learnedHistory: [
        { title: 'Check-in at Hotel', topic: 'Travel', score: 9, date: '15/02/2025', status: 'finish' },
        { title: 'Job Interview Basic', topic: 'Work', score: 8.5, date: '10/02/2025', status: 'finish' },
        { title: 'Ordering Coffee', topic: 'Daily Life', score: null, date: '05/02/2025', status: 'process' },
    ],
    purchaseHistory: [
        { pkg: 'Gói 3 Tháng (Premium)', date: '01/01/2025', amount: '499.000đ', status: 'success' },
        { pkg: 'Gói 1 Tháng', date: '01/12/2024', amount: '199.000đ', status: 'expired' },
    ]
  });

  const fullHistoryData = [
      ...user.learnedHistory,
      { title: 'Introduction to IELTS', topic: 'Exam', score: 7.5, date: '01/02/2025', status: 'finish' },
      { title: 'Talking about Hobbies', topic: 'Daily Life', score: 9.5, date: '28/01/2025', status: 'finish' },
      { title: 'Business Email Writing', topic: 'Work', score: 8.0, date: '20/01/2025', status: 'finish' },
  ];

  const historyColumns = [
      { title: 'Bài học', dataIndex: 'title', key: 'title', render: t => <span style={{fontWeight: 500}}>{t}</span> },
      { title: 'Chủ đề', dataIndex: 'topic', key: 'topic', render: t => <Tag color="blue">{t}</Tag> },
      { title: 'Ngày học', dataIndex: 'date', key: 'date' },
      { title: 'Điểm số', dataIndex: 'score', key: 'score', align: 'center', render: s => s ? <Tag color="success"><b>{s}</b>/10</Tag> : <Tag>Wait</Tag> },
      { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => s === 'finish' ? <Badge status="success" text="Hoàn thành" /> : <Badge status="processing" text="Đang học" /> }
  ];

  // --- HÀM XỬ LÝ ---
  const handleUpdateInfo = (values) => {
    const updatedUser = { ...user, ...values };
    setUser(updatedUser);
    message.success('Cập nhật hồ sơ thành công!');
  };

  const handleChangePass = () => {
    message.loading('Đang đổi mật khẩu...', 1).then(() => {
        message.success('Đổi mật khẩu thành công!');
        passwordForm.resetFields();
    });
  };

  const handleLogout = () => {
      message.loading('Đang đăng xuất...', 0.5).then(() => navigate('/login'));
  };

  // --- HÀM XỬ LÝ UPLOAD ẢNH (MỚI) ---
  const handleAvatarUpload = (info) => {
      // 1. Lấy file người dùng chọn
      const file = info.file;
      
      // 2. Kiểm tra định dạng (Chỉ cho phép ảnh)
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
          message.error('Bạn chỉ có thể tải lên file ảnh (JPG/PNG)!');
          return Upload.LIST_IGNORE; // Bỏ qua file lỗi
      }

      // 3. Đọc file và hiển thị ngay lập tức (Base64)
      const reader = new FileReader();
      reader.onload = (e) => {
          // Cập nhật State avatar bằng đường dẫn ảnh mới
          setUser(prev => ({ ...prev, avatar: e.target.result }));
          message.success('Đã thay đổi ảnh đại diện!');
      };
      reader.readAsDataURL(file); // Bắt đầu đọc file
      
      return false; // Quan trọng: Ngăn không cho tự động gửi lên Server (vì chưa có server)
  };

  // --- TAB COMPONENTS ---
  const LearningTab = () => (
    <div>
        <Card style={{ ...customStyles.cardShadow, background: 'linear-gradient(135deg, #e6fffb 0%, #f0fcfc 100%)', marginBottom: 24 }} bordered={false}>
            <Row gutter={24} align="middle">
                <Col span={16}>
                    <Space align="center" style={{marginBottom: 16}}>
                         <Avatar size={64} style={{ backgroundColor: customStyles.primaryColor }} icon={<SafetyCertificateOutlined />} />
                         <div>
                             <Text type="secondary">Trình độ hiện tại</Text>
                             <Title level={3} style={{ margin: 0, color: customStyles.primaryColor }}>{user.level}</Title>
                         </div>
                    </Space>
                    <div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                            <Text strong>Tiến độ lên cấp B2</Text>
                            <Text strong style={{color: customStyles.primaryColor}}>{user.levelProgress}%</Text>
                        </div>
                        <Progress percent={user.levelProgress} strokeColor={customStyles.primaryColor} trailColor="#d9f7be" showInfo={false} strokeWidth={10} />
                    </div>
                </Col>
                <Col span={8} style={{textAlign: 'center', borderLeft: '1px solid #eee'}}>
                    <Statistic title="Bài đã học" value={fullHistoryData.length} prefix={<CheckCircleOutlined style={{color: '#52c41a'}} />} valueStyle={{ fontWeight: 'bold' }} />
                    <Divider style={{margin: '12px 0'}} />
                     <Statistic title="Thời gian còn lại" value={user.subscription.daysLeft} suffix="ngày" prefix={<ClockCircleOutlined style={{color: '#fa8c16'}} />} valueStyle={{ fontWeight: 'bold', fontSize: 20 }} />
                </Col>
            </Row>
        </Card>
        <Title level={5} style={{marginBottom: 20}}><HistoryOutlined /> Bài học gần đây</Title>
        <div style={{padding: '0 12px'}}>
            <Timeline items={user.learnedHistory.map((item, idx) => ({
                    color: item.status === 'finish' ? 'green' : 'blue',
                    dot: item.status === 'finish' ? <CheckCircleOutlined style={{ fontSize: '16px' }} /> : <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                    children: (
                        <Card style={{marginBottom: 12, border: '1px solid #f0f0f0', borderRadius: 8}} bodyStyle={{padding: 12}} bordered={false} hoverable>
                             <Row justify="space-between" align="middle">
                                 <Col>
                                     <Text strong style={{fontSize: 15}}>{item.title}</Text>
                                     <br/>
                                     <Space split={<Divider type="vertical" />} size="small"><Tag color="blue">{item.topic}</Tag><Text type="secondary" style={{fontSize: 12}}>{item.date}</Text></Space>
                                 </Col>
                                 <Col>{item.score ? <Tag color="success">Điểm: <b>{item.score}</b></Tag> : <Button type="primary" size="small" shape="round" ghost onClick={() => message.info('Mở bài học')}>Học tiếp <RightOutlined/></Button>}</Col>
                             </Row>
                        </Card>
                    )
                }))}
            />
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}><Button type="dashed" icon={<RightOutlined />} onClick={() => setIsHistoryModalOpen(true)}>Xem tất cả lịch sử</Button></div>
    </div>
  );

  const BillingTab = () => (
      <div>
          <Card style={{ ...customStyles.cardShadow, background: 'linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%)', border: '1px solid #ffe58f' }} bodyStyle={{padding: 24}} bordered={false}>
              <Row align="middle" justify="space-between">
                  <Col>
                      <Space align="start">
                          <Avatar size={48} style={{ backgroundColor: '#faad14' }} icon={<CrownOutlined />} />
                          <div><Title level={4} style={{ margin: 0, color: '#d48806' }}>{user.subscription.plan}</Title><Badge status="processing" text={<Text type="success">Đang hoạt động</Text>} /></div>
                      </Space>
                  </Col>
                  <Col style={{textAlign: 'right'}}><Button type="primary" danger shape="round" size="large" onClick={() => setIsRenewModalOpen(true)}>Gia hạn ngay</Button></Col>
              </Row>
              <Divider style={{margin: '20px 0', borderColor: '#fff1b8'}} />
              <Row gutter={16}>
                  <Col span={12}><Statistic title="Ngày bắt đầu" value={user.subscription.startDate} valueStyle={{fontSize: 16}} prefix={<ClockCircleOutlined />} /></Col>
                  <Col span={12}><Statistic title="Ngày hết hạn" value={user.subscription.endDate} valueStyle={{fontSize: 16, color: '#cf1322'}} prefix={<ClockCircleOutlined />} /></Col>
              </Row>
          </Card>
          <Title level={5} style={{margin: '24px 0 16px'}}><WalletOutlined /> Lịch sử giao dịch</Title>
          <List dataSource={user.purchaseHistory} renderItem={item => (<List.Item style={{padding: '12px 0'}}><List.Item.Meta avatar={<Avatar style={{ backgroundColor: item.status === 'success' ? '#f6ffed' : '#fff1f0', color: item.status === 'success' ? '#52c41a' : '#cf1322' }} icon={item.status === 'success' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} />} title={<Text strong>{item.pkg}</Text>} description={<Text type="secondary">{item.date}</Text>} /><div style={{textAlign: 'right'}}><Text strong style={{fontSize: 16, color: customStyles.primaryColor}}>{item.amount}</Text><br/><Tag color={item.status === 'success' ? 'green' : 'default'}>{item.status === 'success' ? 'Thành công' : 'Hết hạn'}</Tag></div></List.Item>)} />
      </div>
  );

  const SettingsTab = () => (
      <Row gutter={32}>
          <Col span={24}>
              <Card title={<span><EditOutlined /> Hồ sơ cá nhân</span>} bordered={false} style={{...customStyles.cardShadow, marginBottom: 24}} headStyle={{background: '#fafafa'}}>
                  <Form layout="vertical" initialValues={user} onFinish={handleUpdateInfo} form={form}>
                      <Row gutter={24}>
                          <Col span={12}><Form.Item label="Họ và tên" name="name" rules={[{required: true}]}><Input prefix={<UserOutlined style={{color: '#bfbfbf'}} />} size="large" /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Email" name="email"><Input disabled prefix={<MailOutlined style={{color: '#bfbfbf'}} />} size="large" style={{backgroundColor: '#f5f5f5'}} /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Số điện thoại" name="phone"><Input prefix={<PhoneOutlined style={{color: '#bfbfbf'}} />} size="large" /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Giới tính" name="gender"><Select size="large"><Option value="male">Nam</Option><Option value="female">Nữ</Option></Select></Form.Item></Col>
                          <Col span={12}><Form.Item label="Ngày sinh" name="dob"><DatePicker size="large" style={{width: '100%'}} format="DD/MM/YYYY" /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Địa chỉ" name="address"><Input prefix={<HomeOutlined style={{color: '#bfbfbf'}} />} size="large" /></Form.Item></Col>
                          <Col span={24} style={{textAlign: 'right'}}><Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />} size="large" style={{backgroundColor: customStyles.primaryColor, borderColor: customStyles.primaryColor}}>Lưu hồ sơ</Button></Col>
                      </Row>
                  </Form>
              </Card>
              <Card title={<span><LockOutlined /> Bảo mật</span>} bordered={false} style={customStyles.cardShadow} headStyle={{background: '#fafafa'}}>
                  <Form layout="vertical" form={passwordForm} onFinish={handleChangePass}>
                      <Row gutter={24}>
                          <Col span={12}><Form.Item label="Mật khẩu mới" name="password" rules={[{required: true, min: 6}]}><Input.Password prefix={<LockOutlined style={{color: '#bfbfbf'}}/>} size="large" /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Xác nhận" name="confirm" dependencies={['password']} rules={[{required: true}, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('Khớp mật khẩu!')); }, }),]}><Input.Password prefix={<LockOutlined style={{color: '#bfbfbf'}}/>} size="large" /></Form.Item></Col>
                          <Col span={24} style={{textAlign: 'right'}}><Button type="default" danger htmlType="submit" size="large">Đổi mật khẩu</Button></Col>
                      </Row>
                  </Form>
              </Card>
          </Col>
      </Row>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 20px', paddingBottom: 60, position: 'relative', zIndex: 1 }}>
      
      {/* --- NÚT QUAY LẠI (BACK BUTTON) --- */}
      <div style={{ marginBottom: 16 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)} // Quay lại trang trước đó trong lịch sử duyệt
            style={{ fontSize: '16px', fontWeight: 500, paddingLeft: 0 }}
          >
              Quay lại
          </Button>
      </div>
      {/* ---------------------------------- */}

      <Row gutter={[24, 24]}>
        <Col xs={24} md={7} lg={6}>
          <Card hoverable style={{ textAlign: 'center', ...customStyles.cardShadow }} bodyStyle={{padding: '30px 20px'}}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                <Avatar size={120} src={user.avatar} style={{ border: `4px solid ${customStyles.primaryColor}` }} icon={<UserOutlined />} />
                <Upload 
    name="avatar" 
    showUploadList={false} 
    beforeUpload={(file) => handleAvatarUpload({ file })} // Gọi hàm xử lý trực tiếp tại đây
>
    <Tooltip title="Tải ảnh đại diện mới">
        <Button 
            type="primary" 
            shape="circle" 
            icon={<UploadOutlined />} 
            size="middle" 
            style={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0, 
                backgroundColor: customStyles.primaryColor, 
                borderColor: customStyles.primaryColor 
            }} 
        />
    </Tooltip>
</Upload>
            </div>
            <Title level={3} style={{ marginBottom: 4 }}>{user.name}</Title>
            <Text type="secondary">{user.email}</Text>
            <Divider style={{ margin: '24px 0' }} />
            <div style={{ textAlign: 'left', padding: '0 10px' }}>
                <Space direction="vertical" size="middle" style={{width: '100%'}}>
                    <Row justify="space-between"><Col><Space><SafetyCertificateOutlined style={{ color: customStyles.primaryColor }} /> <Text strong>Level:</Text></Space></Col><Col><Tag color="cyan">{user.level}</Tag></Col></Row>
                    <Row justify="space-between"><Col><Space><CrownOutlined style={{ color: '#faad14' }} /> <Text strong>Gói:</Text></Space></Col><Col><Tag color="gold">{user.subscription.plan}</Tag></Col></Row>
                    <Row justify="space-between"><Col><Space><CalendarOutlined style={{color: '#999'}} /> <Text type="secondary">Sinh nhật:</Text></Space></Col><Col><Text type="secondary">{user.dob ? user.dob.format('DD/MM/YYYY') : '---'}</Text></Col></Row>
                </Space>
            </div>
            <Divider style={{ margin: '24px 0' }} />
            <Button block icon={<LogoutOutlined />} size="large" onClick={handleLogout}>Đăng xuất</Button>
            <Text type="secondary" style={{fontSize: 12, display: 'block', marginTop: 16}}>Đăng nhập lần cuối: {user.lastLogin}</Text>
          </Card>
        </Col>

        <Col xs={24} md={17} lg={18}>
          <Card style={{ ...customStyles.cardShadow, minHeight: 600 }} bodyStyle={{padding: '24px 32px'}}>
            <Tabs defaultActiveKey="1" size="large" tabBarStyle={{marginBottom: 32}} items={[
                { key: '1', label: <span><CheckCircleOutlined /> Tiến độ học tập</span>, children: <LearningTab /> },
                { key: '2', label: <span><CrownOutlined /> Gói cước & Hóa đơn</span>, children: <BillingTab /> },
                { key: '3', label: <span><EditOutlined /> Cài đặt tài khoản</span>, children: <SettingsTab /> },
            ]} />
          </Card>
        </Col>
      </Row>

      <Modal title="Lịch sử học tập đầy đủ" open={isHistoryModalOpen} onCancel={() => setIsHistoryModalOpen(false)} footer={[<Button key="close" onClick={() => setIsHistoryModalOpen(false)}>Đóng</Button>]} width={700}>
          <Table dataSource={fullHistoryData} columns={historyColumns} pagination={{ pageSize: 5 }} />
      </Modal>

      <Modal title="Gia hạn gói Premium" open={isRenewModalOpen} onCancel={() => setIsRenewModalOpen(false)} footer={null}>
          <Card style={{textAlign: 'center', border: '1px solid #13c2c2', background: '#f0fcfc'}}>
              <Title level={4} style={{color: '#13c2c2'}}>Gói 3 Tháng</Title>
              <Title level={2}>499.000đ</Title>
              <Paragraph>Mở khóa toàn bộ tính năng cao cấp, luyện hội thoại AI không giới hạn.</Paragraph>
              <Button type="primary" size="large" icon={<CreditCardOutlined />} block onClick={() => {message.success('Chuyển hướng đến cổng thanh toán...'); setIsRenewModalOpen(false);}}>Thanh toán ngay</Button>
          </Card>
      </Modal>
    </div>
  );
};

export default Profile;