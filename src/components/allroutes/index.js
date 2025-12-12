import { useRoutes } from "react-router-dom";
import { routes } from "../../routes";

function Allroutes(){
    const allroute=useRoutes(routes);
    return (
        <>
        {allroute}
        </>
    )
}
export default Allroutes;