import React, { createContext, useContext, useState, useEffect } from "react";

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
        const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            throw new Error("Đăng nhập thất bại");
        }
        const data = await res.json();
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
    };

    const register = async (
        fullName,
        email,
        username,
        password,
        phoneNumber,
        address
    ) => {
        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName,
                email,
                username,
                password,
                phoneNumber,
                address,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 400) {
                // Handle specific validation errors
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
                const res = await fetch("http://localhost:8080/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    console.log(
                        "Profile fetch failed:",
                        res.status,
                        res.statusText
                    );
                    // token invalid or expired
                    setUser(null);
                    setToken(null);
                    return;
                }
                const data = await res.json();
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
        const res = await fetch("http://localhost:8080/api/users/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profile),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Cập nhật thất bại");
        }
        const updated = await res.json();
        setUser(updated);
        return updated;
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
