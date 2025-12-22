import React, { useState } from 'react';
import { 
  Table, Tag, Button, Space, Card, Avatar, Modal, Descriptions, 
  message, Popconfirm, Form, Input, Select, List, Timeline, Divider 
} from 'antd';
import { 
  UserOutlined, EyeOutlined, CheckOutlined, StopOutlined, 
  KeyOutlined, DeleteOutlined, PlusOutlined, 
  HistoryOutlined, BookOutlined 
} from '@ant-design/icons';

const { Option } = Select;

// --- DỮ LIỆU MẪU (Dùng khi chưa có trong LocalStorage) ---
const DEFAULT_USERS = [
    { 
      key: 'GV001', name: 'Thầy John', role: 'teacher', email: 'john@school.com', status: 'active', 
      phone: '0909876543', workUnit: 'Trung tâm Anh ngữ A', createdTopics: ['Travel', 'Business'], createdConvos: ['At the Airport']
    },
    { 
      key: 'HV101', name: 'Nguyễn Văn A', role: 'learner', email: 'user@gmail.com', status: 'active', 
      phone: '0901234567', level: 'A1', currentPackage: 'Gói 3 Tháng', lastLogin: '2023-12-18 08:30', 
      learnedHistory: ['Greeting (A1)'], purchaseHistory: []
    },
    { 
      key: 'GV002', name: 'Cô Lan (Mới)', role: 'teacher', email: 'lan@school.com', status: 'pending', 
      phone: '0912345678', workUnit: 'Đại học Sư Phạm', createdTopics: [], createdConvos: [] 
    },
];

