import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

function formatDateTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
        d.getSeconds()
    )} ngày ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function mapOrderStatus(status) {
    switch (status) {
        case "PENDING":
            return "Chờ xử lý";
        case "PROCESSING":
            return "Đang xử lý";
        case "SHIPPED":
            return "Đang giao";
        case "COMPLETED":
            return "Hoàn thành";
        case "CANCELLED":
            return "Đã huỷ";
        default:
            return status || "";
    }
}

function mapOrderStatusInfo(status) {
    switch (status) {
        case "PENDING":
            return {
                label: "Chờ xử lý",
                classes: "bg-yellow-100 text-yellow-800",
            };
        case "PROCESSING":
            return {
                label: "Đang xử lý",
                classes: "bg-blue-100 text-blue-800",
            };
        case "SHIPPED":
            return {
                label: "Đang giao",
                classes: "bg-purple-100 text-purple-800",
            };
        case "COMPLETED":
            return {
                label: "Hoàn thành",
                classes: "bg-green-100 text-green-800",
            };
        case "CANCELLED":
            return { label: "Đã huỷ", classes: "bg-gray-200 text-gray-800" };
        default:
            return {
                label: status || "",
                classes: "bg-gray-100 text-gray-800",
            };
    }
}

export default function Orders() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/orders/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setOrders)
            .catch(console.error);
    }, [token]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h2>
            <ul>
                {orders.map((o) => (
                    <li key={o.id} className="border p-4 mb-2 rounded">
                        <p>
                            <strong>Thời gian:</strong>{" "}
                            {formatDateTime(o.createdAt)}
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                {(() => {
                                    const info = mapOrderStatusInfo(o.status);
                                    return (
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${info.classes}`}
                                        >
                                            {info.label}
                                        </span>
                                    );
                                })()}
                            </p>
                        </p>
                        <p>
                            <strong>Trạng thái:</strong>{" "}
                            {mapOrderStatus(o.status)}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
