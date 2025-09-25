import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import toast from "react-hot-toast";
import {
    FiShoppingBag,
    FiSearch,
    FiFilter,
    FiEdit3,
    FiEye,
    FiClock,
    FiCheck,
    FiTruck,
    FiX,
    FiCalendar,
    FiUser,
    FiDollarSign,
} from "react-icons/fi";
import { LoadingSpinner } from "../../components/Loading";

export default function AdminOrders() {
    const { token, user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    const load = async () => {
        try {
            if (!token) {
                setLoading(false);
                return;
            }

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.ok) {
                const data = await res.json();
                console.log("Orders data from API:", data); // Debug log
                if (data.length > 0) {
                    console.log("First order structure:", data[0]); // Debug first order
                    console.log(
                        "First order totalAmount:",
                        data[0].totalAmount
                    ); // Debug totalAmount specifically
                }
                setOrders(data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user) {
            load();
        }
    }, [token, user]);

    const updateOrderStatus = async (id, status) => {
        try {
            if (!token) {
                toast.error("Phiên đăng nhập đã hết hạn");
                return;
            }

            const res = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/orders/${id}/status?status=${status}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.ok) {
                toast.success("Đã cập nhật trạng thái đơn hàng");
                load();
            } else {
                toast.error("Không thể cập nhật trạng thái");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        }
    };

    const viewOrderDetail = async (orderId) => {
        try {
            // Try admin endpoint first for complete data
            let res = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Fallback to regular endpoint if admin endpoint doesn't exist
            if (!res.ok) {
                res = await fetch(
                    `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            if (res.ok) {
                const orderDetail = await res.json();
                console.log("Order detail from API:", orderDetail); // Debug log
                console.log("User data in order detail:", orderDetail.user); // Debug user data
                setSelectedOrder(orderDetail);
                setShowOrderDetail(true);
            } else {
                toast.error("Không thể lấy chi tiết đơn hàng");
            }
        } catch (error) {
            console.error("Error fetching order detail:", error);
            toast.error("Có lỗi xảy ra khi lấy chi tiết đơn hàng");
        }
    };

    // Helper functions
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-purple-100 text-purple-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <FiClock className="w-4 h-4" />;
            case "processing":
                return <FiEdit3 className="w-4 h-4" />;
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

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id?.toString().includes(searchTerm) ||
            order.customerName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            order.customerUsername
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            order.status?.toLowerCase() === statusFilter.toLowerCase();

        const matchesDate =
            dateFilter === "all" ||
            (() => {
                const orderDate = new Date(order.createdAt);
                const today = new Date();

                switch (dateFilter) {
                    case "today":
                        return (
                            orderDate.toDateString() === today.toDateString()
                        );
                    case "week":
                        const weekAgo = new Date(
                            today.setDate(today.getDate() - 7)
                        );
                        return orderDate >= weekAgo;
                    case "month":
                        const monthAgo = new Date(
                            today.setMonth(today.getMonth() - 1)
                        );
                        return orderDate >= monthAgo;
                    default:
                        return true;
                }
            })();

        return matchesSearch && matchesStatus && matchesDate;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-gray-600">
                        Theo dõi và xử lý đơn hàng của khách hàng
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FiShoppingBag className="w-4 h-4" />
                        <span>{filteredOrders.length} đơn hàng</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo ID, tên khách hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipped">Đang giao</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="all">Tất cả thời gian</option>
                            <option value="today">Hôm nay</option>
                            <option value="week">7 ngày qua</option>
                            <option value="month">30 ngày qua</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đơn hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng tiền
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày đặt
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                <FiShoppingBag className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Đơn hàng #{order.id}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.items?.length || 0}{" "}
                                                    sản phẩm
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <FiUser className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.customerName ||
                                                        order.customerUsername}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.customerEmail}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-900">
                                                {(() => {
                                                    const amount =
                                                        order.totalPrice;
                                                    return typeof amount ===
                                                        "number"
                                                        ? amount.toLocaleString(
                                                              "vi-VN"
                                                          )
                                                        : "0";
                                                })()}
                                                ₫
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}
                                            <span className="ml-1.5">
                                                {getStatusText(order.status)}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                                            {order.createdAt
                                                ? new Date(
                                                      order.createdAt
                                                  ).toLocaleDateString("vi-VN")
                                                : "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            {order.status?.toLowerCase() !==
                                                "cancelled" &&
                                                order.status?.toLowerCase() !==
                                                    "completed" && (
                                                    <select
                                                        value={
                                                            order.status || ""
                                                        }
                                                        onChange={(e) =>
                                                            updateOrderStatus(
                                                                order.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-red-500 focus:border-red-500"
                                                    >
                                                        <option value="PENDING">
                                                            Chờ xử lý
                                                        </option>
                                                        <option value="PROCESSING">
                                                            Đang xử lý
                                                        </option>
                                                        <option value="SHIPPED">
                                                            Đang giao
                                                        </option>
                                                        <option value="COMPLETED">
                                                            Hoàn thành
                                                        </option>
                                                        <option value="CANCELLED">
                                                            Hủy đơn
                                                        </option>
                                                    </select>
                                                )}
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Xem chi tiết"
                                                onClick={() =>
                                                    viewOrderDetail(order.id)
                                                }
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            Không có đơn hàng
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ||
                            statusFilter !== "all" ||
                            dateFilter !== "all"
                                ? "Không tìm thấy đơn hàng phù hợp với bộ lọc."
                                : "Chưa có đơn hàng nào được đặt."}
                        </p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {showOrderDetail && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Chi tiết đơn hàng #{selectedOrder.id}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowOrderDetail(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="sr-only">Đóng</span>
                                    <FiX className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Order Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        Thông tin đơn hàng
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Mã đơn hàng:
                                            </span>
                                            <span className="font-medium">
                                                #{selectedOrder.id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Ngày đặt:
                                            </span>
                                            <span className="font-medium">
                                                {new Date(
                                                    selectedOrder.createdAt
                                                ).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Trạng thái:
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    selectedOrder.status
                                                )}`}
                                            >
                                                {getStatusText(
                                                    selectedOrder.status
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Tổng tiền:
                                            </span>
                                            <span className="font-bold text-lg">
                                                {(() => {
                                                    const amount =
                                                        selectedOrder.totalAmount;
                                                    return typeof amount ===
                                                        "number"
                                                        ? amount.toLocaleString(
                                                              "vi-VN"
                                                          )
                                                        : "0";
                                                })()}
                                                ₫
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        Thông tin khách hàng
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Tên khách hàng:
                                            </span>
                                            <span className="font-medium">
                                                {selectedOrder.customerName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Email:
                                            </span>
                                            <span className="font-medium">
                                                {selectedOrder.customerEmail ||
                                                    selectedOrder.user?.email ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Số điện thoại:
                                            </span>
                                            <span className="font-medium">
                                                {selectedOrder.customerPhone ||
                                                    selectedOrder.user?.phone ||
                                                    selectedOrder.user
                                                        ?.phoneNumber ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-600 mb-1">
                                                Địa chỉ giao hàng:
                                            </span>
                                            <span className="font-medium text-sm">
                                                {selectedOrder.shippingAddress ||
                                                    selectedOrder.customerAddress ||
                                                    selectedOrder.user
                                                        ?.address ||
                                                    selectedOrder.deliveryAddress ||
                                                    "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Sản phẩm đã đặt
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sản phẩm
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Đơn giá
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Số lượng
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thành tiền
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {(
                                                selectedOrder.items ||
                                                selectedOrder.orderItems ||
                                                []
                                            ).length > 0 ? (
                                                (
                                                    selectedOrder.items ||
                                                    selectedOrder.orderItems ||
                                                    []
                                                ).map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.product
                                                                    ?.name ||
                                                                    item.productName ||
                                                                    item.name ||
                                                                    "N/A"}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.product
                                                                    ?.description ||
                                                                    item.description ||
                                                                    "Không có mô tả"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {(
                                                                item.price ||
                                                                item.unitPrice ||
                                                                0
                                                            )?.toLocaleString(
                                                                "vi-VN"
                                                            )}
                                                            ₫
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {item.quantity || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {(
                                                                (item.price ||
                                                                    item.unitPrice ||
                                                                    0) *
                                                                (item.quantity ||
                                                                    0)
                                                            )?.toLocaleString(
                                                                "vi-VN"
                                                            )}
                                                            ₫
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="px-6 py-4 text-center text-gray-500"
                                                    >
                                                        Không có sản phẩm nào
                                                        trong đơn hàng
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowOrderDetail(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
