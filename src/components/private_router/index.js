import { Navigate, Outlet } from "react-router-dom";

function Private(){
    const islogin=true;
    return(
        <>
        {islogin ? (<Outlet/>):(<Navigate to="/login" />)}
        </>
    )
}
export default Private;