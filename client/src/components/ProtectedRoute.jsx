import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectRoutes = ({children, allowedRoles}) => {
    const { isAuthenticated, role, loading } = useAuth();

    if(loading){
        return <div className="p-4">Loading...</div>;
    }

    if(!isAuthenticated || !allowedRoles.includes(role)){
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectRoutes;