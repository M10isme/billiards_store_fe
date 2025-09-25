import { useAuth } from "../auth/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
    const { token } = useAuth();
    const location = useLocation();
    return token ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}