const UserAdmin = () => {
  // --- 1. STATE DỮ LIỆU (KHỞI TẠO TỪ LOCAL STORAGE) ---
  const [users, setUsers] = useState(() => {
      const saved = localStorage.getItem('admin_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  // STATES UI
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [formPass] = Form.useForm();
  const [formUser] = Form.useForm();

  const roleMap = {
      teacher: 'Giáo viên',
      learner: 'Học viên',
      admin: 'Quản trị viên'
  };

  const statusMap = {
      active: 'Hoạt động',
      pending: 'Chờ duyệt',
      inactive: 'Vô hiệu hóa'
  };

  // HÀM LƯU LOCAL STORAGE
  const saveToStorage = (data) => {
      localStorage.setItem('admin_users', JSON.stringify(data));
  };

  // HÀM SINH MÃ TỰ ĐỘNG 
  const generateId = (role) => {
      let prefix = 'US';
      if (role === 'teacher') prefix = 'GV';
      if (role === 'learner') prefix = 'HV';
      if (role === 'admin') prefix = 'AD';

      const existingIds = users
          .filter(u => u.key.startsWith(prefix))
          .map(u => parseInt(u.key.replace(prefix, '')) || 0);

      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
      return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
  };

  // --- CÁC HÀM XỬ LÝ LOGIC ---

  const handleDelete = (key) => {
    const newData = users.filter(u => u.key !== key);
    setUsers(newData);
    saveToStorage(newData); // Lưu ngay
    message.success('Đã xóa người dùng thành công');
  };

  const handleToggleStatus = (record) => {
    const newStatus = record.status === 'active' ? 'inactive' : 'active';
    const newData = users.map(u => u.key === record.key ? { ...u, status: newStatus } : u);
    
    setUsers(newData);
    saveToStorage(newData); // Lưu ngay
    
    message.info(`Đã cập nhật trạng thái thành: ${newStatus === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}`);
  };

  const handleChangePassword = (values) => {
    // Lưu ý: Thực tế không lưu password vào localStorage vì bảo mật.
    // Ở đây chỉ mô phỏng thao tác thành công.
    message.success(`Đã cập nhật mật khẩu cho ${selectedUser.name}`);
    setIsPassOpen(false);
    formPass.resetFields();
  };

  const handleSaveUser = (values) => {
    let newData;

    if (selectedUser) {
        // Cập nhật
        newData = users.map(u => u.key === selectedUser.key ? {...u, ...values} : u);
        message.success('Cập nhật thông tin thành công');
    } else {
        // Thêm mới
        const newId = generateId(values.role); 
        const newUser = { 
            ...values, 
            key: newId, 
            status: 'active', 
            // Các trường mặc định cho user mới
            workUnit: values.workUnit || 'Chưa cập nhật', 
            createdTopics: [], createdConvos: [],
            level: 'A1', currentPackage: 'Chưa có', purchaseHistory: [], learnedHistory: []
        };
        newData = [...users, newUser];
        message.success(`Thêm thành công người dùng mới: ${newId}`);
    }

    setUsers(newData);
    saveToStorage(newData); // Lưu ngay
    setIsEditModalOpen(false);
    formUser.resetFields();
  };

  // GIAO DIỆN CON (CHI TIẾT)
  const TeacherProfile = ({ user }) => (
    <div>
        <Descriptions title={`Hồ sơ Giáo viên (${user.key})`} bordered column={1} size="small">
            <Descriptions.Item label="Mã Giáo viên">{user.key}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Đơn vị công tác">{user.workUnit}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{user.phone}</Descriptions.Item>
        </Descriptions>
        <Divider orientation="left" plain><BookOutlined /> Các chủ đề sẽ tạo</Divider>
        <List size="small" bordered dataSource={user.createdTopics} renderItem={item => <List.Item>• {item}</List.Item>} locale={{ emptyText: 'Trống' }} />
    </div>
  );

  const LearnerProfile = ({ user }) => (
    <div>
        <Descriptions title={`Hồ sơ Người học (${user.key})`} bordered column={1} size="small">
            <Descriptions.Item label="Mã Học viên">{user.key}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Level"><Tag color="blue">{user.level}</Tag></Descriptions.Item>
            <Descriptions.Item label="Gói học"><Tag color="gold">{user.currentPackage}</Tag></Descriptions.Item>
        </Descriptions>
        <Divider orientation="left" plain><HistoryOutlined /> Lịch sử mua gói</Divider>
        <Timeline mode="left">
            {user.purchaseHistory?.length > 0 ? user.purchaseHistory.map((h, i) => (
                <Timeline.Item key={i} color="green"><p><b>{h.pkg}</b></p></Timeline.Item>
            )) : <div style={{fontStyle:'italic', color:'#999', marginLeft: 20}}>Chưa có lịch sử mua</div>}
        </Timeline>
    </div>
  );

  // CỘT BẢNG 
  const columns = [
    {
      title: 'Mã & Họ tên', dataIndex: 'name', key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: record.role === 'teacher' ? '#1890ff' : '#87d068' }} icon={<UserOutlined />} />
          <div>
            <div style={{fontSize: 11, color: '#999', fontWeight: 'bold'}}>{record.key}</div>
            <div style={{fontWeight: 500}}>{text}</div>
          </div>
        </Space>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email', responsive: ['md'] },
    { 
        title: 'Vai trò', dataIndex: 'role', 
        render: role => <Tag color={role === 'teacher' ? 'blue' : (role==='admin'?'red':'green')}>{roleMap[role]}</Tag> 
    },
    { 
        title: 'Trạng thái', dataIndex: 'status', 
        render: s => <Tag color={s === 'active' ? 'success' : (s === 'pending' ? 'orange' : 'red')}>{statusMap[s]}</Tag> 
    },
    {
      title: 'Hành động', key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} onClick={() => { setSelectedUser(record); setIsDetailOpen(true); }} />
          <Button icon={<KeyOutlined />} onClick={() => { setSelectedUser(record); setIsPassOpen(true); }} />
          
          <Popconfirm title="Đổi trạng thái?" okText="Đồng ý" cancelText="Hủy" onConfirm={() => handleToggleStatus(record)}>
             <Button type={record.status === 'active' ? 'default' : 'primary'} danger={record.status === 'active'} icon={record.status === 'active' ? <StopOutlined /> : <CheckOutlined />} />
          </Popconfirm>
          
          <Popconfirm title="Xóa người dùng này?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(record.key)}>
             <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
        title="Quản trị Người dùng" 
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedUser(null); setIsEditModalOpen(true); formUser.resetFields(); }}>Thêm người dùng</Button>}
        bordered={false}
    >
      <Table dataSource={users} columns={columns} pagination={{ pageSize: 5 }} />

      {/* MODAL CHI TIẾT */}
      <Modal title="Hồ sơ chi tiết" open={isDetailOpen} onCancel={() => setIsDetailOpen(false)} footer={null} width={600}>
        {selectedUser && (selectedUser.role === 'teacher' ? <TeacherProfile user={selectedUser} /> : <LearnerProfile user={selectedUser} />)}
      </Modal>

      {/* MODAL THÊM / SỬA USER */}
      <Modal 
        title={selectedUser ? "Sửa thông tin" : "Thêm người dùng mới"} 
        open={isEditModalOpen} 
        onCancel={() => setIsEditModalOpen(false)} 
        onOk={() => formUser.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
          <Form form={formUser} layout="vertical" onFinish={handleSaveUser}>
              {/* Khi sửa thì load dữ liệu vào, khi thêm mới thì clear */}
              {selectedUser && (
                <div style={{marginBottom: 16, fontWeight: 'bold', color: '#1890ff'}}>
                    Đang chỉnh sửa: {selectedUser.key}
                </div>
              )}
              
              <Form.Item 
                name="name" 
                label="Họ tên" 
                initialValue={selectedUser?.name}
                rules={[{required: true, message: 'Vui lòng nhập họ tên!'}]}
              >
                  <Input placeholder="Nhập họ tên" />
              </Form.Item>

              <Form.Item 
                name="email" 
                label="Email" 
                initialValue={selectedUser?.email}
                rules={[
                    {required: true, message: 'Vui lòng nhập email!'},
                    {type: 'email', message: 'Email không hợp lệ!'}
                ]}
              >
                  <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item name="phone" label="Số điện thoại" initialValue={selectedUser?.phone}>
                  <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item 
                name="role" 
                label="Phân quyền" 
                initialValue={selectedUser?.role}
                rules={[{required: true, message: 'Vui lòng chọn vai trò!'}]}
              >
                  <Select placeholder="Chọn vai trò" disabled={!!selectedUser}> 
                      {/* Có thể disable không cho sửa quyền nếu muốn */}
                      <Option value="learner">Học viên</Option>
                      <Option value="teacher">Giáo viên</Option>
                      <Option value="admin">Quản trị viên</Option>
                  </Select>
              </Form.Item>

              {/* Render có điều kiện: Nếu chọn giáo viên mới hiện ô nhập đơn vị công tác */}
              <Form.Item noStyle shouldUpdate={(prev, current) => prev.role !== current.role}>
                  {({ getFieldValue }) => getFieldValue('role') === 'teacher' && (
                      <Form.Item 
                        name="workUnit" 
                        label="Đơn vị công tác"
                        initialValue={selectedUser?.workUnit}
                        rules={[{required: true, message: 'Vui lòng nhập đơn vị công tác!'}]}
                      >
                          <Input placeholder="Nhập nơi làm việc" />
                      </Form.Item>
                  )}
              </Form.Item>
          </Form>
      </Modal>

      {/* MODAL ĐỔI PASS */}
      <Modal 
        title={`Đặt lại mật khẩu: ${selectedUser?.name}`} 
        open={isPassOpen} 
        onCancel={() => setIsPassOpen(false)} 
        onOk={() => formPass.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={formPass} onFinish={handleChangePassword} layout="vertical">
            <Form.Item 
                name="newPassword" 
                label="Mật khẩu mới" 
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới' }, 
                    { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }
                ]}
            >
                <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserAdmin;