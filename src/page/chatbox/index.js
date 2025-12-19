import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, Tooltip } from 'antd';
import { SendOutlined, AudioOutlined, RobotOutlined, UserOutlined, ClearOutlined } from '@ant-design/icons';
import './style.css';

// Dữ liệu mẫu ban đầu
const WELCOME_MSG = {
    id: 1,
    sender: 'ai',
    text: "Hi there! I'm your English AI Assistant. We can talk about any topic, or I can help you correct your grammar. What's on your mind?"
};

function Chatbox() {
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Hàm giả lập AI phản hồi (Logic đơn giản)
    const generateAIResponse = (userText) => {
        const lowerText = userText.toLowerCase();
        
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return "Hello! How are you doing today?";
        }
        if (lowerText.includes('name')) {
            return "I am English AI, your virtual language tutor.";
        }
        if (lowerText.includes('thank')) {
            return "You're welcome! Keep up the good work.";
        }
        if (lowerText.includes('travel')) {
            return "Travel is a great topic! Do you prefer beaches or mountains?";
        }
        // Mặc định
        return "That's interesting! Can you tell me more about that? (I can also help you fix grammar if you make a mistake)";
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // 1. Thêm tin nhắn User
        const newUserMsg = {
            id: Date.now(),
            sender: 'user',
            text: inputValue
        };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true); // Bật trạng thái AI đang gõ

        // 2. Giả lập độ trễ mạng (1.5s)
        setTimeout(() => {
            const aiResponseText = generateAIResponse(newUserMsg.text);
            
            const newAiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: aiResponseText
            };
            
            setMessages(prev => [...prev, newAiMsg]);
            setIsTyping(false); // Tắt trạng thái AI đang gõ
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Giả lập chức năng Speech-to-text
    const handleMicClick = () => {
        if (isListening) return;
        setIsListening(true);
        
        // Giả vờ nghe trong 2 giây rồi điền text vào ô input
        setTimeout(() => {
            setIsListening(false);
            setInputValue("I want to learn English vocabulary.");
        }, 2000);
    };

    const handleClearChat = () => {
        setMessages([WELCOME_MSG]);
    };

    return (
        <div className="chatbox-page">
            <div className="chatbox-container">
                
                {/* --- Header nhỏ của khung chat --- */}
                <div style={{padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        <Avatar style={{backgroundColor: '#FF9C00'}} icon={<RobotOutlined />} />
                        <div>
                            <h4 style={{margin: 0}}>English AI Tutor</h4>
                            <span style={{fontSize: 12, color: 'green'}}>● Online</span>
                        </div>
                    </div>
                    <Tooltip title="Xóa lịch sử chat">
                        <Button type="text" icon={<ClearOutlined />} onClick={handleClearChat} />
                    </Tooltip>
                </div>

                {/* --- Khu vực tin nhắn --- */}
                <div className="messages-area">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-item ${msg.sender}`}>
                            {msg.sender === 'ai' && (
                                <Avatar size={32} icon={<RobotOutlined />} style={{backgroundColor: '#FF9C00'}} />
                            )}
                            
                            <div className="bubble">
                                {msg.text}
                            </div>

                            {msg.sender === 'user' && (
                                <Avatar size={32} icon={<UserOutlined />} style={{backgroundColor: '#0075F3'}} />
                            )}
                        </div>
                    ))}

                    {/* Hiệu ứng AI đang gõ... */}
                    {isTyping && (
                        <div className="message-item ai">
                            <Avatar size={32} icon={<RobotOutlined />} style={{backgroundColor: '#FF9C00'}} />
                            <div className="bubble typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* --- Khu vực nhập liệu --- */}
                <div className="input-area">
                    <Tooltip title={isListening ? "Đang nghe..." : "Bấm để nói"}>
                        <button 
                            className={`btn-mic ${isListening ? 'listening' : ''}`}
                            onClick={handleMicClick}
                        >
                            <AudioOutlined />
                        </button>
                    </Tooltip>

                    <Input 
                        size="large" 
                        placeholder="Nhập tin nhắn..." 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{borderRadius: 20}}
                    />

                    <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<SendOutlined />} 
                        size="large" 
                        onClick={handleSend}
                    />
                </div>

            </div>
        </div>
    );
}

export default Chatbox;