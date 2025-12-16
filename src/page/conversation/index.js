import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Select, Slider, Card, message, Modal, Avatar, Progress } from 'antd';
import { AudioOutlined, RobotOutlined, UserOutlined, ArrowRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './style.css';
import topicImg from '../../img/nentienganh.jpg'; // Dùng tạm ảnh nền làm ảnh chủ đề

// DỮ LIỆU GIẢ LẬP (Đáp ứng FR: 5 hội thoại/chủ đề)
const DATA_TOPICS = [
    { id: 'travel', name: 'Du lịch', img: topicImg },
    { id: 'work', name: 'Công sở', img: topicImg },
    { id: 'school', name: 'Trường học', img: topicImg },
];

const MOCK_SCRIPTS = {
    'travel': [
        { role: 'ai', text: "Hello! May I see your passport?", trans: "Xin chào, tôi có thể xem hộ chiếu không?" },
        { role: 'user', text: "Yes, here it is.", trans: "Vâng, nó đây ạ." }, // Người dùng phải đọc câu này
        { role: 'ai', text: "Where are you flying to today?", trans: "Hôm nay bạn bay đi đâu?" },
        { role: 'user', text: "I am going to London.", trans: "Tôi sẽ đi London." },
    ],
    'work': [ // Thêm cái này
        { role: 'ai', text: "Good morning. Are you ready for the meeting?", trans: "Chào buổi sáng. Bạn sẵn sàng cho cuộc họp chưa?" },
        { role: 'user', text: "Yes, I have prepared all the documents.", trans: "Vâng, tôi đã chuẩn bị đủ tài liệu." },
    ],
    'school': [ // Thêm cái này
        { role: 'ai', text: "Did you finish your homework?", trans: "Em đã làm xong bài tập về nhà chưa?" },
        { role: 'user', text: "Not yet, I was too busy yesterday.", trans: "Chưa ạ, hôm qua em bận quá." },
    ]
};

function Conversation() {
    // --- STATE QUẢN LÝ ---
    const [step, setStep] = useState('setup'); // setup | practice | finished
    const [config, setConfig] = useState({ level: 'A1', topic: 'travel', length: 5 });
    
    // State cho phần Luyện tập
    const [conversation, setConversation] = useState([]); // List tin nhắn đã hiện
    const [currentLineIndex, setCurrentLineIndex] = useState(0); // Đang ở dòng nào kịch bản
    const [isRecording, setIsRecording] = useState(false);
    const [feedback, setFeedback] = useState(null); // null | 'success' | 'error'
    
    // State thời gian học (FR: Giới hạn 60p)
    const [usageTime, setUsageTime] = useState(0); 

    const chatEndRef = useRef(null);

    // 1. KIỂM TRA THỜI GIAN TRUY CẬP (FR Limit 60p)
    useEffect(() => {
        // Lấy thời gian đã học hôm nay từ localStorage
        const today = new Date().toDateString();
        const savedData = JSON.parse(localStorage.getItem('study_time')) || { date: today, minutes: 0 };
        
        if (savedData.date !== today) {
            // Qua ngày mới -> Reset
            setUsageTime(0);
        } else {
            setUsageTime(savedData.minutes);
            if (savedData.minutes >= 60) {
                Modal.error({
                    title: 'Hết thời gian học hôm nay!',
                    content: 'Bạn chỉ được học tối đa 60 phút mỗi ngày. Hãy quay lại vào ngày mai nhé!',
                    okText: 'Về trang chủ',
                    onOk: () => window.location.href = '/'
                });
            }
        }
    }, []);

    // Tự động cuộn chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    // 2. HÀM BẮT ĐẦU HỌC
    // 2. HÀM BẮT ĐẦU HỌC
    const handleStart = () => {
        // Lấy kịch bản mẫu dựa trên chủ đề đang chọn
        const topicData = MOCK_SCRIPTS[config.topic];
        
        // --- ĐOẠN CODE SỬA LỖI AN TOÀN ---
        // Kiểm tra 1: Chủ đề này có tồn tại trong data không?
        if (!topicData) {
            message.warning("Chủ đề này chưa có nội dung hội thoại. Vui lòng chọn 'Du lịch'!");
            return;
        }

        // Kiểm tra 2: Mảng có phần tử nào không?
        if (topicData.length === 0) {
            message.warning("Dữ liệu hội thoại đang trống!");
            return;
        }
        // ----------------------------------

        // Nếu OK thì mới chạy tiếp
        const fullScript = topicData; // Lấy dữ liệu
        
        setConversation([]);
        setCurrentLineIndex(0);
        setStep('practice');

        // Kiểm tra xem câu đầu tiên có tồn tại không trước khi check role
        if (fullScript[0] && fullScript[0].role === 'ai') {
            setTimeout(() => {
                setConversation([fullScript[0]]);
                setCurrentLineIndex(1); 
            }, 500);
        }
    };

    // 3. XỬ LÝ GHI ÂM & KIỂM TRA (FR: Sai nhắc đọc lại)
    const handleMicClick = () => {
        if (isRecording) return;
        setIsRecording(true);
        setFeedback(null);

        // Giả lập nghe trong 2s
        setTimeout(() => {
            setIsRecording(false);
            
            // Lấy câu người dùng CẦN phải đọc
            const fullScript = MOCK_SCRIPTS[config.topic];
            const targetLine = fullScript[currentLineIndex];

            // --- GIẢ LẬP CHECK ĐÚNG SAI (Random để test) ---
            // Thực tế bạn sẽ gọi API AI check giọng nói ở đây
            const isCorrect = Math.random() > 0.3; // 70% là đúng

            if (isCorrect) {
                // ĐÚNG -> Hiện tin nhắn user -> AI trả lời -> Câu tiếp
                setFeedback('success');
                const newMsg = { ...targetLine, status: 'correct' };
                
                // Cập nhật chat
                setConversation(prev => [...prev, newMsg]);
                
                // Logic để AI nói câu tiếp theo
                const nextIndex = currentLineIndex + 1;
                if (nextIndex < fullScript.length) {
                    setTimeout(() => {
                        const aiNextLine = fullScript[nextIndex];
                        setConversation(prev => [...prev, aiNextLine]);
                        setCurrentLineIndex(nextIndex + 1);
                        setFeedback(null); // Reset feedback
                    }, 1000);
                } else {
                    message.success("Chúc mừng bạn hoàn thành hội thoại!");
                    setStep('finished'); // Xong bài
                }

            } else {
                // SAI -> Báo lỗi -> KHÔNG cho qua câu tiếp (FR: Nhắc đọc lại)
                setFeedback('error');
                message.warning("Phát âm chưa chuẩn. Vui lòng đọc lại!");
            }

        }, 1500);
    };

    // --- RENDER MÀN HÌNH CÀI ĐẶT (SETUP) ---
    if (step === 'setup') {
        return (
            <div className="conversation-page">
                <div className="setup-container">
                    <h1 style={{color: '#0075F3'}}>Thiết lập bài luyện nói</h1>
                    <p>Thời gian đã học hôm nay: <b style={{color: usageTime >= 60 ? 'red' : 'green'}}>{usageTime}/60 phút</b></p>
                    
                    {/* Chọn Level (FR) */}
                    <div style={{textAlign: 'left', marginTop: 30}}>
                        <h3>1. Chọn trình độ (Level)</h3>
                        <Select 
                            defaultValue="A1" 
                            style={{ width: '100%' }} 
                            onChange={(val) => setConfig({...config, level: val})}
                            options={[
                                { value: 'A1', label: 'A1 - Sơ cấp' },
                                { value: 'A2', label: 'A2 - Sơ trung cấp' },
                                { value: 'B1', label: 'B1 - Trung cấp' },
                                { value: 'B2', label: 'B2 - Cao cấp' },
                            ]}
                        />
                    </div>

                    {/* Chọn Chủ đề (FR) */}
                    <div style={{textAlign: 'left', marginTop: 20}}>
                        <h3>2. Chọn chủ đề</h3>
                        <div className="topic-grid">
                            {DATA_TOPICS.map(t => (
                                <div 
                                    key={t.id} 
                                    className={`topic-item ${config.topic === t.id ? 'active' : ''}`}
                                    onClick={() => setConfig({...config, topic: t.id})}
                                >
                                    {t.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chọn số câu (FR: Tối đa 10) */}
                    <div style={{textAlign: 'left', marginTop: 20}}>
                        <h3>3. Độ dài hội thoại: {config.length} câu</h3>
                        <Slider 
                            min={2} max={10} 
                            value={config.length} 
                            onChange={(val) => setConfig({...config, length: val})} 
                        />
                    </div>

                    <Button type="primary" size="large" shape="round" block style={{marginTop: 40, height: 50}} onClick={handleStart}>
                        Bắt đầu ngay <ArrowRightOutlined />
                    </Button>
                </div>
            </div>
        )
    }

    // --- RENDER MÀN HÌNH LUYỆN TẬP (PRACTICE) ---
    // Lấy câu hiện tại người dùng cần đọc (nếu đến lượt user)
    const fullScript = MOCK_SCRIPTS[config.topic];
    const currentTarget = fullScript && fullScript[currentLineIndex]?.role === 'user' ? fullScript[currentLineIndex] : null;

    return (
        <div className="conversation-page">
            <div className="conversation-container">
                <Row gutter={[24, 24]} style={{height: '100%'}}>
                    
                    {/* CỘT TRÁI: HÌNH ẢNH & CHAT */}
                    <Col xs={24} md={14} style={{height: '100%'}}>
                        <div className="chat-window">
                            {/* Ảnh trực quan về chủ đề (FR) */}
                            <div style={{height: '200px', overflow: 'hidden'}}>
                                <img src={topicImg} alt="Topic" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                <div style={{position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '5px 15px', borderRadius: 20}}>
                                    <ClockCircleOutlined /> 58:00 còn lại
                                </div>
                            </div>

                            <div className="chat-body">
                                {conversation.map((msg, index) => (
                                    <div key={index} className={`chat-bubble ${msg.role}`}>
                                        <Avatar size={40} icon={msg.role === 'ai' ? <RobotOutlined /> : <UserOutlined />} 
                                            style={{backgroundColor: msg.role === 'ai' ? '#FF9C00' : '#0075F3'}} />
                                        <div className="bubble-content">
                                            <p className="bubble-text">{msg.text}</p>
                                            <div className="bubble-trans">{msg.trans}</div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                        </div>
                    </Col>

                    {/* CỘT PHẢI: CÔNG CỤ LUYỆN TẬP */}
                    <Col xs={24} md={10}>
                        <div className="sidebar-right" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            
                            {currentTarget ? (
                                <>
                                    <div style={{textAlign: 'center', marginBottom: 20}}>
                                        <h2 style={{color: '#0075F3'}}>Lượt của bạn</h2>
                                        <p style={{color: '#666'}}>Hãy đóng vai và đọc to câu dưới đây:</p>
                                    </div>

                                    {/* Câu mẫu cần đọc (FR) */}
                                    <div className="target-sentence">
                                        <h3>CÂU MẪU:</h3>
                                        <p>{currentTarget.text}</p>
                                        <p style={{fontSize: 14, fontWeight: 400, color: '#888', marginTop: 5}}>{currentTarget.trans}</p>
                                    </div>

                                    {/* Nút Mic */}
                                    <div style={{display: 'flex', justifyContent: 'center', margin: '30px 0'}}>
                                        <button className={`btn-mic ${isRecording ? 'recording' : ''}`} onClick={handleMicClick}>
                                            <AudioOutlined />
                                        </button>
                                    </div>
                                    <p style={{textAlign: 'center', color: isRecording ? 'red' : '#999'}}>
                                        {isRecording ? "Đang nghe giọng bạn..." : "Bấm mic để nói"}
                                    </p>

                                    {/* Thông báo Sai/Đúng (FR: Nhắc đọc lại) */}
                                    {feedback === 'error' && (
                                        <div className="feedback-bar error">
                                            Chưa chính xác! Vui lòng thử lại.
                                        </div>
                                    )}
                                    {feedback === 'success' && (
                                        <div className="feedback-bar success">
                                            Tuyệt vời! Chính xác.
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{textAlign: 'center', padding: 50}}>
                                    <RobotOutlined style={{fontSize: 50, color: '#FF9C00'}} />
                                    <h3>AI đang nói...</h3>
                                </div>
                            )}

                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Conversation;