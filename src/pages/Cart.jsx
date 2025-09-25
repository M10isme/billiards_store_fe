import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import {
    FiShoppingCart,
    FiPlus,
    FiMinus,
    FiTrash2,
    FiArrowRight,
    FiShoppingBag,
    FiX,
    FiRefreshCw,
} from "react-icons/fi";
import { LoadingSpinner } from "../components/Loading";
import CueImg from "../assets/Cue.png";

export default function Cart() {
    const {
        items: cartItems,
        totalAmount,
        removeFromCart,
        updateQuantity,
        clearCart,
    } = useCart();

    const [loadingItems, setLoadingItems] = useState({});
    const [showClearModal, setShowClearModal] = useState(false);

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        // Basic validation - you might want to fetch product info to check stock
        if (newQuantity > 999) {
            // Reasonable upper limit
            toast.error("Số lượng quá lớn!");
            return;
        }

        setLoadingItems((prev) => ({ ...prev, [productId]: true }));

        try {
            await updateQuantity(productId, newQuantity);
        } catch (error) {
            console.error("Error updating quantity:", error);
        } finally {
            setLoadingItems((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const handleRemoveItem = async (productId) => {
        setLoadingItems((prev) => ({ ...prev, [productId]: true }));

        try {
            await removeFromCart(productId);
        } catch (error) {
            console.error("Error removing item:", error);
        } finally {
            setLoadingItems((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const handleClearCart = () => {
        clearCart();
        setShowClearModal(false);
    };

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-gray-400 text-6xl mb-6">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Giỏ hàng trống
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám
                            phá các sản phẩm tuyệt vời của chúng tôi!
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors group"
                        >
                            <FiShoppingBag className="w-5 h-5" />
                            <span>Mua sắm ngay</span>
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Giỏ hàng
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {cartItems.length} sản phẩm trong giỏ hàng
                        </p>
                    </div>
                    <button
                        onClick={() => setShowClearModal(true)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Xóa tất cả</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.productId || item.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
                            >
                                <div className="flex items-center space-x-4">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <img
                                                src={CueImg}
                                                alt={item.name}
                                                className="w-16 h-16 object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-lg font-bold text-red-600 mt-1">
                                            {item.price.toLocaleString("vi-VN")}
                                            đ
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.productId ||
                                                            item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity <= 1 ||
                                                    loadingItems[
                                                        item.productId ||
                                                            item.id
                                                    ]
                                                }
                                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FiMinus className="w-4 h-4" />
                                            </button>

                                            <span className="px-4 py-2 font-semibold min-w-[60px] text-center">
                                                {loadingItems[
                                                    item.productId || item.id
                                                ] ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.productId ||
                                                            item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                disabled={
                                                    loadingItems[
                                                        item.productId ||
                                                            item.id
                                                    ]
                                                }
                                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item.productId || item.id
                                                )
                                            }
                                            disabled={
                                                loadingItems[
                                                    item.productId || item.id
                                                ]
                                            }
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Tạm tính:
                                    </span>
                                    <span className="font-bold text-xl text-gray-900">
                                        {(
                                            item.price * item.quantity
                                        ).toLocaleString("vi-VN")}
                                        đ
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Tóm tắt đơn hàng
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Tạm tính:
                                    </span>
                                    <span className="font-semibold">
                                        {totalAmount.toLocaleString("vi-VN")}đ
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Phí vận chuyển:
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        Miễn phí
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            Tổng cộng:
                                        </span>
                                        <span className="text-2xl font-bold text-red-600">
                                            {totalAmount.toLocaleString(
                                                "vi-VN"
                                            )}
                                            đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <Link
                                    to="/checkout"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 group"
                                >
                                    <FiShoppingCart className="w-5 h-5" />
                                    <span>Tiến hành đặt hàng</span>
                                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    to="/products"
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FiShoppingBag className="w-4 h-4" />
                                    <span>Tiếp tục mua sắm</span>
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-500">
                                            ✓
                                        </span>
                                        <span>
                                            Miễn phí vận chuyển toàn quốc
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-500">
                                            ✓
                                        </span>
                                        <span>Đổi trả trong 30 ngày</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-500">
                                            ✓
                                        </span>
                                        <span>Thanh toán an toàn</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clear Cart Modal */}
            {showClearModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="text-center">
                            <div className="text-red-500 text-4xl mb-4">⚠️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Xóa tất cả sản phẩm?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi
                                giỏ hàng? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowClearModal(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    <span>Xóa tất cả</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
