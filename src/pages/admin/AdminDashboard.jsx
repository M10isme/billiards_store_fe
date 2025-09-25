import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
    FiPackage,
    FiShoppingBag,
    FiUsers,
    FiDollarSign,
    FiClock,
    FiCheck,
    FiTrendingUp,
    FiActivity,
    FiArrowUp,
    FiArrowDown,
} from "react-icons/fi";
import { LoadingSpinner } from "../../components/Loading";

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/dashboard/stats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    const statsCards = [
        {
            title: "Tổng sản phẩm",
            value: stats?.totalProducts || 0,
            icon: FiPackage,
            color: "bg-blue-500",
            lightColor: "bg-blue-50",
            iconColor: "text-blue-500",
            change: "+12%",
            changeType: "increase",
        },
        {
            title: "Tổng đơn hàng",
            value: stats?.totalOrders || 0,
            icon: FiShoppingBag,
            color: "bg-green-500",
            lightColor: "bg-green-50",
            iconColor: "text-green-500",
            change: "+8%",
            changeType: "increase",
        },
        {
            title: "Khách hàng",
            value: stats?.totalCustomers || 0,
            icon: FiUsers,
            color: "bg-purple-500",
            lightColor: "bg-purple-50",
            iconColor: "text-purple-500",
            change: "+15%",
            changeType: "increase",
        },
        {
            title: "Doanh thu",
            value: `${(stats?.totalRevenue || 0).toLocaleString("vi-VN")}₫`,
            icon: FiDollarSign,
            color: "bg-yellow-500",
            lightColor: "bg-yellow-50",
            iconColor: "text-yellow-500",
            change: "+23%",
            changeType: "increase",
        },
        {
            title: "Chờ xử lý",
            value: stats?.pendingOrders || 0,
            icon: FiClock,
            color: "bg-orange-500",
            lightColor: "bg-orange-50",
            iconColor: "text-orange-500",
            change: "-5%",
            changeType: "decrease",
        },
        {
            title: "Hoàn thành",
            value: stats?.completedOrders || 0,
            icon: FiCheck,
            color: "bg-teal-500",
            lightColor: "bg-teal-50",
            iconColor: "text-teal-500",
            change: "+18%",
            changeType: "increase",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Bảng điều khiển
                    </h1>
                    <p className="text-gray-600">
                        Tổng quan về cửa hàng của bạn
                    </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiActivity className="w-4 h-4" />
                    <span>
                        Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {typeof card.value === "number"
                                        ? card.value.toLocaleString()
                                        : card.value}
                                </p>
                                <div className="flex items-center mt-2">
                                    {card.changeType === "increase" ? (
                                        <FiArrowUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <FiArrowDown className="w-4 h-4 text-red-500" />
                                    )}
                                    <span
                                        className={`ml-1 text-sm font-medium ${
                                            card.changeType === "increase"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {card.change}
                                    </span>
                                    <span className="ml-1 text-sm text-gray-500">
                                        so với tháng trước
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`p-3 rounded-lg ${card.lightColor}`}
                            >
                                <card.icon
                                    className={`w-6 h-6 ${card.iconColor}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Thao tác nhanh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/orders"
                        className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                <FiShoppingBag className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-gray-900">
                                    Quản lý đơn hàng
                                </p>
                                <p className="text-sm text-gray-500">
                                    Xem và xử lý đơn hàng
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/products"
                        className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                <FiPackage className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-gray-900">
                                    Quản lý sản phẩm
                                </p>
                                <p className="text-sm text-gray-500">
                                    Thêm, sửa, xóa sản phẩm
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/suppliers"
                        className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                <FiUsers className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-gray-900">
                                    Nhà cung cấp
                                </p>
                                <p className="text-sm text-gray-500">
                                    Quản lý nhà cung cấp
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Hoạt động gần đây
                </h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="ml-3 text-sm text-gray-600">
                                Đơn hàng #{1000 + index} đã được cập nhật trạng
                                thái
                            </p>
                            <span className="ml-auto text-xs text-gray-400">
                                {index + 1} phút trước
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
