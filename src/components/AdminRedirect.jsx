import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRedirect({ children }) {
    const { user } = useAuth();

    // Redirect admin to admin dashboard
    if (user && user.role === "ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    return children;
}
