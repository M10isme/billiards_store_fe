import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await api.post("/auth/login", { username, password });
            const data = res.data;
            console.log("Login data:", data);

            // Set token first (this will trigger fetchProfile effect)
            setToken(data.token);

            // Set user data from login response immediately
            const userData = {
                username: data.username,
                role: data.role,
                fullName: data.fullName || data.username, // fallback
            };
            setUser(userData);
            console.log("Setting user to:", userData);
            console.log("Current user state (may still be old):", user);
            return data;
        } catch (error) {
            throw new Error("Đăng nhập thất bại");
        }
    };

    const register = async (
        fullName,
        email,
        username,
        password,
        phoneNumber,
        address
    ) => {
        try {
            const res = await api.post("/auth/register", {
                fullName,
                email,
                username,
                password,
                phoneNumber,
                address,
            });
            return res.data;
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorData = error.response.data || {};
                if (errorData.message) {
                    throw new Error(errorData.message);
                } else if (errorData.error) {
                    throw new Error(errorData.error);
                }
            }
            throw new Error("Đăng ký thất bại");
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    // fetch current user's profile when token changes
    useEffect(() => {
        let mounted = true;
        async function fetchProfile() {
            if (!token) {
                console.log("No token, setting user to null");
                setUser(null);
                return;
            }
            try {
                console.log("Fetching profile with token:", token);
                const res = await api.get("/users/me");
                const data = res.data;
                console.log("Profile data received:", data);
                if (mounted) {
                    // Merge with existing user data, prioritizing role from login
                    setUser((prevUser) => ({
                        ...data,
                        role: prevUser?.role || data.role, // Keep role from login if available
                    }));
                    console.log("Profile updated user state");
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                if (mounted) setUser(null);
            }
        }
        fetchProfile();
        return () => {
            mounted = false;
        };
    }, [token]);

    // update profile
    const updateProfile = async (profile) => {
        if (!token) throw new Error("Not authenticated");
        try {
            const res = await api.put("/users/me", profile);
            const updated = res.data;
            setUser(updated);
            return updated;
        } catch (error) {
            throw new Error("Cập nhật thất bại");
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, token, login, register, logout, updateProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
