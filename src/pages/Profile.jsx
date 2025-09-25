import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    FiUser,
    FiEdit3,
    FiSave,
    FiX,
    FiMail,
    FiPhone,
    FiMapPin,
    FiShoppingBag,
    FiTruck,
    FiCheck,
    FiClock,
    FiLogOut,
    FiEye,
    FiCamera,
    FiSettings,
    FiShield,
    FiTrash2,
} from "react-icons/fi";
import { LoadingSpinner, SectionLoading } from "../components/Loading";
import toast from "react-hot-toast";

export default function Profile() {
    const { user, logout, updateProfile, token } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeTab, setActiveTab] = useState(
        searchParams.get("tab") || "profile"
    );
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        setForm({
            fullName: user.fullName || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            address: user.address || "",
        });
    }, [user, navigate]);

    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    const fetchOrders = useCallback(async () => {
        if (!token) return;

        setOrdersLoading(true);
        try {
            const url = new URL(
                `/api/orders/my`,
                import.meta.env.VITE_API_URL
            ).toString();
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error("Không thể tải đơn hàng");
            }

            const data = await res.json();
            const list = data || [];
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(list);
        } catch (err) {
            console.error("Error fetching orders:", err);
            toast.error("Lỗi khi tải đơn hàng");
        } finally {
            setOrdersLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === "orders") {
            fetchOrders();
        }
    }, [activeTab, fetchOrders]);

    const validateForm = () => {
        const errors = {};

        if (!form.fullName.trim()) {
            errors.fullName = "Vui lòng nhập họ và tên";
        }

        if (!form.email.trim()) {
            errors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = "Email không hợp lệ";
        }

        if (!form.phoneNumber.trim()) {
            errors.phoneNumber = "Vui lòng nhập số điện thoại";
        } else if (
            !/^[0-9]{10,11}$/.test(form.phoneNumber.replace(/\s/g, ""))
        ) {
            errors.phoneNumber = "Số điện thoại không hợp lệ";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                fullName: form.fullName,
                email: form.email,
                phoneNumber: form.phoneNumber,
                address: form.address,
            });
            toast.success("Cập nhật thông tin thành công");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Lỗi khi cập nhật thông tin");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setForm({
            fullName: user.fullName || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            address: user.address || "",
        });
        setFieldErrors({});
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
            return;
        }

        try {
            console.log("Canceling order:", orderId);
            console.log(
                "API URL:",
                `${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`
            );

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response status:", response.status);

            if (!response.ok) {
                // Try to get error message from backend
                let errorMessage = "Không thể hủy đơn hàng";
                try {
                    const errorData = await response.json();
                    console.log("Error data:", errorData);
                    errorMessage =
                        errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    console.log(
                        "Failed to parse error JSON, using status code"
                    );
                    // If parsing JSON fails, use default message
                    if (response.status === 403) {
                        errorMessage = "Bạn không có quyền hủy đơn hàng này";
                    } else if (response.status === 404) {
                        errorMessage = "Không tìm thấy đơn hàng";
                    } else if (response.status === 400) {
                        errorMessage =
                            "Đơn hàng không thể hủy (có thể đã được xử lý)";
                    }
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log("Cancel result:", result);

            toast.success("Đơn hàng đã được hủy thành công");

            // Refresh orders list
            fetchOrders();
        } catch (error) {
            console.error("Error canceling order:", error);
            toast.error(error.message || "Có lỗi xảy ra khi hủy đơn hàng");
        }
    };

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
        if (fieldErrors[field]) {
            setFieldErrors({ ...fieldErrors, [field]: "" });
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const pad = (n) => String(n).padStart(2, "0");
        return `${pad(d.getDate())}/${pad(
            d.getMonth() + 1
        )}/${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "processing":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "shipped":
                return "text-purple-600 bg-purple-50 border-purple-200";
            case "completed":
                return "text-green-600 bg-green-50 border-green-200";
            case "cancelled":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <FiClock className="w-4 h-4" />;
            case "processing":
                return <FiCheck className="w-4 h-4" />;
            case "shipped":
                return <FiTruck className="w-4 h-4" />;
            case "completed":
                return <FiCheck className="w-4 h-4" />;
            case "cancelled":
                return <FiX className="w-4 h-4" />;
            default:
                return <FiClock className="w-4 h-4" />;
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "Chờ xử lý";
            case "processing":
                return "Đang xử lý";
            case "shipped":
                return "Đang giao";
            case "completed":
                return "Hoàn thành";
            case "cancelled":
                return "Đã hủy";
            default:
                return status || "Không rõ";
        }
    };

    if (!user) {
        return <SectionLoading message="Đang tải thông tin..." />;
    }

    const tabs = [
        { id: "profile", label: "Thông tin cá nhân", icon: FiUser },
        { id: "orders", label: "Đơn hàng của tôi", icon: FiShoppingBag },
        { id: "settings", label: "Cài đặt", icon: FiSettings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                {user.fullName
                                    ? user.fullName.charAt(0).toUpperCase()
                                    : user.username?.charAt(0).toUpperCase() ||
                                      "U"}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                                <FiCamera className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {user.fullName || user.username || "Người dùng"}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {user.email || "Chưa cập nhật email"}
                            </p>
                            <div className="flex items-center space-x-4">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    Tài khoản hoạt động
                                </span>
                                <span className="text-gray-500 text-sm">
                                    Thành viên từ{" "}
                                    {new Date(
                                        user.createdAt || Date.now()
                                    ).getFullYear()}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? "border-red-500 text-red-600 bg-red-50"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-8">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="max-w-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Thông tin cá nhân
                                    </h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                        >
                                            <FiEdit3 className="w-4 h-4" />
                                            <span>Chỉnh sửa</span>
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Họ và tên
                                            </label>
                                            {isEditing ? (
                                                <div>
                                                    <div className="relative">
                                                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type="text"
                                                            value={
                                                                form.fullName
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "fullName",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                                                                fieldErrors.fullName
                                                                    ? "border-red-300 focus:ring-red-500"
                                                                    : "border-gray-300 focus:ring-red-500"
                                                            }`}
                                                            placeholder="Nhập họ và tên"
                                                        />
                                                    </div>
                                                    {fieldErrors.fullName && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {
                                                                fieldErrors.fullName
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                                    <FiUser className="w-5 h-5 text-gray-400" />
                                                    <span className="text-gray-900">
                                                        {form.fullName ||
                                                            "Chưa cập nhật"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            {isEditing ? (
                                                <div>
                                                    <div className="relative">
                                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type="email"
                                                            value={form.email}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "email",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                                                                fieldErrors.email
                                                                    ? "border-red-300 focus:ring-red-500"
                                                                    : "border-gray-300 focus:ring-red-500"
                                                            }`}
                                                            placeholder="Nhập email"
                                                        />
                                                    </div>
                                                    {fieldErrors.email && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {fieldErrors.email}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                                    <FiMail className="w-5 h-5 text-gray-400" />
                                                    <span className="text-gray-900">
                                                        {form.email ||
                                                            "Chưa cập nhật"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại
                                            </label>
                                            {isEditing ? (
                                                <div>
                                                    <div className="relative">
                                                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type="tel"
                                                            value={
                                                                form.phoneNumber
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "phoneNumber",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                                                                fieldErrors.phoneNumber
                                                                    ? "border-red-300 focus:ring-red-500"
                                                                    : "border-gray-300 focus:ring-red-500"
                                                            }`}
                                                            placeholder="Nhập số điện thoại"
                                                        />
                                                    </div>
                                                    {fieldErrors.phoneNumber && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {
                                                                fieldErrors.phoneNumber
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                                    <FiPhone className="w-5 h-5 text-gray-400" />
                                                    <span className="text-gray-900">
                                                        {form.phoneNumber ||
                                                            "Chưa cập nhật"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tên đăng nhập
                                            </label>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                                <FiShield className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {user.username}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                    Không thể thay đổi
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Địa chỉ
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <FiMapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                                <textarea
                                                    value={form.address}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "address",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows="3"
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors resize-none"
                                                    placeholder="Nhập địa chỉ"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                                                <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <span className="text-gray-900 flex-1">
                                                    {form.address ||
                                                        "Chưa cập nhật"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="flex space-x-4 pt-4">
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-red-400 transition-colors"
                                            >
                                                {loading ? (
                                                    <LoadingSpinner
                                                        size="sm"
                                                        color="gray"
                                                    />
                                                ) : (
                                                    <FiSave className="w-4 h-4" />
                                                )}
                                                <span>
                                                    {loading
                                                        ? "Đang lưu..."
                                                        : "Lưu thay đổi"}
                                                </span>
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                disabled={loading}
                                                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                            >
                                                <FiX className="w-4 h-4" />
                                                <span>Hủy</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Đơn hàng của tôi
                                    </h2>
                                    <span className="text-gray-600">
                                        Tổng cộng: {orders.length} đơn hàng
                                    </span>
                                </div>

                                {ordersLoading ? (
                                    <div className="text-center py-12">
                                        <LoadingSpinner size="lg" />
                                        <p className="text-gray-600 mt-4">
                                            Đang tải đơn hàng...
                                        </p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Chưa có đơn hàng nào
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Bạn chưa thực hiện đơn hàng nào. Hãy
                                            bắt đầu mua sắm ngay!
                                        </p>
                                        <button
                                            onClick={() =>
                                                navigate("/products")
                                            }
                                            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                        >
                                            Mua sắm ngay
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        <h3 className="font-semibold text-gray-900">
                                                            Đơn hàng #{order.id}
                                                        </h3>
                                                        <span
                                                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                order.status
                                                            )}
                                                            <span>
                                                                {getStatusText(
                                                                    order.status
                                                                )}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-900">
                                                            {order.totalAmount?.toLocaleString(
                                                                "vi-VN"
                                                            )}
                                                            đ
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatDateTime(
                                                                order.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {order.items &&
                                                    order.items.length > 0 && (
                                                        <div className="space-y-2 mb-4">
                                                            {order.items
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center space-x-3 text-sm"
                                                                        >
                                                                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                                                            <span className="flex-1">
                                                                                {item.productName ||
                                                                                    item.name}
                                                                            </span>
                                                                            <span className="text-gray-500">
                                                                                x
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </span>
                                                                            <span className="font-medium">
                                                                                {(
                                                                                    item.price *
                                                                                    item.quantity
                                                                                )?.toLocaleString(
                                                                                    "vi-VN"
                                                                                )}

                                                                                đ
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )}
                                                            {order.items
                                                                .length > 3 && (
                                                                <p className="text-sm text-gray-500 pl-5">
                                                                    Và{" "}
                                                                    {order.items
                                                                        .length -
                                                                        3}{" "}
                                                                    sản phẩm
                                                                    khác...
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="text-sm text-gray-600">
                                                        <span>Giao đến: </span>
                                                        <span className="font-medium">
                                                            {order.shippingAddress ||
                                                                order.customerAddress ||
                                                                "Chưa cập nhật"}
                                                        </span>
                                                    </div>
                                                    {order.status?.toUpperCase() ===
                                                    "PENDING" ? (
                                                        <button
                                                            onClick={() =>
                                                                handleCancelOrder(
                                                                    order.id
                                                                )
                                                            }
                                                            className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                            <span>
                                                                Hủy đơn hàng
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center space-x-2 px-4 py-2 text-gray-500 border border-gray-200 rounded-lg">
                                                            <FiCheck className="w-4 h-4" />
                                                            <span>
                                                                Đã xử lý
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Cài đặt tài khoản
                                </h2>

                                <div className="space-y-6">
                                    <div className="p-6 border border-gray-200 rounded-xl">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Bảo mật tài khoản
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Quản lý mật khẩu và các cài đặt bảo
                                            mật
                                        </p>
                                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                            Đổi mật khẩu
                                        </button>
                                    </div>

                                    <div className="p-6 border border-gray-200 rounded-xl">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Thông báo
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Cài đặt thông báo email và SMS
                                        </p>
                                        <div className="space-y-3">
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                    defaultChecked
                                                />
                                                <span className="text-gray-700">
                                                    Thông báo đơn hàng
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                    defaultChecked
                                                />
                                                <span className="text-gray-700">
                                                    Khuyến mãi và ưu đãi
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                />
                                                <span className="text-gray-700">
                                                    Sản phẩm mới
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="p-6 border border-red-200 rounded-xl bg-red-50">
                                        <h3 className="text-lg font-semibold text-red-900 mb-2">
                                            Xóa tài khoản
                                        </h3>
                                        <p className="text-red-700 mb-4">
                                            Hành động này không thể hoàn tác.
                                            Tất cả dữ liệu sẽ bị xóa vĩnh viễn.
                                        </p>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                            Xóa tài khoản
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
