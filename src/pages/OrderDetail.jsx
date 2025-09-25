import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
    FiArrowLeft,
    FiPackage,
    FiTruck,
    FiCheck,
    FiClock,
    FiX,
    FiMapPin,
    FiUser,
    FiPhone,
    FiMail,
    FiCalendar,
    FiDollarSign,
} from "react-icons/fi";
import { SectionLoading } from "../components/Loading";
import CueImg from "../assets/Cue.png";

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token || !id) {
                console.log("Missing token or id:", { token: !!token, id });
                return;
            }

            setLoading(true);
            try {
                const url = `${import.meta.env.VITE_API_URL}/api/orders/${id}`;
                console.log("Fetching order from:", url);

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("Response status:", response.status);

                if (!response.ok) {
                    // If API not available, try fallback to /my orders and find by ID
                    console.log("Trying fallback to /my orders...");
                    const fallbackResponse = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/orders/my`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (fallbackResponse.ok) {
                        const orders = await fallbackResponse.json();
                        const foundOrder = orders.find(
                            (order) => order.id.toString() === id
                        );
                        if (foundOrder) {
                            console.log(
                                "Found order via fallback:",
                                foundOrder
                            );
                            setOrder(foundOrder);
                            return;
                        }
                    }

                    const errorText = await response.text();
                    console.error("API Error:", response.status, errorText);
                    throw new Error(
                        `Không thể tải thông tin đơn hàng (${response.status})`
                    );
                }

                const data = await response.json();
                console.log("Order data received:", data);
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, token]);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "confirmed":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "shipped":
                return "text-purple-600 bg-purple-50 border-purple-200";
            case "delivered":
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
                return <FiClock className="w-5 h-5" />;
            case "confirmed":
                return <FiCheck className="w-5 h-5" />;
            case "shipped":
                return <FiTruck className="w-5 h-5" />;
            case "delivered":
                return <FiCheck className="w-5 h-5" />;
            case "cancelled":
                return <FiX className="w-5 h-5" />;
            default:
                return <FiClock className="w-5 h-5" />;
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "Chờ xử lý";
            case "confirmed":
                return "Đã xác nhận";
            case "shipped":
                return "Đang giao hàng";
            case "delivered":
                return "Đã giao hàng";
            case "cancelled":
                return "Đã hủy";
            default:
                return status || "Không rõ";
        }
    };

    const getOrderProgress = (status) => {
        const steps = [
            { key: "pending", label: "Đặt hàng", icon: FiPackage },
            { key: "confirmed", label: "Xác nhận", icon: FiCheck },
            { key: "shipped", label: "Đang giao", icon: FiTruck },
            { key: "delivered", label: "Hoàn thành", icon: FiCheck },
        ];

        const currentIndex = steps.findIndex(
            (step) => step.key === status?.toLowerCase()
        );
        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex,
        }));
    };

    if (loading) {
        return <SectionLoading message="Đang tải thông tin đơn hàng..." />;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiX className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Không tìm thấy đơn hàng
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error ||
                            "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập."}
                    </p>
                    <button
                        onClick={() => navigate("/profile?tab=orders")}
                        className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Quay lại danh sách đơn hàng</span>
                    </button>
                </div>
            </div>
        );
    }

    const orderProgress = getOrderProgress(order.status);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate("/profile?tab=orders")}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            <span>Quay lại</span>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Chi tiết đơn hàng
                            </h1>
                            <p className="text-gray-600">
                                Đơn hàng #{order.id}
                            </p>
                        </div>
                    </div>
                    <div
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border font-medium ${getStatusColor(
                            order.status
                        )}`}
                    >
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Progress */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Trạng thái đơn hàng
                            </h2>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    {orderProgress.map((step, index) => (
                                        <div
                                            key={step.key}
                                            className="flex flex-col items-center relative"
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                                                    step.completed
                                                        ? "bg-green-600 border-green-600 text-white"
                                                        : step.active
                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                        : "bg-gray-100 border-gray-300 text-gray-400"
                                                }`}
                                            >
                                                <step.icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-center mt-2">
                                                <p
                                                    className={`text-sm font-medium ${
                                                        step.completed ||
                                                        step.active
                                                            ? "text-gray-900"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {step.label}
                                                </p>
                                            </div>
                                            {index <
                                                orderProgress.length - 1 && (
                                                <div
                                                    className={`absolute top-6 left-12 w-full h-0.5 ${
                                                        step.completed
                                                            ? "bg-green-600"
                                                            : "bg-gray-300"
                                                    }`}
                                                    style={{
                                                        width: "calc(100% + 48px)",
                                                    }}
                                                ></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Sản phẩm đã đặt
                            </h2>
                            <div className="space-y-4">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl"
                                        >
                                            <img
                                                src={item.imageUrl || CueImg}
                                                alt={
                                                    item.productName ||
                                                    item.name
                                                }
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {item.productName ||
                                                        item.name}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Số lượng: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString("vi-VN")}
                                                    đ
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {item.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    đ × {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        Không có thông tin sản phẩm
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Lịch sử đơn hàng
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                        <FiCalendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Đơn hàng được tạo
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {formatDateTime(order.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                {order.updatedAt &&
                                    order.updatedAt !== order.createdAt && (
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                <FiCheck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Cập nhật lần cuối
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDateTime(
                                                        order.updatedAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Tóm tắt đơn hàng
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Tạm tính:
                                    </span>
                                    <span className="font-medium">
                                        {(
                                            order.totalAmount || 0
                                        ).toLocaleString("vi-VN")}
                                        đ
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Phí vận chuyển:
                                    </span>
                                    <span className="font-medium">
                                        Miễn phí
                                    </span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Tổng cộng:
                                    </span>
                                    <span className="text-lg font-bold text-red-600">
                                        {(
                                            order.totalAmount || 0
                                        ).toLocaleString("vi-VN")}
                                        đ
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thông tin khách hàng
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <FiUser className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">
                                        {order.customerName || "Chưa cập nhật"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiPhone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">
                                        {order.customerPhone || "Chưa cập nhật"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiMail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">
                                        {order.customerEmail || "Chưa cập nhật"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Địa chỉ giao hàng
                            </h3>
                            <div className="flex items-start space-x-3">
                                <FiMapPin className="w-4 h-4 text-gray-400 mt-1" />
                                <p className="text-gray-600 leading-relaxed">
                                    {order.shippingAddress ||
                                        order.customerAddress ||
                                        "Chưa cập nhật địa chỉ"}
                                </p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Phương thức thanh toán
                            </h3>
                            <div className="flex items-center space-x-3">
                                <FiDollarSign className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                    {order.paymentMethod ||
                                        "Thanh toán khi nhận hàng"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
