import Layout from "../layout/layout_default";
import Home from "../page/home";
import Login from "../page/login";
import Register from "../page/register";
import Private from "../components/private_router";
import "./style.css"
import Conversation from "../page/conversation";
import Logout from "../page/logout";
export const routes=[
    {
        path:"/",
        element:<Layout />,
        children:[
            {
                path:"/",
                element:<Home />,
            },
            {
                path:"login",
                element:<Login />,
            },
            {
                path:"register",
                element:<Register />,
            },
            ,
            {
                path:"logout",
                element:<Logout />,
            },
            {
                
                element:<Private />,
                children:[
                    {
                        path:"conversation/:id",
                        element:<Conversation/>,
                    }
                ]
            }
        ]
    }
]
