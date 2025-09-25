// src/pages/MyOrders.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to the new Profile page with orders tab
export default function MyOrders() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/profile?tab=orders", { replace: true });
    }, [navigate]);

    return null;
}
