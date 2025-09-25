import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to the new Profile page
export default function Account() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/profile", { replace: true });
    }, [navigate]);

    return null;
}
