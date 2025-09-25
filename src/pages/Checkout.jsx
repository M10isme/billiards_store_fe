import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function Checkout() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items: cartItems = [], clearCart } = useCart();

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);

    // Auto-fill user information when component mounts or user changes
    useEffect(() => {
        if (user) {
            // Auto-fill address and phone from user profile
            setAddress(user.address || "");
            setPhone(user.phoneNumber || "");
        }
    }, [user]);

    const totalPrice = (cartItems || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        // extra guard in case user becomes unauthenticated before submitting
        if (!user) {
            toast.error("Vui lòng đăng nhập để tiếp tục thanh toán");
            navigate("/login");
            return;
        }
        if (!address || !phone) {
            alert("Vui lòng nhập đầy đủ thông tin giao hàng");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    address,
                    phone,
                    paymentMethod,
                    items: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }),
            });

            if (!res.ok) throw new Error("Checkout thất bại");

            clearCart();
            navigate(`/my-orders`);
        } catch (err) {
            console.error(err);
            console.log(
                JSON.stringify({
                    address,
                    phone,
                    paymentMethod,
                    items: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                })
            );
            console.log(import.meta.env.VITE_API_URL);
            console.log(localStorage.getItem("token"));
            alert("Có lỗi khi đặt hàng");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (!user) {
    //         // notify and redirect to login
    //         toast("Vui lòng đăng nhập để tiếp tục", { icon: "🔒" });
    //         navigate("/login");
    //     }
    // }, [user, navigate]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>

            {/* Info message if user info is auto-filled */}
            {user && (user.address || user.phoneNumber) && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="text-blue-600 mr-2">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-blue-800 font-medium">
                                Thông tin đã được điền sẵn
                            </p>
                            <p className="text-blue-600 text-sm">
                                Địa chỉ và số điện thoại đã được lấy từ thông
                                tin tài khoản của bạn. Bạn có thể chỉnh sửa nếu
                                muốn giao đến địa chỉ khác hoặc{" "}
                                <Link
                                    to="/account"
                                    className="underline hover:text-blue-800"
                                >
                                    cập nhật thông tin tài khoản
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Order summary */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Đơn hàng</h3>
                {(cartItems || []).map((item) => (
                    <div
                        key={item.productId}
                        className="flex justify-between border-b py-2 text-sm"
                    >
                        <span>
                            {item.name} × {item.quantity}
                        </span>
                        <span>
                            {(item.price * item.quantity).toLocaleString()} đ
                        </span>
                    </div>
                ))}
                <div className="flex justify-between font-bold mt-3">
                    <span>Tổng cộng:</span>
                    <span>{totalPrice.toLocaleString()} đ</span>
                </div>
            </div>

            {/* Form thông tin */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ giao hàng *
                    </label>
                    <input
                        type="text"
                        placeholder={
                            user?.address
                                ? "Địa chỉ đã được điền sẵn từ thông tin tài khoản"
                                : "Nhập địa chỉ giao hàng"
                        }
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                    {user?.address && (
                        <p className="text-xs text-gray-500 mt-1">
                            💡 Thông tin từ tài khoản của bạn. Bạn có thể chỉnh
                            sửa nếu cần.
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại *
                    </label>
                    <input
                        type="tel"
                        placeholder={
                            user?.phoneNumber
                                ? "Số điện thoại đã được điền sẵn từ thông tin tài khoản"
                                : "Nhập số điện thoại"
                        }
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                    {user?.phoneNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                            💡 Thông tin từ tài khoản của bạn. Bạn có thể chỉnh
                            sửa nếu cần.
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phương thức thanh toán
                    </label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="COD">
                            Thanh toán khi nhận hàng (COD)
                        </option>
                        <option value="BANK_TRANSFER">
                            Chuyển khoản ngân hàng
                        </option>
                        <option value="PAYPAL">PayPal</option>
                    </select>
                </div>
            </div>

            {/* Nút đặt hàng */}
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="mt-6 w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 disabled:bg-gray-400"
            >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
            </button>
        </div>
    );
}
