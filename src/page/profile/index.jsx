import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import Redux
import { logout } from '../../redux/authSlice'; // Import action logout

import {
  Card, Row, Col, Avatar, Typography, Tabs, Button, Tag,
  List, Progress, Divider, Timeline, Form, Input, Upload, message, Statistic, Space, Badge, Tooltip, Modal, Table, DatePicker, Select
} from 'antd';
import {
  UserOutlined, UploadOutlined, SafetyCertificateOutlined,
  HistoryOutlined, WalletOutlined, EditOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CrownOutlined,
  LogoutOutlined, MailOutlined, PhoneOutlined, LockOutlined, CreditCardOutlined,
  CalendarOutlined, HomeOutlined, ArrowLeftOutlined 
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
    primaryColor: '#0075F3', // Đổi màu xanh cho đồng bộ với Header
};

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. LẤY DỮ LIỆU TỪ REDUX
  const reduxUser = useSelector((state) => state.auth.user);
  
  // State Modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // State User (Kết hợp dữ liệu từ Redux và dữ liệu giả lập cho phần chưa có)
  const [user, setUser] = useState({
    name: reduxUser?.name || 'Người dùng',
    email: reduxUser?.email || 'email@example.com',
    phone: reduxUser?.phone || 'Chưa cập nhật',
    avatar: reduxUser?.avatar || '',
    dob: dayjs('2000-01-01'),
    gender: 'male',
    address: 'Chưa cập nhật',
    level: 'A1 (Sơ cấp)',
    levelProgress: 30,
    lastLogin: dayjs().format('HH:mm DD/MM/YYYY'),
    subscription: {
        plan: 'Miễn phí (Free)',
        status: 'active',
        startDate: dayjs().format('DD/MM/YYYY'),
        endDate: 'Vô thời hạn',
        daysLeft: '∞'
    },
    learnedHistory: [
        { title: 'Check-in at Hotel', topic: 'Travel', score: 9, date: '15/02/2025', status: 'finish' },
        { title: 'Ordering Coffee', topic: 'Daily Life', score: null, date: '05/02/2025', status: 'process' },
    ],
    purchaseHistory: []
  });

  // Cập nhật lại state khi Redux thay đổi
  useEffect(() => {
      if (reduxUser) {
          setUser(prev => ({
              ...prev,
              name: reduxUser.name,
              email: reduxUser.email,
              avatar: reduxUser.avatar,
              phone: reduxUser.phone || prev.phone
          }));
          form.setFieldsValue({
              name: reduxUser.name,
              email: reduxUser.email,
              phone: reduxUser.phone
          });
      }
  }, [reduxUser, form]);

  const fullHistoryData = [...user.learnedHistory];

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
    message.success('Cập nhật hồ sơ thành công (Giả lập)!');
  };

  const handleChangePass = () => {
    message.loading('Đang đổi mật khẩu...', 1).then(() => {
        message.success('Đổi mật khẩu thành công!');
        passwordForm.resetFields();
    });
  };

  const handleLogout = () => {
      dispatch(logout()); // Gọi Redux Logout
      navigate('/login');
  };

  const handleAvatarUpload = (info) => {
      const file = info.file;
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
          message.error('Bạn chỉ có thể tải lên file ảnh (JPG/PNG)!');
          return Upload.LIST_IGNORE;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
          setUser(prev => ({ ...prev, avatar: e.target.result }));
          message.success('Đã thay đổi ảnh đại diện!');
          // Ở đây thực tế bạn cần dispatch action cập nhật avatar lên Redux nữa
      };
      reader.readAsDataURL(file);
      return false;
  };

  // Nút Gia hạn -> Chuyển sang trang Pricing
  const handleRenewClick = () => {
      navigate('/pricing'); 
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
                            <Text strong>Tiến độ lên cấp A2</Text>
                            <Text strong style={{color: customStyles.primaryColor}}>{user.levelProgress}%</Text>
                        </div>
                        <Progress percent={user.levelProgress} strokeColor={customStyles.primaryColor} trailColor="#d9f7be" showInfo={false} strokeWidth={10} />
                    </div>
                </Col>
                <Col span={8} style={{textAlign: 'center', borderLeft: '1px solid #eee'}}>
                    <Statistic title="Bài đã học" value={fullHistoryData.length} prefix={<CheckCircleOutlined style={{color: '#52c41a'}} />} valueStyle={{ fontWeight: 'bold' }} />
                </Col>
            </Row>
        </Card>
        <Title level={5} style={{marginBottom: 20}}><HistoryOutlined /> Bài học gần đây</Title>
        <div style={{padding: '0 12px'}}>
            <Timeline items={user.learnedHistory.map((item, idx) => ({
                    color: item.status === 'finish' ? 'green' : 'blue',
                    children: (
                        <Card style={{marginBottom: 12, border: '1px solid #f0f0f0', borderRadius: 8}} bodyStyle={{padding: 12}} bordered={false} hoverable>
                             <Row justify="space-between" align="middle">
                                 <Col>
                                     <Text strong style={{fontSize: 15}}>{item.title}</Text>
                                     <br/>
                                     <Space split={<Divider type="vertical" />} size="small"><Tag color="blue">{item.topic}</Tag><Text type="secondary" style={{fontSize: 12}}>{item.date}</Text></Space>
                                 </Col>
                                 <Col>{item.score ? <Tag color="success">Điểm: <b>{item.score}</b></Tag> : <Button type="primary" size="small" shape="round" ghost onClick={() => navigate('/conversation')}>Học tiếp</Button>}</Col>
                             </Row>
                        </Card>
                    )
                }))}
            />
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}><Button type="dashed" icon={<ArrowLeftOutlined rotate={180} />} onClick={() => setIsHistoryModalOpen(true)}>Xem tất cả lịch sử</Button></div>
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
                  <Col style={{textAlign: 'right'}}><Button type="primary" danger shape="round" size="large" onClick={handleRenewClick}>Nâng cấp PRO</Button></Col>
              </Row>
              <Divider style={{margin: '20px 0', borderColor: '#fff1b8'}} />
              <Row gutter={16}>
                  <Col span={12}><Statistic title="Ngày bắt đầu" value={user.subscription.startDate} valueStyle={{fontSize: 16}} prefix={<ClockCircleOutlined />} /></Col>
                  <Col span={12}><Statistic title="Ngày hết hạn" value={user.subscription.endDate} valueStyle={{fontSize: 16, color: '#cf1322'}} prefix={<ClockCircleOutlined />} /></Col>
              </Row>
          </Card>
          <Title level={5} style={{margin: '24px 0 16px'}}><WalletOutlined /> Lịch sử giao dịch</Title>
          {user.purchaseHistory.length > 0 ? (
              <List dataSource={user.purchaseHistory} renderItem={item => (<List.Item>...</List.Item>)} />
          ) : (
              <div style={{textAlign: 'center', padding: 20, color: '#999'}}>Chưa có giao dịch nào</div>
          )}
      </div>
  );

  const SettingsTab = () => (
      <Row gutter={32}>
          <Col span={24}>
              {/* --- PHẦN HỒ SƠ (Giữ nguyên) --- */}
              <Card title={<span><EditOutlined /> Hồ sơ cá nhân</span>} bordered={false} style={{...customStyles.cardShadow, marginBottom: 24}} headStyle={{background: '#fafafa'}}>
                  <Form layout="vertical" initialValues={user} onFinish={handleUpdateInfo} form={form}>
                      <Row gutter={24}>
                          <Col span={12}><Form.Item label="Họ và tên" name="name" rules={[{required: true}]}><Input prefix={<UserOutlined style={{color: '#bfbfbf'}} />} size="large" /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Email" name="email"><Input disabled prefix={<MailOutlined style={{color: '#bfbfbf'}} />} size="large" style={{backgroundColor: '#f5f5f5'}} /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Số điện thoại" name="phone"><Input prefix={<PhoneOutlined style={{color: '#bfbfbf'}} />} size="large" /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Giới tính" name="gender"><Select size="large"><Option value="male">Nam</Option><Option value="female">Nữ</Option></Select></Form.Item></Col>
                          <Col span={12}><Form.Item label="Ngày sinh" name="dob"><DatePicker size="large" style={{width: '100%'}} format="DD/MM/YYYY" /></Form.Item></Col>
                          <Col span={12}><Form.Item label="Địa chỉ" name="address"><Input prefix={<HomeOutlined style={{color: '#bfbfbf'}} />} size="large" /></Form.Item></Col>
                          <Col span={24} style={{textAlign: 'right'}}><Button type="primary" htmlType="submit" size="large" style={{backgroundColor: customStyles.primaryColor}}>Lưu hồ sơ</Button></Col>
                      </Row>
                  </Form>
              </Card>

              {/* --- PHẦN BẢO MẬT (Đã cập nhật thêm ô Mật khẩu hiện tại) --- */}
              <Card title={<span><LockOutlined /> Bảo mật</span>} bordered={false} style={customStyles.cardShadow} headStyle={{background: '#fafafa'}}>
                  <Form layout="vertical" form={passwordForm} onFinish={handleChangePass}>
                      <Row gutter={24}>
                          
                          {/* 1. Ô MẬT KHẨU HIỆN TẠI (Mới thêm) */}
                          <Col span={24}>
                              <Form.Item 
                                  label="Mật khẩu hiện tại" 
                                  name="currentPassword" 
                                  hasFeedback 
                                  rules={[
                                      { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
                                      {
                                          validator: async (_, value) => {
                                              // GIẢ LẬP: Mật khẩu cũ là '123456'
                                              // Nếu nhập khác '123456' thì báo lỗi đỏ
                                              if (!value || value === '123456') {
                                                  return Promise.resolve();
                                              }
                                              return Promise.reject(new Error('Mật khẩu hiện tại không đúng!'));
                                          },
                                      },
                                  ]}
                              >
                                  <Input.Password 
                                      prefix={<LockOutlined style={{color: '#bfbfbf'}}/>} 
                                      size="large" 
                                      placeholder="Nhập mật khẩu cũ (Test: 123456)"
                                  />
                              </Form.Item>
                          </Col>

                          {/* 2. Ô MẬT KHẨU MỚI */}
                          <Col span={12}>
                              <Form.Item 
                                  label="Mật khẩu mới" 
                                  name="password" 
                                  hasFeedback
                                  rules={[{required: true, min: 6, message: 'Mật khẩu phải từ 6 ký tự!'}]}
                              >
                                  <Input.Password prefix={<LockOutlined style={{color: '#bfbfbf'}}/>} size="large" />
                              </Form.Item>
                          </Col>

                          {/* 3. Ô XÁC NHẬN MẬT KHẨU */}
                          <Col span={12}>
                              <Form.Item 
                                  label="Xác nhận mật khẩu mới" 
                                  name="confirm" 
                                  dependencies={['password']} 
                                  hasFeedback
                                  rules={[
                                      {required: true, message: 'Vui lòng xác nhận mật khẩu!'}, 
                                      ({ getFieldValue }) => ({ 
                                          validator(_, value) { 
                                              if (!value || getFieldValue('password') === value) {
                                                  return Promise.resolve(); 
                                              }
                                              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!')); 
                                          }, 
                                      }),
                                  ]}
                              >
                                  <Input.Password prefix={<LockOutlined style={{color: '#bfbfbf'}}/>} size="large" />
                              </Form.Item>
                          </Col>

                          <Col span={24} style={{textAlign: 'right'}}>
                              <Button type="default" danger htmlType="submit" size="large">Đổi mật khẩu</Button>
                          </Col>
                      </Row>
                  </Form>
              </Card>
          </Col>
      </Row>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 20px', paddingBottom: 60 }}>
      
      {/* NÚT QUAY LẠI */}
      <div style={{ marginBottom: 16 }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ fontSize: '16px', fontWeight: 500, paddingLeft: 0 }}>Quay lại</Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
        <Col xs={24} md={7} lg={6}>
          <Card hoverable style={{ textAlign: 'center', ...customStyles.cardShadow }} bodyStyle={{padding: '30px 20px'}}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                <Avatar size={120} src={user.avatar} style={{ border: `4px solid ${customStyles.primaryColor}` }} icon={<UserOutlined />} />
                <Upload name="avatar" showUploadList={false} beforeUpload={(file) => handleAvatarUpload({ file })}>
                    <Tooltip title="Tải ảnh đại diện mới">
                        <Button type="primary" shape="circle" icon={<UploadOutlined />} size="middle" style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: customStyles.primaryColor }} />
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
                </Space>
            </div>
            <Divider style={{ margin: '24px 0' }} />
            <Button block icon={<LogoutOutlined />} size="large" onClick={handleLogout}>Đăng xuất</Button>
          </Card>
        </Col>

        {/* CỘT PHẢI: TABS */}
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
    </div>
  );
};

export default Profile;