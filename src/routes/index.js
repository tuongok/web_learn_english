import { Navigate } from "react-router-dom"; // Thêm dòng này để điều hướng
import Layout from "../layout/layout_default";
import Home from "../page/home";
import Login from "../page/login";
import Register from "../page/register";
import Private from "../components/private_router"; 
import "./style.css";
import Conversation from "../page/conversation";
import Logout from "../page/logout";
import Mindmap from "../page/mindmap";

// --- IMPORT PHẦN ADMIN
import AdminLayout from "../layout/AdminLayout";
import UserAdmin from "../page/admin/UserAdmin";           
import TeacherModules from "../page/admin/TeacherModules"; 
import ContextManager from "../page/admin/ContextManager"; 

import OrderAdmin from "../page/admin/OrderAdmin";

import Profile from "../page/profile";

console.log("Check AdminLayout:", AdminLayout);
console.log("Check UserAdmin:", UserAdmin);
console.log("Check TeacherModules:", TeacherModules);
console.log("Check ContextManager:", ContextManager);
export const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            // 1. NHÓM PUBLIC (Ai cũng xem được)
            {
                index: true, 
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
                     
                    {
                        path: "profile",
                            element: <Profile />,
                    }
                    
                   
                ]
            },

            // Logout thường không cần giao diện
            {
                path: "logout",
                element: <Logout />,
            },
        ]
    },

    // PHẦN ADMIN CỦA BẠN 
    
    {
        path: "/admin",
        element: <Private />, //dùng Private Router để bảo vệ
        children: [
            {
                element: <AdminLayout />, 
                children: [
                    // Vào /admin tự động nhảy sang /admin/users
                    { index: true, element: <Navigate to="users" replace /> },
                    
                    // Quản lý người dùng
                    { path: "users", element: <UserAdmin /> },
                    
                    // Chức năng giáo viên
                    { path: "teacher-modules", element: <TeacherModules /> },
                    
                    // Quản lý gói & chủ đề
                    { path: "context", element: <ContextManager /> },

                    { path: "orders", element: <OrderAdmin /> },
                ]
            }
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