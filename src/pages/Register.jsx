import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
    FiUser,
    FiMail,
    FiLock,
    FiPhone,
    FiMapPin,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiAlertCircle,
    FiCheckCircle,
} from "react-icons/fi";
import { LoadingSpinner } from "../components/Loading";
import Billiards from "../assets/Billiards.png";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        phoneNumber: "",
        address: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const validateForm = () => {
        const errors = {};

        if (!form.fullName.trim()) {
            errors.fullName = "Vui lòng nhập họ tên";
        }

        if (!form.email.trim()) {
            errors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = "Email không hợp lệ";
        }

        if (!form.username.trim()) {
            errors.username = "Vui lòng nhập tên đăng nhập";
        } else if (form.username.length < 3) {
            errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
        }

        if (!form.password) {
            errors.password = "Vui lòng nhập mật khẩu";
        } else if (form.password.length < 6) {
            errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        if (!form.phoneNumber.trim()) {
            errors.phoneNumber = "Vui lòng nhập số điện thoại";
        } else if (!/^[0-9+\-\s()]+$/.test(form.phoneNumber)) {
            errors.phoneNumber = "Số điện thoại không hợp lệ";
        }

        if (!form.address.trim()) {
            errors.address = "Vui lòng nhập địa chỉ";
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
        setSuccess("");

        try {
            await register(
                form.fullName,
                form.email,
                form.username,
                form.password,
                form.phoneNumber,
                form.address
            );
            setSuccess(
                "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
            );
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            const errorMessage =
                err.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

            // Clear previous field errors first
            setFieldErrors({});

            // Handle specific error messages
            if (
                errorMessage.toLowerCase().includes("email") &&
                (errorMessage.toLowerCase().includes("đã tồn tại") ||
                    errorMessage.toLowerCase().includes("already exists"))
            ) {
                setFieldErrors({ email: "Email này đã được sử dụng" });
                setError("Email đã được đăng ký. Vui lòng sử dụng email khác.");
            } else if (
                errorMessage.toLowerCase().includes("username") &&
                (errorMessage.toLowerCase().includes("đã tồn tại") ||
                    errorMessage.toLowerCase().includes("already exists"))
            ) {
                setFieldErrors({
                    username: "Tên đăng nhập này đã được sử dụng",
                });
                setError(
                    "Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác."
                );
            } else if (
                errorMessage.toLowerCase().includes("tên đăng nhập") &&
                errorMessage.toLowerCase().includes("đã tồn tại")
            ) {
                setFieldErrors({
                    username: "Tên đăng nhập này đã được sử dụng",
                });
                setError(
                    "Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác."
                );
            } else {
                setError(errorMessage);
            }
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
        // Clear general error when user starts fixing the problematic field
        if (error && (field === "email" || field === "username")) {
            setError("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Left side - Image */}
                    <div className="lg:w-2/5 relative">
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
                                    Tham gia BK Billiards
                                </h1>
                                <p className="text-lg opacity-90">
                                    Tạo tài khoản để truy cập vào bộ sưu tập cơ
                                    bida cao cấp và nhiều ưu đãi hấp dẫn.
                                </p>
                                <div className="mt-6 space-y-2 text-sm">
                                    <div className="flex items-center justify-center space-x-2">
                                        <FiCheckCircle className="w-4 h-4" />
                                        <span>
                                            Miễn phí vận chuyển đơn hàng đầu
                                            tiên
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <FiCheckCircle className="w-4 h-4" />
                                        <span>
                                            Ưu đãi dành riêng cho thành viên
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <FiCheckCircle className="w-4 h-4" />
                                        <span>Theo dõi đơn hàng dễ dàng</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="lg:w-3/5 p-8 lg:p-12">
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Đăng ký tài khoản
                                </h2>
                                <p className="text-gray-600">
                                    Điền thông tin để tạo tài khoản mới
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

                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                                    <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-green-700 text-sm">
                                        {success}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên *
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Nhập họ và tên"
                                            value={form.fullName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "fullName",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.fullName
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                                            }`}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.fullName && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {fieldErrors.fullName}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                placeholder="Nhập email"
                                                value={form.email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                                                    fieldErrors.email
                                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                                                }`}
                                                disabled={loading}
                                            />
                                        </div>
                                        {fieldErrors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {fieldErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên đăng nhập *
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
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu *
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

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại *
                                    </label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            placeholder="Nhập số điện thoại"
                                            value={form.phoneNumber}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "phoneNumber",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.phoneNumber
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                                            }`}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.phoneNumber && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {fieldErrors.phoneNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ *
                                    </label>
                                    <div className="relative">
                                        <FiMapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                        <textarea
                                            placeholder="Nhập địa chỉ"
                                            rows={3}
                                            value={form.address}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors resize-none ${
                                                fieldErrors.address
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                                            }`}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.address && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {fieldErrors.address}
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
                                            <span>Đang đăng ký...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Đăng ký tài khoản</span>
                                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600 text-sm">
                                    Đã có tài khoản?{" "}
                                    <Link
                                        to="/login"
                                        className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
