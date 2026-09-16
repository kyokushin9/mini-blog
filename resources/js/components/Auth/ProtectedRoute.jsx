import { Navigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function ProtectedRoute({ allowedRoles = [], children }) {
    const user = authService.getUser();


    if(!user) {
        return <Navigate to="/login" replace />;
    }

    if(allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;

}