import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myAvatar from '../../img/thienle.jpg'; 
import {
  Card, Row, Col, Avatar, Typography, Tabs, Button, Tag,
  List, Progress, Divider, Timeline, Form, Input, Upload, message, Statistic, Space, Badge, Tooltip, Modal, Table, DatePicker
} from 'antd';
import {
  UserOutlined, UploadOutlined, SafetyCertificateOutlined,
  HistoryOutlined, WalletOutlined, EditOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CrownOutlined,
  LogoutOutlined, MailOutlined, PhoneOutlined, LockOutlined, 
  CalendarOutlined, ArrowLeftOutlined, UnorderedListOutlined,
  StarFilled, TrophyFilled, SketchOutlined // Icon cho hạng thành viên
} from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// --- IMPORT REDUX ---
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, logout } from '../../redux/authSlice'; 

dayjs.extend(customParseFormat);

const { Title, Text, Paragraph } = Typography;

const customStyles = {
    cardShadow: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderRadius: 12,
        border: 'none',
        overflow: 'hidden'
    },
    primaryColor: '#13c2c2',
};

// --- CẤU HÌNH HẠNG THÀNH VIÊN ---
const MEMBER_TIERS = [
    { key: 'new', name: 'Thành Viên Mới', min: 0, max: 200000, color: '#8c8c8c', icon: <UserOutlined /> },
    { key: 'silver', name: 'Hạng Bạc (Silver)', min: 200000, max: 1000000, color: '#A0A0A0', icon: <TrophyFilled /> }, 
    { key: 'gold', name: 'Hạng Vàng (Gold)', min: 1000000, max: 3000000, color: '#FAAD14', icon: <CrownOutlined /> }, 
    { key: 'diamond', name: 'Kim Cương (Diamond)', min: 3000000, max: 9999999999, color: '#1890ff', icon: <SketchOutlined /> } 
];

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();
  
  // HOOKS REDUX
  const dispatch = useDispatch();
  const { user: userRedux } = useSelector((state) => state.auth);

  // STATE MODAL 
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // --- 1. DỮ LIỆU CÁC GÓI CƯỚC ---
  const pricingPackages = [
    { id: 1, name: 'Gói 1 Tháng', price: '199.000đ', value: 199000, duration: 30, desc: 'Thích hợp để trải nghiệm.', color: '#597ef7', isPopular: false },
    { id: 2, name: 'Gói 3 Tháng', price: '499.000đ', value: 499000, duration: 90, desc: 'Tiết kiệm 15%.', color: '#13c2c2', isPopular: true },
    { id: 3, name: 'Gói 6 tháng', price: '899.000đ', value: 899000, duration: 180, desc: 'Tiết kiệm 40%.', color: '#faad14', isPopular: false }
  ];

  // --- HÀM HỖ TRỢ: CHUYỂN ĐỔI TIỀN TỆ STRING SANG SỐ ---
  const parseCurrency = (str) => {
      if(!str) return 0;
      if (typeof str === 'number') return str;
      return parseInt(str.toString().replace(/\./g, '').replace('đ', '').replace(/,/g, '')) || 0;
  };

  // --- 2. LOGIC TÍNH TOÁN SUBSCRIPTION & MEMBER TIER ---
  const calculateSubscription = (history) => {
      const sortedHistory = [...history].reverse(); // Cũ nhất -> Mới nhất
      
      let expiryDate = dayjs(); 
      let hasActiveSub = false;
      let totalSpent = 0; // Tổng tiền đã chi

      sortedHistory.forEach(transaction => {
          // Tính tổng tiền cho các đơn thành công
          if (transaction.status === 'success' || transaction.status === 'paid') {
              hasActiveSub = true;
              
              // Cộng dồn tiền
              const amount = parseCurrency(transaction.amount || transaction.price);
              totalSpent += amount;

              // Cộng dồn ngày
              let daysToAdd = 30;
              if (transaction.pkg?.includes('3 Tháng') || transaction.package?.includes('3 Tháng')) daysToAdd = 90;
              if (transaction.pkg?.includes('6 tháng') || transaction.package?.includes('6 tháng')) daysToAdd = 180;

              let transDate = dayjs(transaction.date, 'HH:mm DD/MM/YYYY');
              if (!transDate.isValid()) transDate = dayjs(transaction.date);

              if (expiryDate.isBefore(transDate)) {
                  expiryDate = transDate.add(daysToAdd, 'day');
              } else {
                  expiryDate = expiryDate.add(daysToAdd, 'day');
              }
          }
      });

      // --- LOGIC XÁC ĐỊNH HẠNG (TIER) ---
      let currentTier = MEMBER_TIERS[0];
      let nextTier = MEMBER_TIERS[1];
      
      for (let i = 0; i < MEMBER_TIERS.length; i++) {
          if (totalSpent >= MEMBER_TIERS[i].min) {
              currentTier = MEMBER_TIERS[i];
              nextTier = MEMBER_TIERS[i + 1] || null; // Nếu max rồi thì không có next
          }
      }

      // Tính % tiến độ lên hạng sau
      let tierProgress = 100;
      let toNextTier = 0;
      
      if (nextTier) {
          const range = nextTier.min - currentTier.min;
          const current = totalSpent - currentTier.min;
          tierProgress = Math.min(Math.round((current / range) * 100), 100);
          toNextTier = nextTier.min - totalSpent;
      }

      const now = dayjs();
      const daysLeft = expiryDate.diff(now, 'day');
      const status = daysLeft > 0 ? 'active' : 'expired';

      return {
          plan: hasActiveSub ? 'Premium Member' : 'Free Member', // Tên gói hiển thị chung
          status: status,
          startDate: sortedHistory.length > 0 ? sortedHistory[0].date : dayjs().format('DD/MM/YYYY'),
          endDate: expiryDate.format('DD/MM/YYYY'),
          daysLeft: daysLeft > 0 ? daysLeft : 0,
          // Thông tin hạng
          tierData: currentTier,
          nextTier: nextTier,
          totalSpent: totalSpent,
          tierProgress: tierProgress,
          toNextTier: toNextTier
      };
  };

  // --- 3. LẤY DATA GIAO DỊCH TỪ LOCALSTORAGE ---
  const storedHistory = JSON.parse(localStorage.getItem('transaction_history') || localStorage.getItem('paymentHistory') || '[]');
  const initialPurchaseHistory = storedHistory.length > 0 ? [] : [
      { pkg: 'Gói 1 Tháng (Quà tặng)', date: '14:30 01/12/2024', amount: '0đ', status: 'success' }, // Demo
  ];
  const finalPurchaseHistory = [...storedHistory, ...initialPurchaseHistory];
  
  const subInfo = calculateSubscription(finalPurchaseHistory);

  // --- 4. STATE USER ---
  const [user, setUser] = useState({
    name: userRedux?.name || 'Lê Trí Thiện',
    email: userRedux?.email || 'letrithieng@gmail.com',
    phone: userRedux?.phone || '0942334470',
    avatar: userRedux?.avatar || myAvatar,
    
    dob: userRedux?.dob ? dayjs(userRedux.dob) : dayjs('2000-01-01'),
    gender: 'male',
    address: 'Bình Thạnh, TP. Hồ Chí Minh',
    joinDate: '20/12/2023',
    lastLogin: dayjs().format('HH:mm DD/MM/YYYY'),
    level: 'B1 (Trung cấp)',
    levelProgress: 65,
    subscription: subInfo, 
    learnedHistory: [
        { title: 'Check-in at Hotel', topic: 'Travel', score: 9, date: '15/02/2025', status: 'finish' },
        { title: 'Job Interview Basic', topic: 'Work', score: 8.5, date: '10/02/2025', status: 'finish' },
        { title: 'Ordering Coffee', topic: 'Daily Life', score: null, date: '05/02/2025', status: 'process' },
    ],
    purchaseHistory: finalPurchaseHistory
  });

  // Đồng bộ Redux -> State cục bộ
  useEffect(() => {
      if (userRedux) {
          setUser(prev => ({
              ...prev,
              name: userRedux.name || prev.name,
              avatar: userRedux.avatar || prev.avatar,
              email: userRedux.email || prev.email,
              phone: userRedux.phone || prev.phone
          }));
      }
  }, [userRedux]);

  // --- CÁC CỘT BẢNG ---
  const historyColumns = [
      { title: 'Bài học', dataIndex: 'title', key: 'title', render: t => <span style={{fontWeight: 500}}>{t}</span> },
      { title: 'Chủ đề', dataIndex: 'topic', key: 'topic', render: t => <Tag color="blue">{t}</Tag> },
      { title: 'Ngày học', dataIndex: 'date', key: 'date' },
      { title: 'Điểm số', dataIndex: 'score', key: 'score', align: 'center', render: s => s ? <Tag color="success"><b>{s}</b>/10</Tag> : <Tag>Wait</Tag> },
      { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => s === 'finish' ? <Badge status="success" text="Hoàn thành" /> : <Badge status="processing" text="Đang học" /> }
  ];

  const transactionColumns = [
    { title: 'Gói cước', dataIndex: 'pkg', key: 'pkg', render: (t, r) => <Text strong>{t || r.package}</Text> },
    { title: 'Thời gian', dataIndex: 'date', key: 'date' },
    { title: 'Số tiền', dataIndex: 'amount', key: 'amount', align: 'right', render: (t, r) => <Text type="danger">{t || (r.price ? r.price.toLocaleString() + 'đ' : '0đ')}</Text> },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center', render: s => <Tag color={s === 'success' || s === 'paid' ? 'green' : (s === 'pending' ? 'orange' : 'red')}>{s === 'success' || s === 'paid' ? 'Thành công' : (s === 'pending' ? 'Chờ duyệt' : 'Thất bại')}</Tag> }
  ];

  // --- HÀM XỬ LÝ SỰ KIỆN ---
  
  const handleUpdateInfo = (values) => {
    setUser(prev => ({ ...prev, ...values }));
    // Cập nhật Redux để Header đổi tên theo
    dispatch(updateUser(values));
    message.success('Cập nhật hồ sơ thành công!');
  };

  const handleChangePass = () => {
    message.loading('Đang đổi mật khẩu...', 1).then(() => {
        message.success('Đổi mật khẩu thành công!');
        passwordForm.resetFields();
    });
  };

  const handleLogout = () => {
      dispatch(logout()); 
      navigate('/login');
  };

  const handleAvatarUpload = (info) => {
      const file = info.file;
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
          message.error('Bạn chỉ có thể tải lên file ảnh!');
          return Upload.LIST_IGNORE;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
          const newAvatar = e.target.result;
          setUser(prev => ({ ...prev, avatar: newAvatar }));
          // Cập nhật Redux để Header đổi ảnh theo
          dispatch(updateUser({ avatar: newAvatar }));
          message.success('Đã thay đổi ảnh đại diện!');
      };
      reader.readAsDataURL(file); 
      return false; 
  };

  const handleChoosePackage = (pkg) => {
    setIsRenewModalOpen(false);
    navigate('/payment', { 
        state: { 
            selectedPackage: {
                id: pkg.id,
                name: pkg.name,
                price: pkg.value,
                duration: pkg.duration
            } 
        } 
    });
  };

  // COMPONENTS CON
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
                    <Progress percent={user.levelProgress} strokeColor={customStyles.primaryColor} trailColor="#d9f7be" />
                </Col>
                <Col span={8} style={{textAlign: 'center', borderLeft: '1px solid #eee'}}>
                    <Statistic title="Bài đã học" value={user.learnedHistory.length} prefix={<CheckCircleOutlined style={{color: '#52c41a'}} />} />
                    <Divider style={{margin: '12px 0'}} />
                     <Statistic title="Hạn sử dụng" value={user.subscription.daysLeft} suffix="ngày" prefix={<ClockCircleOutlined style={{color: '#fa8c16'}} />} valueStyle={{ fontWeight: 'bold', fontSize: 20 }} />
                </Col>
            </Row>
        </Card>
        <Title level={5}><HistoryOutlined /> Bài học gần đây</Title>
        <div style={{padding: '0 12px'}}>
            <Timeline items={user.learnedHistory.map((item, idx) => ({
                    color: item.status === 'finish' ? 'green' : 'blue',
                    children: <Text>{item.title} - <Text type="secondary">{item.date}</Text></Text>
                }))}
            />
        </div>
        <div style={{ textAlign: 'center' }}><Button type="dashed" onClick={() => setIsHistoryModalOpen(true)}>Xem tất cả lịch sử</Button></div>
    </div>
  );

  const BillingTab = () => {
      const recentTransactions = user.purchaseHistory.slice(0, 10);
      const hasMore = user.purchaseHistory.length > 10;
      const { tierData, nextTier, totalSpent, tierProgress, toNextTier } = user.subscription;

      return (
        <div>
            {/* THẺ HẠNG THÀNH VIÊN */}
            <Card style={{ ...customStyles.cardShadow, background: `linear-gradient(135deg, #fff 0%, ${tierData.color}15 100%)`, border: `1px solid ${tierData.color}40` }} bodyStyle={{padding: 24}} bordered={false}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Space align="start">
                            <Avatar size={54} style={{ backgroundColor: tierData.color }} icon={tierData.icon} />
                            <div>
                                <Title level={4} style={{ margin: 0, color: tierData.key === 'gold' ? '#d48806' : '#333' }}>{tierData.name}</Title>
                                {user.subscription.daysLeft > 0 
                                    ? <Badge status="processing" text={<Text type="success">Đang hoạt động</Text>} />
                                    : <Badge status="error" text={<Text type="danger">Hết hạn gói học</Text>} />
                                }
                            </div>
                        </Space>
                    </Col>
                    <Col style={{textAlign: 'right'}}>
                        <Button type="primary" shape="round" size="large" onClick={() => setIsRenewModalOpen(true)} style={{background: tierData.color, borderColor: tierData.color}}>
                            Mua gói cước mới
                        </Button>
                    </Col>
                </Row>
                
                <Divider style={{margin: '20px 0', borderColor: '#eee'}} />
                
                {/* THANH TIẾN ĐỘ LÊN HẠNG */}
                {nextTier ? (
                    <div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
                            <Text type="secondary">Tổng chi tiêu: <b style={{color: '#333'}}>{totalSpent.toLocaleString()}đ</b></Text>
                            <Text type="secondary">Mục tiêu: <b style={{color: tierData.color}}>{nextTier.name}</b></Text>
                        </div>
                        <Tooltip title={`Chi tiêu thêm ${toNextTier.toLocaleString()}đ để lên hạng ${nextTier.name}`}>
                            <Progress percent={tierProgress} strokeColor={tierData.color} trailColor="#f0f0f0" status="active" />
                        </Tooltip>
                        <Text style={{fontSize: 12, color: '#888'}}>
                            Cần tích lũy thêm <b>{toNextTier.toLocaleString()}đ</b> để thăng hạng.
                        </Text>
                    </div>
                ) : (
                    <div>
                        <Progress percent={100} strokeColor="#1890ff" format={() => 'MAX LEVEL'} />
                        <Text type="success">Chúc mừng! Bạn đã đạt hạng thành viên cao nhất.</Text>
                    </div>
                )}
            </Card>
            
            <Title level={5} style={{margin: '24px 0 16px'}}><WalletOutlined /> Lịch sử giao dịch (10 gần nhất)</Title>
            
            <List 
              dataSource={recentTransactions} 
              renderItem={item => (
                  <List.Item style={{padding: '12px 0'}}>
                      <List.Item.Meta 
                          avatar={<Avatar style={{ backgroundColor: (item.status === 'success' || item.status === 'paid') ? '#f6ffed' : '#fff1f0', color: (item.status === 'success' || item.status === 'paid') ? '#52c41a' : '#cf1322' }} icon={(item.status === 'success' || item.status === 'paid') ? <CheckCircleOutlined /> : <ClockCircleOutlined />} />} 
                          title={<Text strong>{item.pkg || item.package}</Text>} 
                          description={<Text type="secondary"><ClockCircleOutlined style={{marginRight: 5}}/>{item.date}</Text>} 
                      />
                      <div style={{textAlign: 'right'}}>
                          <Text strong style={{fontSize: 16, color: customStyles.primaryColor}}>{item.amount || (item.price ? parseInt(item.price).toLocaleString() + 'đ' : '0đ')}</Text>
                          <br/>
                          <Tag color={(item.status === 'success' || item.status === 'paid') ? 'green' : (item.status === 'pending' ? 'orange' : 'default')}>
                              {(item.status === 'success' || item.status === 'paid') ? 'Thành công' : (item.status === 'pending' ? 'Chờ duyệt' : 'Hết hạn')}
                          </Tag>
                      </div>
                  </List.Item>
              )} 
             />
             
             {hasMore && (
                 <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button type="dashed" icon={<UnorderedListOutlined />} onClick={() => setIsTransactionModalOpen(true)}>
                        Xem tất cả giao dịch
                    </Button>
                 </div>
             )}
        </div>
    );
  };

  const SettingsTab = () => (
      <Row gutter={32}>
          <Col span={24} lg={12}>
              <Card title={<span><EditOutlined /> Hồ sơ cá nhân</span>} bordered={false} style={{...customStyles.cardShadow, marginBottom: 24}} headStyle={{background: '#fafafa'}}>
                  <Form layout="vertical" initialValues={user} onFinish={handleUpdateInfo} form={form}>
                      <Form.Item label="Họ và tên" name="name" rules={[{required: true}]}><Input prefix={<UserOutlined style={{color: '#bfbfbf'}} />} size="large" /></Form.Item>
                      <Form.Item label="Email" name="email"><Input disabled prefix={<MailOutlined style={{color: '#bfbfbf'}} />} size="large" style={{backgroundColor: '#f5f5f5'}} /></Form.Item>
                      <Form.Item label="Số điện thoại" name="phone"><Input prefix={<PhoneOutlined style={{color: '#bfbfbf'}} />} size="large" /></Form.Item>
                      <Form.Item label="Ngày sinh" name="dob"><DatePicker size="large" style={{width: '100%'}} format="DD/MM/YYYY" /></Form.Item>
                      <Col span={24} style={{textAlign: 'right'}}><Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />} size="large" style={{backgroundColor: customStyles.primaryColor, borderColor: customStyles.primaryColor}}>Lưu hồ sơ</Button></Col>
                  </Form>
              </Card>
          </Col>
          <Col span={24} lg={12}>
              <Card title={<span><LockOutlined /> Bảo mật</span>} bordered={false} style={customStyles.cardShadow} headStyle={{background: '#fafafa'}}>
                  <Form layout="vertical" form={passwordForm} onFinish={handleChangePass}>
                      <Form.Item label="Mật khẩu mới" name="password" rules={[{required: true, min: 6}]}><Input.Password prefix={<LockOutlined style={{color: '#bfbfbf'}}/>} size="large" /></Form.Item>
                      <Col span={24} style={{textAlign: 'right'}}><Button type="default" danger htmlType="submit" size="large">Đổi mật khẩu</Button></Col>
                  </Form>
              </Card>
          </Col>
      </Row>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 20px', paddingBottom: 60 }}>
      <div style={{ marginBottom: 16 }}><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button></div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={7} lg={6}>
          <Card hoverable style={{ textAlign: 'center', ...customStyles.cardShadow }} bodyStyle={{padding: '30px 20px'}}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                <Avatar size={120} src={user.avatar} style={{ border: `4px solid ${customStyles.primaryColor}` }} icon={<UserOutlined />} />
                <Upload name="avatar" showUploadList={false} beforeUpload={(file) => handleAvatarUpload({ file })}>
                    <Tooltip title="Tải ảnh đại diện mới">
                        <Button type="primary" shape="circle" icon={<UploadOutlined />} size="middle" style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: customStyles.primaryColor, borderColor: customStyles.primaryColor }} />
                    </Tooltip>
                </Upload>
            </div>
            <Title level={3} style={{ marginBottom: 4 }}>{user.name}</Title>
            <Text type="secondary">{user.email}</Text>
            
            {/* Hiển thị Badge Hạng ở Sidebar */}
            <div style={{marginTop: 10}}>
                <Tag color={user.subscription.tierData.color} style={{fontSize: 14, padding: '4px 10px'}}>
                    {user.subscription.tierData.icon} {user.subscription.tierData.name}
                </Tag>
            </div>

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

      {/* MODAL LỊCH SỬ HỌC TẬP */}
      <Modal title="Lịch sử học tập đầy đủ" open={isHistoryModalOpen} onCancel={() => setIsHistoryModalOpen(false)} footer={null} width={700}>
          <Table dataSource={user.learnedHistory} columns={historyColumns} pagination={{ pageSize: 5 }} />
      </Modal>

      {/* MODAL LỊCH SỬ GIAO DỊCH (MỚI) */}
      <Modal title="Toàn bộ lịch sử giao dịch" open={isTransactionModalOpen} onCancel={() => setIsTransactionModalOpen(false)} footer={null} width={800}>
          <Table dataSource={user.purchaseHistory} columns={transactionColumns} pagination={{ pageSize: 10 }} rowKey={(r, i) => i} />
      </Modal>

      {/* MODAL GIA HẠN */}
      <Modal title={<div style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>Chọn gói nâng cấp</div>} open={isRenewModalOpen} onCancel={() => setIsRenewModalOpen(false)} footer={null} width={1000} centered>
         <div style={{ padding: '20px 0', background: '#f5f5f5', borderRadius: 8 }}>
            <Row gutter={[16, 16]} justify="center" style={{padding: '0 16px'}}>
                {pricingPackages.map((pkg) => (
                    <Col xs={24} md={8} key={pkg.id}>
                        <Card hoverable bordered={pkg.isPopular} style={{ textAlign: 'center', height: '100%', border: pkg.isPopular ? `2px solid ${pkg.color}` : '1px solid #d9d9d9', transform: pkg.isPopular ? 'scale(1.05)' : 'scale(1)', zIndex: pkg.isPopular ? 2 : 1, borderRadius: 12 }} bodyStyle={{ padding: '30px 20px' }}>
                            {pkg.isPopular && (<Tag color="#f50" style={{ position: 'absolute', top: 0, right: 0, padding: '4px 10px', fontSize: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 12, border: 'none' }}>BEST SELLER</Tag>)}
                            <Title level={4} style={{ color: pkg.color, marginTop: 10 }}>{pkg.name}</Title>
                            <Title level={2} style={{ margin: '15px 0' }}>{pkg.price}</Title>
                            <Paragraph type="secondary" style={{ minHeight: 44, marginBottom: 24 }}>{pkg.desc}</Paragraph>
                            <Button type={pkg.isPopular ? "primary" : "default"} size="large" shape="round" block style={{ backgroundColor: pkg.isPopular ? pkg.color : 'transparent', borderColor: pkg.color, color: pkg.isPopular ? '#fff' : pkg.color, fontWeight: 'bold', height: 45 }} onClick={() => handleChoosePackage(pkg)}>Chọn gói này</Button>
                        </Card>
                    </Col>
                ))}
            </Row>
         </div>
      </Modal>
    </div>
  );
};

export default Profile;