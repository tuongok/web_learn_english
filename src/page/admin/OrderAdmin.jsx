import React, { useState, useMemo } from 'react';
import { 
  Card, Table, Tag, Space, Button, Input, DatePicker, Select, 
  Tabs, Statistic, Row, Col, message, Typography, Progress 
} from 'antd';
import { 
  SearchOutlined, FileExcelOutlined, FilePdfOutlined, 
  DollarOutlined, ShoppingCartOutlined, RiseOutlined, ReloadOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

// --- IMPORT THƯ VIỆN PDF ---
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const OrderAdmin = () => {
  // --- 1. DỮ LIỆU GIẢ LẬP ---
  const [orders, setOrders] = useState([
    { key: 'ORD001', userCode: 'HV101', userName: 'Nguyễn Văn A', package: 'Gói 1 Tháng', level: 'Cơ bản', price: 199000, date: '2023-12-20', status: 'paid' },
    { key: 'ORD002', userCode: 'HV102', userName: 'Trần Thị B', package: 'Gói 3 Tháng', level: 'Nâng cao', price: 499000, date: '2023-11-15', status: 'paid' },
    { key: 'ORD003', userCode: 'HV103', userName: 'Lê Văn C', package: 'Gói Trọn đời', level: 'VIP', price: 1999000, date: '2020-05-20', status: 'paid' },
    { key: 'ORD004', userCode: 'HV101', userName: 'Nguyễn Văn A', package: 'Gói 1 Tháng', level: 'Cơ bản', price: 199000, date: '2020-06-10', status: 'failed' },
    { key: 'ORD005', userCode: 'HV105', userName: 'Phạm D', package: 'Gói 3 Tháng', level: 'Nâng cao', price: 499000, date: '2024-01-05', status: 'paid' },
    // Thêm dữ liệu test ngày hôm nay/tháng này
    { key: 'ORD006', userCode: 'HV106', userName: 'Test Ngày', package: 'Gói 1 Tháng', level: 'Cơ bản', price: 200000, date: dayjs().format('YYYY-MM-DD'), status: 'paid' },
  ]);

  // --- STATE BỘ LỌC (TAB 1) ---
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(undefined);
  const [filterPackage, setFilterPackage] = useState(undefined);
  const [dateRange, setDateRange] = useState(null);

  // --- STATE BÁO CÁO (TAB 2 - ĐÃ NÂNG CẤP) ---
  const [reportType, setReportType] = useState('year'); // Mặc định xem theo Năm
  const [reportDate, setReportDate] = useState(dayjs()); // Thời gian được chọn

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // --- HÀM XUẤT EXCEL ---
  const handleExportCSV = () => {
    const headers = ["Mã đơn,Người học,Gói học,Giá,Ngày,Trạng thái"];
    const dataRows = orders.map(item => `${item.key},${item.userName},${item.package},${item.price},${item.date},${item.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...dataRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Đã tải xuống file CSV!');
  };

  // --- HÀM XUẤT PDF ---
  const handleExportPDF = () => {
    const input = document.getElementById('report-section');
    message.loading('Đang tạo file PDF...', 1.5);
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.setFontSize(18);
      // Tiêu đề PDF linh hoạt theo loại báo cáo
      let title = `BAO CAO DOANH THU`;
      if (reportType === 'date') title += ` NGAY ${reportDate.format('DD/MM/YYYY')}`;
      else if (reportType === 'month') title += ` THANG ${reportDate.format('MM/YYYY')}`;
      else title += ` NAM ${reportDate.format('YYYY')}`;
      
      pdf.text(title, pdfWidth / 2, 20, { align: 'center' });
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Bao_cao_${reportType}.pdf`);
      message.success('Xuất PDF thành công!');
    });
  };

  // --- LOGIC LỌC TAB 1 (GIỮ NGUYÊN) ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
        const matchSearch = searchText === '' || order.key.toLowerCase().includes(searchText.toLowerCase()) || order.userName.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus = filterStatus ? order.status === filterStatus : true;
        let matchPackage = true;
        if (filterPackage === '1m') matchPackage = order.package.includes('1 Tháng');
        if (filterPackage === '3m') matchPackage = order.package.includes('3 Tháng');
        if (filterPackage === 'lifetime') matchPackage = order.package.includes('Trọn đời');
        let matchDate = true;
        if (dateRange && dateRange[0] && dateRange[1]) {
            const orderDate = dayjs(order.date);
            matchDate = (orderDate.isSame(dateRange[0], 'day') || orderDate.isAfter(dateRange[0], 'day')) && 
                        (orderDate.isSame(dateRange[1], 'day') || orderDate.isBefore(dateRange[1], 'day'));
        }
        return matchSearch && matchStatus && matchPackage && matchDate;
    });
  }, [orders, searchText, filterStatus, filterPackage, dateRange]);

  // --- LOGIC TÍNH TOÁN BÁO CÁO (NÂNG CẤP) ---
  const reportData = useMemo(() => {
      // 1. Lọc ra các đơn hàng thuộc mốc thời gian đã chọn
      const filteredByTime = orders.filter(o => {
          const orderDate = dayjs(o.date);
          if (reportType === 'date') {
              // So sánh cùng ngày
              return orderDate.isSame(reportDate, 'day');
          } else if (reportType === 'month') {
              // So sánh cùng tháng & năm
              return orderDate.isSame(reportDate, 'month');
          } else {
              // So sánh cùng năm
              return orderDate.isSame(reportDate, 'year');
          }
      });

      // 2. Tính toán số liệu
      const revenueOrders = filteredByTime.filter(o => o.status === 'paid');
      const totalRev = revenueOrders.reduce((acc, curr) => acc + curr.price, 0);
      const count = filteredByTime.length; // Tổng đơn (cả failed/pending)
      const rate = count > 0 ? Math.round((revenueOrders.length / count) * 100) : 0;

      // 3. Phân tích theo Level
      const levels = { 'Cơ bản': 0, 'Nâng cao': 0, 'VIP': 0 };
      revenueOrders.forEach(o => {
          if (o.level.includes('Cơ bản')) levels['Cơ bản'] += o.price;
          if (o.level.includes('Nâng cao')) levels['Nâng cao'] += o.price;
          if (o.level.includes('VIP')) levels['VIP'] += o.price;
      });

      // Tạo nhãn hiển thị cho đẹp (VD: "Tháng 12/2023" hoặc "Năm 2024")
      let label = "";
      if (reportType === 'date') label = `Ngày ${reportDate.format('DD/MM/YYYY')}`;
      else if (reportType === 'month') label = `Tháng ${reportDate.format('MM/YYYY')}`;
      else label = `Năm ${reportDate.format('YYYY')}`;

      return { totalRev, count, rate, levels, label };
  }, [orders, reportType, reportDate]);

  const columns = [
    { title: 'Mã đơn', dataIndex: 'key', render: t => <b style={{color: '#1890ff'}}>{t}</b> },
    { title: 'Người học', dataIndex: 'userName', render: (t, r) => <div>{t}<br/><small style={{color:'#999'}}>{r.userCode}</small></div> },
    { title: 'Gói học', dataIndex: 'package', render: (t, r) => <div><Tag color="cyan">{t}</Tag><br/><small>Level: {r.level}</small></div> },
    { title: 'Giá trị', dataIndex: 'price', align: 'right', render: t => <b style={{color: '#d4380d'}}>{formatCurrency(t)}</b> },
    { title: 'Ngày tạo', dataIndex: 'date' },
    { title: 'Trạng thái', dataIndex: 'status', align: 'center', render: s => <Tag color={s==='paid'?'success':(s==='pending'?'warning':'error')}>{s==='paid'?'Đã TT':(s==='pending'?'Chờ xử lý':'Thất bại')}</Tag> }
  ];

  return (
    <Card title="Quản trị Đơn hàng & Doanh thu" bordered={false}>
      <Tabs type="card" items={[
        {
          key: '1', label: <span><ShoppingCartOutlined /> Quản lý Đơn hàng</span>,
          children: (
            <>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}><Input prefix={<SearchOutlined />} placeholder="Tìm mã, tên..." value={searchText} onChange={e => setSearchText(e.target.value)}/></Col>
                <Col span={6}><RangePicker style={{width: '100%'}} value={dateRange} onChange={setDateRange}/></Col>
                <Col span={4}><Select placeholder="Trạng thái" style={{width: '100%'}} allowClear value={filterStatus} onChange={setFilterStatus}><Option value="paid">Đã thanh toán</Option><Option value="pending">Chờ xử lý</Option><Option value="failed">Thất bại</Option></Select></Col>
                <Col span={4}><Select placeholder="Gói học" style={{width: '100%'}} allowClear value={filterPackage} onChange={setFilterPackage}><Option value="1m">Gói 1 Tháng</Option><Option value="3m">Gói 3 Tháng</Option><Option value="lifetime">Gói Trọn đời</Option></Select></Col>
                <Col span={4} style={{textAlign: 'right'}}><Button icon={<ReloadOutlined />} onClick={() => { setSearchText(''); setFilterStatus(undefined); setFilterPackage(undefined); setDateRange(null); }}>Xóa lọc</Button></Col>
              </Row>
              <Table dataSource={filteredOrders} columns={columns} rowKey="key" pagination={{ pageSize: 5 }} title={() => <Text>Tìm thấy <b style={{color: '#1890ff'}}>{filteredOrders.length}</b> đơn hàng</Text>}/>
            </>
          )
        },
        {
          key: '2', label: <span><DollarOutlined /> Báo cáo Doanh thu</span>,
          children: (
            <>
              {/* THANH CÔNG CỤ BÁO CÁO LINH HOẠT */}
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', padding: 10, borderRadius: 8 }}>
                <Space>
                    <span style={{fontWeight: 600}}>Xem theo: </span>
                    {/* 1. Chọn loại báo cáo */}
                    <Select value={reportType} onChange={setReportType} style={{ width: 120 }}>
                        <Option value="date">Ngày</Option>
                        <Option value="month">Tháng</Option>
                        <Option value="year">Năm</Option>
                    </Select>
                    
                    {/* 2. Chọn thời gian (Biến đổi theo loại) */}
                    <DatePicker 
                        picker={reportType} 
                        value={reportDate} 
                        onChange={setReportDate} 
                        allowClear={false} 
                        format={reportType === 'date' ? 'DD/MM/YYYY' : (reportType === 'month' ? 'MM/YYYY' : 'YYYY')}
                    />
                </Space>
                <Space>
                    <Button type="primary" ghost icon={<FileExcelOutlined />} onClick={handleExportCSV}>Xuất Excel</Button>
                    <Button danger icon={<FilePdfOutlined />} onClick={handleExportPDF}>Xuất PDF</Button>
                </Space>
              </div>

              {/* VÙNG HIỂN THỊ BÁO CÁO */}
              <div id="report-section" style={{ padding: 20, background: '#fff' }}> 
                <div style={{textAlign: 'center', marginBottom: 20}}>
                    <Title level={4} style={{margin: 0, textTransform: 'uppercase'}}>Báo cáo doanh thu {reportData.label}</Title>
                    <Text type="secondary">Đơn vị tính: VNĐ</Text>
                </div>

                {reportData.count === 0 ? (
                    <div style={{textAlign: 'center', padding: 30, color: '#999', border: '1px dashed #ccc', borderRadius: 8}}>
                        Không phát sinh giao dịch nào trong <b>{reportData.label}</b>
                    </div>
                ) : (
                  <>
                    <Row gutter={16}>
                      <Col span={8}><Card bordered={false} style={{background: '#f6ffed'}}><Statistic title="Tổng Doanh Thu" value={reportData.totalRev} precision={0} valueStyle={{ color: '#3f8600', fontWeight: 'bold' }} prefix={<DollarOutlined />} suffix="VNĐ" /></Card></Col>
                      <Col span={8}><Card bordered={false} style={{background: '#e6f7ff'}}><Statistic title="Tổng Đơn Hàng" value={reportData.count} valueStyle={{ color: '#1890ff', fontWeight: 'bold' }} prefix={<ShoppingCartOutlined />} /></Card></Col>
                      <Col span={8}><Card bordered={false} style={{background: '#fff7e6'}}><Statistic title="Tỷ lệ thành công" value={reportData.rate} suffix="%" prefix={<RiseOutlined />} valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }} /></Card></Col>
                    </Row>
                    <br />
                    <Card title="Phân tích chi tiết theo Level" bordered={true} size="small">
                       <Row gutter={[24, 24]}>
                          <Col span={24}>
                              <div style={{marginBottom: 16}}>
                                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}><Text strong>Gói Cơ Bản</Text><Text>{formatCurrency(reportData.levels['Cơ bản'])}</Text></div>
                                  <Progress percent={reportData.totalRev ? Math.round((reportData.levels['Cơ bản']/reportData.totalRev)*100) : 0} strokeColor="#87d068" />
                              </div>
                              <div style={{marginBottom: 16}}>
                                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}><Text strong>Gói Nâng Cao</Text><Text>{formatCurrency(reportData.levels['Nâng cao'])}</Text></div>
                                  <Progress percent={reportData.totalRev ? Math.round((reportData.levels['Nâng cao']/reportData.totalRev)*100) : 0} strokeColor="#1890ff" />
                              </div>
                              <div>
                                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}><Text strong>Gói VIP</Text><Text>{formatCurrency(reportData.levels['VIP'])}</Text></div>
                                  <Progress percent={reportData.totalRev ? Math.round((reportData.levels['VIP']/reportData.totalRev)*100) : 0} strokeColor="#722ed1" />
                              </div>
                          </Col>
                       </Row>
                    </Card>
                  </>
                )}
              </div>
            </>
          )
        }
      ]} />
    </Card>
  );
};

export default OrderAdmin;