import { NavLink, Outlet } from "react-router-dom";
import './style.scss'
import { useSelector } from "react-redux";
function Layout() {
    return (
        <>
            <div className="body">
            <div className="layout__default">
                <header className="layout__header">
                    <div className="layout__logo"><NavLink  to="/">english</NavLink></div>
                    <div className="layout__menu">
                        <ul>
                                <li>
                                <NavLink  to="/">Home </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/conversation">Conversation</NavLink>
                                </li>
                        </ul>
                    </div>
                    <div className="layout__login">
                            <NavLink to="/logout">Đăng xuất </NavLink>
                            <NavLink to="/login">Đăng nhập</NavLink>
                            <NavLink to="/register">Đăng kí </NavLink>
                       
                    </div>
                </header>
                <main className="layout__main">
                    <Outlet  />
                </main>
                <footer className="layout__footer">
                     @Copyright by Dang Anh Tuongg
                </footer>
            </div>
            </div>
        </>
    )
}
export default Layout;