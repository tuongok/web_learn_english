import React, { useState } from 'react';
import { 
  Card, Tabs, Table, Tag, Button, Modal, Form, Input, 
  message, InputNumber, Space, Switch, Popconfirm, Tooltip, Typography 
} from 'antd';
import { 
  DollarOutlined, AppstoreOutlined, CommentOutlined, 
  EditOutlined, DeleteOutlined, PlusOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

const ContextManager = () => {
  //  STATE DỮ LIỆU 

  // FR-01: Gói học (Có thêm trường 'code' để phân biệt các giai đoạn giá)
  const [packages, setPackages] = useState([
    { 
      key: 1, code: '1', name: 'Gói 1 Tháng (Tháng 1)', 
      duration: '30 ngày', description: 'Truy cập cơ bản',
      price: 200000, salePrice: 159000, status: 'active' 
    },
    { 
      key: 2, code: '2', name: 'Gói 1 Tháng (Tháng 2)', 
      duration: '30 ngày', description: 'Giá mới áp dụng từ tháng 2',
      price: 250000, salePrice: 250000, status: 'inactive' 
    },
    { 
      key: 3, code: '3', name: 'Gói Trọn Đời', 
      duration: 'Vĩnh viễn', description: 'Full tính năng VIP',
      price: 2000000, salePrice: 1500000, status: 'active' 
    },
  ]);

  // FR-02: Chủ đề
  const [topics, setTopics] = useState([
    { key: 1, name: 'Du lịch (Travel)', description: 'Từ vựng sân bay, khách sạn...' },
    { key: 2, name: 'Công sở (Business)', description: 'Phỏng vấn, họp hành...' },
  ]);

  // FR-03: Hội thoại (Sắp xếp theo thời gian mới nhất)
  const [conversations, setConversations] = useState([
    { 
      key: 1, title: 'Check-in Hotel', content: 'A: Hello, I have a reservation.\nB: Can I see your ID?',
      level: 'B1', topic: 'Travel', author: 'Cô Lan', 
      createdAt: '2023-12-18 10:00', updatedAt: '2023-12-18 10:00', 
      active: true 
    },
    { 
      key: 2, title: 'Greetings', content: 'A: Hi, how are you?\nB: I am fine, thanks.',
      level: 'A1', topic: 'Daily', author: 'Thầy John', 
      createdAt: '2023-12-15 09:30', updatedAt: '2023-12-16 14:20', 
      active: true 
    },
  ]);

  // MODAL STATES 
  const [isPkgModal, setIsPkgModal] = useState(false);
  const [isTopicModal, setIsTopicModal] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [formPkg] = Form.useForm();
  const [formTopic] = Form.useForm();

  // LOGIC XỬ LÝ FR-01 (GÓI HỌC) 
  const handleSavePkg = (values) => {
    if (editingItem) {
        // Sửa
        const newData = packages.map(p => p.key === editingItem.key ? { ...p, ...values } : p);
        setPackages(newData);
        message.success('Cập nhật gói học thành công');
    } else {
        // Thêm mới
        const newPkg = { ...values, key: Date.now(), status: 'active' };
        setPackages([...packages, newPkg]);
        message.success('Thêm gói học mới thành công');
    }
    setIsPkgModal(false); formPkg.resetFields();
  };

  const handleDeletePkg = (key) => {
      // Soft delete (Vô hiệu hóa) hoặc Xóa hẳn tùy logic
      setPackages(packages.filter(p => p.key !== key));
      message.success('Đã xóa gói học');
  };

  //  LOGIC XỬ LÝ FR-02 (CHỦ ĐỀ)
  const handleSaveTopic = (values) => {
      if (editingItem) {
          setTopics(topics.map(t => t.key === editingItem.key ? { ...t, ...values } : t));
      } else {
          setTopics([...topics, { ...values, key: Date.now() }]);
      }
      setIsTopicModal(false); formTopic.resetFields(); message.success('Lưu chủ đề thành công');
  };

  const handleDeleteTopic = (key) => {
      setTopics(topics.filter(t => t.key !== key));
      message.success('Đã xóa chủ đề');
  };

  // LOGIC XỬ LÝ FR-03 (HỘI THOẠI) 
  const handleToggleConv = (id, checked) => {
      const newData = conversations.map(c => c.key === id ? {...c, active: checked} : c);
      setConversations(newData);
      
      if (!checked) {
          // Logic: Thông báo tới giáo viên cập nhật hội thoại
          message.warning('Đã tắt hội thoại. Hệ thống đã gửi yêu cầu cập nhật tới Giáo viên');
      } else {
          message.success('Đã mở lại hội thoại');
      }
  };

  //  CỘT BẢNG 
  const pkgColumns = [
    { title: 'Mã gói', dataIndex: 'code', render: t => <Tag color="purple">{t}</Tag> },
    { 
        title: 'Tên & Mô tả', dataIndex: 'name', 
        render: (t, r) => <div><b>{t}</b><div style={{fontSize:12, color:'#888'}}>{r.description}</div></div> 
    },
    { title: 'Thời gian', dataIndex: 'duration', align: 'center' },
    { 
        title: 'Giá niêm yết', dataIndex: 'price', align: 'right',
        render: t => <Text delete style={{color: '#999'}}>{t.toLocaleString()} đ</Text> 
    },
    { 
        title: 'Giá thực tế', dataIndex: 'salePrice', align: 'right',
        render: t => <Text type="danger" strong>{t.toLocaleString()} đ</Text> 
    },
    { 
        title: 'Trạng thái', dataIndex: 'status', align: 'center',
        render: s => <Tag color={s==='active'?'success':'default'}>{s.toUpperCase()}</Tag> 
    },
    {
        title: 'Hành động', align: 'center',
        render: (_, r) => (
            <Space>
                <Button icon={<EditOutlined/>} size="small" onClick={() => { setEditingItem(r); formPkg.setFieldsValue(r); setIsPkgModal(true); }}/>
                <Popconfirm title="Xóa gói này?" onConfirm={() => handleDeletePkg(r.key)}>
                    <Button danger icon={<DeleteOutlined/>} size="small"/>
                </Popconfirm>
            </Space>
        )
    }
  ];

  const convColumns = [
      { 
          title: 'Hội thoại (Nội dung)', dataIndex: 'title', width: 300,
          render: (t, r) => (
              <div>
                  <div style={{fontWeight: 'bold', color: '#1890ff'}}>{t}</div>
                  <Paragraph ellipsis={{ rows: 2, expandable: false, symbol: 'more' }} style={{fontSize: 12, color: '#666', marginBottom: 0}}>
                      {r.content}
                  </Paragraph>
              </div>
          ) 
      },
      { 
          title: 'Phân loại', dataIndex: 'level', 
          render: (t, r) => (
              <Space direction="vertical" size={0}>
                  <Tag color="blue">{t}</Tag>
                  <Tag color="cyan" style={{marginTop: 4}}>{r.topic}</Tag>
              </Space>
          ) 
      },
      { title: 'Người tạo', dataIndex: 'author' },
      { 
          title: 'Cập nhật', dataIndex: 'updatedAt', 
          render: t => <div style={{fontSize: 12}}><ClockCircleOutlined/> {t}</div> 
      },
      {
          title: 'Mở/Tắt', dataIndex: 'active', align: 'center',
          render: (active, r) => (
              <Tooltip title={active ? "Đang hiển thị" : "Đang ẩn (Đã báo GV)"}>
                  <Switch checked={active} onChange={(checked) => handleToggleConv(r.key, checked)} />
              </Tooltip>
          )
      }
  ];

  return (
    <Card title="Quản trị Nội dung" bordered={false}>
      <Tabs type="card" items={[
        {
            //R-01: QUẢN LÝ GÓI HỌC
            key: '1', label: <span><DollarOutlined /> Gói học (Packages)</span>,
            children: (
                <>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => { setEditingItem(null); formPkg.resetFields(); setIsPkgModal(true); }} style={{marginBottom: 16}}>
                        Thêm Gói Mới
                    </Button>
                    <Table dataSource={packages} columns={pkgColumns} rowKey="key" />
                    
                    <Modal title={editingItem ? "Sửa Gói Học" : "Thêm Gói Học"} open={isPkgModal} onCancel={() => setIsPkgModal(false)} onOk={() => formPkg.submit()}>
                        <Form form={formPkg} layout="vertical" onFinish={handleSavePkg}>
                            <Space>
                                <Form.Item name="code" label="Mã gói (Phân biệt đợt giá)" rules={[{required: true}]}><Input placeholder="VD: PKG_JAN_2024"/></Form.Item>
                                <Form.Item name="name" label="Tên gói" rules={[{required: true}]}><Input placeholder="VD: Gói 1 Tháng"/></Form.Item>
                            </Space>
                            <Space>
                                <Form.Item name="price" label="Giá gốc (VNĐ)" rules={[{required: true}]}><InputNumber style={{width: 150}} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} /></Form.Item>
                                <Form.Item name="salePrice" label="Giá giảm (VNĐ)" rules={[{required: true}]}><InputNumber style={{width: 150}} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/></Form.Item>
                            </Space>
                            <Form.Item name="duration" label="Thời hạn" rules={[{required: true}]}><Input placeholder="VD: 30 ngày, 3 tháng..."/></Form.Item>
                            <Form.Item name="description" label="Mô tả / Giới thiệu"><Input.TextArea rows={3}/></Form.Item>
                        </Form>
                    </Modal>
                </>
            )
        },
        {
            //FR-02: DANH MỤC CHỦ ĐỀ
            key: '2', label: <span><AppstoreOutlined /> Danh mục Chủ đề</span>,
            children: (
                <>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => { setEditingItem(null); formTopic.resetFields(); setIsTopicModal(true); }} style={{marginBottom: 16}}>
                        Thêm Chủ đề
                    </Button>
                    <Table dataSource={topics} rowKey="key" columns={[
                        { title: 'Tên Chủ đề', dataIndex: 'name', render: t => <b>{t}</b> },
                        { title: 'Mô tả', dataIndex: 'description' },
                        { title: 'Hành động', width: 150, render: (_, r) => (
                            <Space>
                                <Button icon={<EditOutlined/>} size="small" onClick={() => { setEditingItem(r); formTopic.setFieldsValue(r); setIsTopicModal(true); }}/>
                                <Popconfirm title="Xóa chủ đề này?" onConfirm={() => handleDeleteTopic(r.key)}>
                                    <Button danger icon={<DeleteOutlined/>} size="small"/>
                                </Popconfirm>
                            </Space>
                        )}
                    ]} pagination={false}/>

                    <Modal title={editingItem ? "Sửa Chủ đề" : "Thêm Chủ đề"} open={isTopicModal} onCancel={() => setIsTopicModal(false)} onOk={() => formTopic.submit()}>
                        <Form form={formTopic} onFinish={handleSaveTopic} layout="vertical">
                            <Form.Item name="name" label="Tên chủ đề" rules={[{required:true}]}><Input/></Form.Item>
                            <Form.Item name="description" label="Mô tả ngắn"><Input.TextArea/></Form.Item>
                        </Form>
                    </Modal>
                </>
            )
        },
        {
            // FR-03: QUẢN LÝ HỘI THOẠI
            key: '3', label: <span><CommentOutlined /> Quản lý Hội thoại</span>,
            children: (
                <>
                   <div style={{marginBottom: 16, fontStyle: 'italic', color: '#666'}}>
                       * Danh sách hiển thị theo thứ tự mới nhất. Tắt hội thoại sẽ tự động gửi yêu cầu cập nhật tới giáo viên.
                   </div>
                   <Table 
                        // Sắp xếp theo thời gian tạo mới nhất
                        dataSource={[...conversations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} 
                        columns={convColumns} 
                        rowKey="key" 
                   />
                </>
            )
        }
      ]} />
    </Card>
  );
};
export default ContextManager;