import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
    FiUser,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiAlertCircle,
} from "react-icons/fi";
import { LoadingSpinner } from "../components/Loading";
import Billiards from "../assets/Billiards.png";

export default function Login() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // Debug user state changes
    React.useEffect(() => {
        console.log("User state changed in Login:", user);
    }, [user]);

    const validateForm = () => {
        const errors = {};
        if (!form.username.trim()) {
            errors.username = "Vui lòng nhập tên đăng nhập";
        }
        if (!form.password) {
            errors.password = "Vui lòng nhập mật khẩu";
        } else if (form.password.length < 6) {
            errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await login(form.username, form.password);
            console.log("Login response:", data);

            // Small delay to see if user state updates
            setTimeout(() => {
                console.log("User state after login (delayed):", user);
            }, 100);

            if (data?.role === "ADMIN") {
                console.log("Redirecting admin to /admin");
                navigate("/admin", { replace: true });
                return;
            }

            const from = location.state?.from?.pathname || "/";
            console.log("Redirecting customer to:", from);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors({ ...fieldErrors, [field]: "" });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Left side - Image */}
                    <div className="lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-gray-900/90 z-10"></div>
                        <img
                            src={Billiards}
                            alt="BK Billiards"
                            className="w-full h-64 lg:h-full object-cover"
                        />
                        <div className="absolute inset-0 z-20 flex items-center justify-center text-white p-8">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🎱</div>
                                <h1 className="text-3xl font-bold mb-4">
                                    BK Billiards
                                </h1>
                                <p className="text-lg opacity-90">
                                    Chào mừng trở lại! Đăng nhập để tiếp tục mua
                                    sắm những sản phẩm bida tuyệt vời.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="lg:w-1/2 p-8 lg:p-12">
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Đăng nhập
                                </h2>
                                <p className="text-gray-600">
                                    Nhập thông tin để truy cập tài khoản
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                                    <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-red-700 text-sm">
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Username Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên đăng nhập
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Nhập tên đăng nhập"
                                            value={form.username}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "username",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.username
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                                            }`}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.username && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {fieldErrors.username}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Nhập mật khẩu"
                                            value={form.password}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-12 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.password
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                                            }`}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="w-5 h-5" />
                                            ) : (
                                                <FiEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {fieldErrors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center space-x-2 group"
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner
                                                size="sm"
                                                color="gray"
                                            />
                                            <span>Đang đăng nhập...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Đăng nhập</span>
                                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Register Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600 text-sm">
                                    Chưa có tài khoản?{" "}
                                    <Link
                                        to="/register"
                                        className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                                    >
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>

                            {/* Demo Accounts */}
                            {/* <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                                <h4 className="font-semibold text-gray-700 mb-3 text-center">Tài khoản demo</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Admin:</span>
                                        <span className="font-mono">admin / admin123</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Customer:</span>
                                        <span className="font-mono">customer1 / password123</span>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
