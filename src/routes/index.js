import Layout from "../layout/layout_default";
import Home from "../page/home";
import Login from "../page/login";
import Register from "../page/register";
import Private from "../components/private_router"; // Đã được sử dụng
import "./style.css";
import Conversation from "../page/conversation";
import Logout from "../page/logout";
import Mindmap from "../page/mindmap";
// import Mindmap from "../page/mindmap"; // Gợi ý: Hãy tạo file này sớm

export const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            // 1. NHÓM PUBLIC (Ai cũng xem được)
            {
                index: true, // Thay cho path: "/" -> Mặc định vào đây
                element: <Home />,
            },
            
            // 2. NHÓM PRIVATE (Phải đăng nhập mới xem được)
            {
                element: <Private />, // Bọc Private Router ở ngoài
                children: [
                    {
                        path: "conversation", // Luyện hội thoại
                        element: <Conversation />,
                    },
                    {
                       path: "mindmap", // Tra từ điển Mindmap (Theo FR-09)
                        element: <Mindmap />,
                    },
                    // {
                    //     path: "profile", // Hồ sơ người dùng
                    //     element: <div>Trang hồ sơ (Profile)</div>, 
                    // }
                ]
            },

            // Logout thường không cần giao diện, chỉ cần xử lý logic rồi đẩy về Home
            {
                path: "logout",
                element: <Logout />,
            },
        ]
    },
    
    // 3. NHÓM AUTH (Không có Header/Footer)
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "register",
        element: <Register />,
    }
];