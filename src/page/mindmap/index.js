import React, { useState } from 'react';
import { Input, Button, Empty, message, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './style.css';

// --- DỮ LIỆU MẪU TỪ ĐIỂN (Theo FR-09) ---
const MOCK_DICTIONARY = {
    "learn": {
        word: "Learn",
        meaning: "Học tập",
        type: "(v)",
        branches: [
            {
                category: "Noun (Danh từ)",
                words: ["Learner (Người học)", "Learning (Việc học)"]
            },
            {
                category: "Adjective (Tính từ)",
                words: ["Learned (Có học thức)", "Learnable (Có thể học)"]
            },
            {
                category: "Synonym (Đồng nghĩa)",
                words: ["Study", "Master", "Grasp"]
            },
            {
                category: "Antonym (Trái nghĩa)",
                words: ["Teach", "Ignore"]
            }
        ]
    },
    "act": {
        word: "Act",
        meaning: "Hành động",
        type: "(v)",
        branches: [
            {
                category: "Noun",
                words: ["Action", "Actor", "Activity"]
            },
            {
                category: "Adjective",
                words: ["Active", "Actual"]
            },
            {
                category: "Adverb",
                words: ["Actively", "Actually"]
            }
        ]
    }
};

// --- DỮ LIỆU MẪU CHỦ ĐỀ (Mindmap theo Topic) ---
const MOCK_TOPICS = {
    "topic_travel": {
        word: "TRAVEL (Du lịch)",
        meaning: "Chủ đề",
        type: "Topic",
        branches: [
            {
                category: "Transport (Phương tiện)",
                words: ["Plane", "Train", "Taxi", "Bus"]
            },
            {
                category: "Accommodation (Chỗ ở)",
                words: ["Hotel", "Resort", "Hostel", "Homestay"]
            },
            {
                category: "Activities (Hoạt động)",
                words: ["Sightseeing", "Hiking", "Swimming"]
            }
        ]
    },
    "topic_work": {
        word: "WORK (Công việc)",
        meaning: "Chủ đề",
        type: "Topic",
        branches: [
            {
                category: "People (Con người)",
                words: ["Boss", "Colleague", "Manager"]
            },
            {
                category: "Place (Địa điểm)",
                words: ["Office", "Meeting Room", "Factory"]
            }
        ]
    }
};

function Mindmap() {
    // State quản lý
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState(null); // Quản lý giá trị Select
    const [data, setData] = useState(MOCK_DICTIONARY['learn']); // Mặc định hiện từ Learn

    // 1. XỬ LÝ KHI TÌM KIẾM TỪ
    const handleSearch = () => {
        if (!searchTerm) return;
        
        const key = searchTerm.toLowerCase().trim();
        const result = MOCK_DICTIONARY[key];

        if (result) {
            setData(result);
            setSelectedTopic(null); 
            message.success(`Đã tìm thấy từ: ${result.word}`);
        } else {
            setData(null);
            message.error("Không tìm thấy từ này trong từ điển mẫu!");
        }
    };

    // 2. XỬ LÝ KHI CHỌN CHỦ ĐỀ
    const handleTopicChange = (value) => {
        const topicData = MOCK_TOPICS[value];
        if (topicData) {
            setData(topicData);
            setSelectedTopic(value); 
            setSearchTerm('');      
            message.success(`Đã chuyển sang chủ đề: ${topicData.word}`);
        }
    };

    return (
        <div className="mindmap-page">
            <div className="mindmap-container">
                
                {/* --- KHUNG TÌM KIẾM & CHỌN CHỦ ĐỀ --- */}
                <div className="search-box">
                    <h2 style={{marginBottom: 20}}>Tra từ điển & Mindmap</h2>
                    
                    <div style={{display: 'flex', gap: 15, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                        
                        {/* A. SELECT CHỌN CHỦ ĐỀ */}
                        <Select
                            placeholder="Chọn chủ đề..."
                            value={selectedTopic}
                            style={{ width: 220 }}
                            onChange={handleTopicChange}
                            size="large"
                            options={[
                                { value: 'topic_travel', label: '🏖️ Chủ đề: Du lịch' },
                                { value: 'topic_work', label: '💼 Chủ đề: Công sở' },
                            ]}
                        />

                        <span style={{color: '#999', fontWeight: 'bold'}}>HOẶC</span>

                        {/* B. INPUT TÌM TỪ */}
                        <div className="search-input-wrapper">
                            <Input 
                                size="large" 
                                placeholder="Nhập từ (VD: Learn, Act)..." 
                                style={{width: 250, border: 'none', background: 'transparent'}}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onPressEnter={handleSearch}
                            />
                            <Button 
                                type="primary" 
                                shape="round" 
                                size="large" 
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                            >
                                Tra cứu
                            </Button>
                        </div>
                    </div>
                    
                    <p style={{marginTop: 15, color: '#888'}}>
                        *Mẹo: Bạn có thể chọn chủ đề để học tổng quát, hoặc nhập từ để học chuyên sâu.
                    </p>
                </div>

                {/* --- CÂY MINDMAP (HIỂN THỊ DỮ LIỆU) --- */}
                <div className="tree-wrapper">
                    {data ? (
                        <div className="tree">
                            <ul>
                                <li>
                                    {/* 1. NODE GỐC (ROOT) */}
                                    <div className="node root">
                                        {data.word}
                                        <div style={{fontSize: 14, fontWeight: 400, marginTop: 5, textTransform: 'none'}}>
                                            {data.type} {data.meaning}
                                        </div>
                                    </div>
                                    
                                    {/* 2. CÁC NHÁNH LỚN (BRANCHES) */}
                                    <ul>
                                        {data.branches.map((branch, index) => (
                                            <li key={index}>
                                                {/* Node Danh mục (Noun, Verb, Transport...) */}
                                                <div className="node category">{branch.category}</div>
                                                
                                                {/* 3. CÁC TỪ CON (LEAVES) */}
                                                <ul>
                                                    {branch.words.map((w, i) => (
                                                        <li key={i}>
                                                            <div className="node leaf">{w}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Empty description="Không có dữ liệu hiển thị" style={{marginTop: 50}} />
                    )}
                </div>

            </div>
        </div>
    );
}

export default Mindmap;