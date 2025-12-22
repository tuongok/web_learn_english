import React, { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Select, Space, Tag, message, Card, Alert, Upload, Image, Popconfirm } from 'antd';
import { 
  MessageOutlined, PlusOutlined, DeleteOutlined, BookOutlined, 
  BarsOutlined, EditOutlined, UploadOutlined, VideoCameraOutlined 
} from '@ant-design/icons';

const { Option } = Select;

// --- DỮ LIỆU MẪU (Sẽ hiển thị nếu chưa có dữ liệu trong LocalStorage) ---
const DEFAULT_LEVELS = [
    { key: 1, name: 'A1 (Sơ cấp)' }, 
    { key: 2, name: 'B1 (Trung cấp)' }
];

const DEFAULT_CONVS = [
    { key: 1, title: 'Greetings', level: 'A1 (Sơ cấp)', topic: 'Daily', count: 2, sentences: [{role: 'A', text: 'Hi'}, {role: 'B', text: 'Hello'}] }
];

const DEFAULT_DICT = [
    { key: 1, word: 'Hello', type: 'noun', meaning: 'Xin chào', family: 'Hi' }
];

const TeacherModules = () => {
  // --- 1. STATE DỮ LIỆU (KHỞI TẠO TỪ LOCAL STORAGE) ---
  
  // FR-01: Levels
  const [levels, setLevels] = useState(() => {
      const saved = localStorage.getItem('teacher_levels');
      return saved ? JSON.parse(saved) : DEFAULT_LEVELS;
  });

  // FR-02: Conversations
  const [conversations, setConversations] = useState(() => {
      const saved = localStorage.getItem('teacher_conversations');
      return saved ? JSON.parse(saved) : DEFAULT_CONVS;
  });

  // FR-03: Dictionary
  const [dictionary, setDictionary] = useState(() => {
      const saved = localStorage.getItem('teacher_dictionary');
      return saved ? JSON.parse(saved) : DEFAULT_DICT;
  });
  
  // State quản lý Modal
  const [isLevelModal, setIsLevelModal] = useState(false);
  const [isConvModal, setIsConvModal] = useState(false);
  const [isDictModal, setIsDictModal] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);

  // Forms
  const [formLevel] = Form.useForm();
  const [formConv] = Form.useForm();
  const [formDict] = Form.useForm();

  // HÀM HỖ TRỢ UPLOAD 
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // HÀM HỖ TRỢ LƯU LOCAL STORAGE
  const saveStorage = (key, data) => {
      localStorage.setItem(key, JSON.stringify(data));
  };

  // HÀM CHUNG: XỬ LÝ MỞ MODAL 
  const openModal = (type, record = null) => {
      setEditingItem(record);
      if (type === 'level') {
          if (record) formLevel.setFieldsValue(record); else formLevel.resetFields();
          setIsLevelModal(true);
      } else if (type === 'conv') {
          if (record) formConv.setFieldsValue(record); else formConv.resetFields();
          setIsConvModal(true);
      } else if (type === 'dict') {
          if (record) formDict.setFieldsValue(record); else formDict.resetFields();
          setIsDictModal(true);
      }
  };

  //  FR-01: QUẢN LÝ LEVEL 
  const handleSaveLevel = (values) => {
    let newData;
    if (editingItem) {
        newData = levels.map(l => l.key === editingItem.key ? { ...l, ...values } : l);
        message.success('Cập nhật Level thành công');
    } else {
        newData = [...levels, { key: Date.now(), name: values.name }];
        message.success('Thêm Level thành công');
    }
    setLevels(newData);
    saveStorage('teacher_levels', newData); // Lưu ngay
    setIsLevelModal(false);
  };

  const handleDeleteLevel = (key) => {
      const newData = levels.filter(item => item.key !== key);
      setLevels(newData);
      saveStorage('teacher_levels', newData); // Lưu ngay
      message.success('Đã xóa Level');
  };

  // FR-02: QUẢN LÝ HỘI THOẠI 
  const handleSaveConv = (values) => {
    const isDuplicate = conversations.some(c => c.title.toLowerCase() === values.title.toLowerCase() && c.key !== editingItem?.key);
    if (isDuplicate) {
        return message.error('Tiêu đề hội thoại này đã tồn tại!');
    }

    // Xử lý link ảnh
    let mediaUrl = null;
    if (values.media && values.media.length > 0) {
        // Lưu ý: LocalStorage có giới hạn dung lượng, nếu ảnh Base64 quá nặng sẽ lỗi.
        // Ở đây ta dùng URL giả hoặc thumbUrl nếu nhẹ.
        mediaUrl = values.media[0].thumbUrl || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    }

    const newConv = { 
        ...values, 
        key: editingItem ? editingItem.key : Date.now(), 
        count: values.sentences ? values.sentences.length : 0,
        media: mediaUrl,
        // Cần loại bỏ trường 'media' (file object) trước khi lưu vào localStorage để tránh lỗi
        // Ta chỉ lưu mediaUrl dạng string thôi
    };

    let newData;
    if (editingItem) {
        newData = conversations.map(c => c.key === editingItem.key ? newConv : c);
        message.success('Cập nhật hội thoại thành công');
    } else {
        newData = [...conversations, newConv];
        message.success('Tạo hội thoại thành công');
    }
    
    setConversations(newData);
    saveStorage('teacher_conversations', newData); // Lưu ngay
    setIsConvModal(false);
  };

  const handleDeleteConv = (key) => {
      const newData = conversations.filter(c => c.key !== key);
      setConversations(newData);
      saveStorage('teacher_conversations', newData); // Lưu ngay
      message.success('Đã xóa hội thoại');
  };

  //FR-03: QUẢN LÝ TỪ ĐIỂN 
  const handleSaveDict = (values) => {
     const newWord = { ...values, key: editingItem ? editingItem.key : Date.now() };
     let newData;
     if (editingItem) {
         newData = dictionary.map(d => d.key === editingItem.key ? newWord : d);
         message.success('Cập nhật từ vựng thành công');
     } else {
         newData = [...dictionary, newWord];
         message.success('Thêm từ mới thành công');
     }
     setDictionary(newData);
     saveStorage('teacher_dictionary', newData); // Lưu ngay
     setIsDictModal(false);
  };

  const handleDeleteDict = (key) => {
      const newData = dictionary.filter(d => d.key !== key);
      setDictionary(newData);
      saveStorage('teacher_dictionary', newData); // Lưu ngay
      message.success('Đã xóa từ vựng');
  };

  return (
    <Card title="Chức năng Giáo viên (Teacher Modules)" bordered={false}>
      <Tabs type="card" items={[
        {
            key: '1', label: <span><BarsOutlined/> Danh mục Level</span>,
            children: (
                <>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('level')} style={{marginBottom: 16}}>Thêm Level</Button>
                    <Table dataSource={levels} rowKey="key" columns={[
                        { title: 'Tên Level', dataIndex: 'name' },
                        { title: 'Hành động', width: 150, render: (_, r) => (
                            <Space>
                                <Button icon={<EditOutlined/>} size="small" onClick={() => openModal('level', r)}/>
                                <Popconfirm title="Xóa level này?" onConfirm={() => handleDeleteLevel(r.key)}>
                                    <Button danger size="small" icon={<DeleteOutlined/>}/>
                                </Popconfirm>
                            </Space>
                        ) }
                    ]} pagination={false}/>
                    <Modal title={editingItem ? "Sửa Level" : "Thêm Level Mới"} open={isLevelModal} onCancel={() => setIsLevelModal(false)} onOk={() => formLevel.submit()}>
                        <Form form={formLevel} onFinish={handleSaveLevel}>
                            <Form.Item name="name" label="Tên Level" rules={[{required:true, message: 'Vui lòng nhập tên Level'}]}><Input placeholder="VD: C1 (Cao cấp)"/></Form.Item>
                        </Form>
                    </Modal>
                </>
            )
        },
        {
            key: '2', label: <span><MessageOutlined/> Quản lý Hội thoại</span>,
            children: (
                <>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('conv')} style={{marginBottom: 16, backgroundColor: '#fa8c16', borderColor: '#fa8c16'}}>Tạo bài hội thoại</Button>
                    <Table dataSource={conversations} rowKey="key" columns={[
                        { title: 'Media', dataIndex: 'media', width: 80, render: src => src ? <Image src={src} width={50}/> : <VideoCameraOutlined style={{fontSize: 24, color: '#ccc'}}/> },
                        { title: 'Tiêu đề', dataIndex: 'title', render: t => <b>{t}</b> },
                        { title: 'Level', dataIndex: 'level', render: t => <Tag color="blue">{t}</Tag> },
                        { title: 'Chủ đề', dataIndex: 'topic' },
                        { title: 'Số câu', dataIndex: 'count', align: 'center' },
                        { title: 'Hành động', width: 120, render: (_, r) => (
                            <Space>
                                <Button icon={<EditOutlined/>} size="small" onClick={() => openModal('conv', r)}/>
                                <Popconfirm title="Xóa hội thoại?" onConfirm={() => handleDeleteConv(r.key)}>
                                    <Button danger size="small" icon={<DeleteOutlined/>}/>
                                </Popconfirm>
                            </Space>
                        )}
                    ]}/>
                    
                    <Modal title={editingItem ? "Chỉnh sửa Hội thoại" : "Tạo Hội thoại mới"} width={850} open={isConvModal} onCancel={() => setIsConvModal(false)} footer={null} style={{top: 20}}>
                        <Alert message="Hệ thống tự động hiển thị số dòng tương ứng với số câu bạn thêm (Tối đa 10 câu)." type="info" showIcon style={{ marginBottom: 16 }} />
                        <Form form={formConv} layout="vertical" onFinish={handleSaveConv}>
                            <Card size="small" title="Thông tin chung & Media" style={{marginBottom: 16}}>
                                <Space align="start" size="large" style={{display: 'flex'}}>
                                    <div style={{flex: 1}}>
                                        <Form.Item name="title" label="Tiêu đề" rules={[{required: true, message: 'Nhập tiêu đề'}]}>
                                            <Input placeholder="VD: At the Coffee Shop"/>
                                        </Form.Item>
                                        <Space>
                                            <Form.Item name="level" label="Level" rules={[{required: true, message: 'Chọn Level'}]} style={{width: 150}}>
                                                <Select>{levels.map(l => <Option key={l.key} value={l.name}>{l.name}</Option>)}</Select>
                                            </Form.Item>
                                            <Form.Item name="topic" label="Chủ đề" rules={[{required: true, message: 'Chọn chủ đề'}]} style={{width: 180}}>
                                                <Select placeholder="Chọn chủ đề"><Option value="Travel">Du lịch</Option><Option value="Work">Công việc</Option><Option value="Daily">Đời sống</Option></Select>
                                            </Form.Item>
                                        </Space>
                                    </div>
                                    <div style={{width: 200}}>
                                        {/* */}
                                        <Form.Item 
                                            name="media" 
                                            label="Hình ảnh / Video minh họa" 
                                            valuePropName="fileList"
                                            getValueFromEvent={normFile} //  Hàm chuyển đổi dữ liệu
                                        >
                                            <Upload 
                                                name="logo" 
                                                listType="picture" 
                                                maxCount={1}
                                                beforeUpload={() => false} // <--- Ngăn không cho upload tự động lên server (Tránh lỗi 404)
                                            >
                                                <Button icon={<UploadOutlined />}>Tải lên Media</Button>
                                            </Upload>
                                        </Form.Item>
                                    </div>
                                </Space>
                            </Card>

                            <Card size="small" title="Nội dung hội thoại">
                                <Form.List name="sentences">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }, index) => (
                                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                                    <div style={{paddingTop: 8, fontWeight: 'bold', width: 30}}>#{index + 1}</div>
                                                    <Form.Item {...restField} name={[name, 'role']} rules={[{ required: true, message: 'Chọn vai' }]}>
                                                        <Select style={{ width: 100 }} placeholder="Vai"><Option value="A">Người A</Option><Option value="B">Người B</Option></Select>
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, 'text']} rules={[{ required: true, message: 'Nhập nội dung' }]}>
                                                        <Input style={{ width: 480 }} placeholder="Nội dung câu thoại..."/>
                                                    </Form.Item>
                                                    <Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            {fields.length < 10 ? (
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{marginTop: 8}}>
                                                    Thêm câu thoại ({fields.length}/10)
                                                </Button>
                                            ) : <Alert message="Đã đạt giới hạn 10 câu." type="warning" showIcon style={{marginTop: 8}}/>}
                                        </>
                                    )}
                                </Form.List>
                            </Card>
                            <div style={{textAlign: 'right', marginTop: 16}}>
                                <Space>
                                    <Button onClick={() => setIsConvModal(false)}>Hủy</Button>
                                    <Button type="primary" htmlType="submit">Lưu bài học</Button>
                                </Space>
                            </div>
                        </Form>
                    </Modal>
                </>
            )
        },
        {
            key: '3', label: <span><BookOutlined/> Quản lý Từ điển</span>,
            children: (
                <>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('dict')} style={{marginBottom: 16}}>Thêm từ mới</Button>
                    <Table dataSource={dictionary} rowKey="key" columns={[
                        { title: 'Từ vựng', dataIndex: 'word', render: t => <b style={{color: '#d4380d'}}>{t}</b> },
                        { title: 'Loại từ', dataIndex: 'type', render: t => <Tag>{t}</Tag> },
                        { title: 'Nghĩa', dataIndex: 'meaning' },
                        { title: 'Gia đình từ', dataIndex: 'family', render: t => t ? t : <i style={{color:'#ccc'}}>Không có</i> },
                        { title: 'Hành động', width: 120, render: (_, r) => (
                            <Space>
                                <Button icon={<EditOutlined/>} size="small" onClick={() => openModal('dict', r)}/>
                                <Popconfirm title="Xóa từ này?" onConfirm={() => handleDeleteDict(r.key)}>
                                    <Button danger size="small" icon={<DeleteOutlined/>}/>
                                </Popconfirm>
                            </Space>
                        )}
                    ]}/>

                    <Modal title={editingItem ? "Sửa từ vựng" : "Thêm từ vựng mới"} open={isDictModal} onCancel={() => setIsDictModal(false)} onOk={() => formDict.submit()}>
                        <Form form={formDict} layout="vertical" onFinish={handleSaveDict}>
                            <Space size="large" style={{display: 'flex'}}>
                                <Form.Item name="word" label="Từ vựng" rules={[{required: true, message: 'Nhập từ'}]} style={{flex: 1}}>
                                    <Input placeholder="VD: Learn"/>
                                </Form.Item>
                                <Form.Item name="type" label="Loại từ" rules={[{required: true, message: 'Chọn loại'}]} style={{width: 120}}>
                                    <Select><Option value="noun">Noun (n)</Option><Option value="verb">Verb (v)</Option><Option value="adj">Adj</Option><Option value="adv">Adv</Option></Select>
                                </Form.Item>
                            </Space>
                            <Form.Item name="meaning" label="Giải thích ý nghĩa" rules={[{required: true, message: 'Nhập ý nghĩa'}]}>
                                <Input.TextArea rows={2} placeholder="Giải thích nghĩa của từ..."/>
                            </Form.Item>
                            <Form.Item name="synonyms" label="Đồng nghĩa / Trái nghĩa">
                                <Input placeholder="VD: Study (Synonym) / Teach (Antonym)"/>
                            </Form.Item>
                            <Form.Item name="family" label="Gia đình từ (Word Family)" tooltip="Ví dụ: Learn (v) -> Learner (n)">
                                <Input placeholder="VD: Learn (v) -> Learner (n), Learning (adj)"/>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )
        }
      ]} />
    </Card>
  );
};
export default TeacherModules;