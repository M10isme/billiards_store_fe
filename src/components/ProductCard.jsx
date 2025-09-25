import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";
import CueImg from "../assets/Cue.png";

export default function ProductCard({ product, variant = "default" }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if user is logged in
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        // Check stock availability
        if (product.quantityInStock <= 0) {
            toast.error("Sản phẩm đã hết hàng!");
            return;
        }

        setIsLoading(true);

        try {
            await addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                imageUrl: product.imageUrl,
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/products/${product.id}`);
    };

    // Calculate discount percentage if original price exists
    const discountPercentage = product.originalPrice
        ? Math.round(
              ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
          )
        : 0;

    // Stock status
    const getStockStatus = () => {
        if (product.quantityInStock === 0)
            return { text: "Hết hàng", color: "text-red-600 bg-red-50" };
        if (product.quantityInStock <= 5)
            return {
                text: `Còn ${product.quantityInStock}`,
                color: "text-orange-600 bg-orange-50",
            };
        return { text: "Còn hàng", color: "text-green-600 bg-green-50" };
    };

    const stockStatus = getStockStatus();

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
            <Link to={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                        src={CueImg}
                        alt={product.name}
                        className="w-full h-56 object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={handleWishlist}
                                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                                    isWishlisted
                                        ? "bg-red-500 text-white"
                                        : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
                                }`}
                            >
                                <FiHeart
                                    className={`w-4 h-4 ${
                                        isWishlisted ? "fill-current" : ""
                                    }`}
                                />
                            </button>
                            <button
                                onClick={handleQuickView}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
                            >
                                <FiEye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {discountPercentage > 0 && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                -{discountPercentage}%
                            </span>
                        )}
                        {product.isNew && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                Mới
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 text-lg">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center space-x-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(product.rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">
                                ({product.reviewCount || 0})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-red-600">
                                {product.price?.toLocaleString("vi-VN")}đ
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    {product.originalPrice.toLocaleString(
                                        "vi-VN"
                                    )}
                                    đ
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stock status */}
                    <div className="flex items-center justify-between mb-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                        >
                            {stockStatus.text}
                        </span>
                        {product.supplier && (
                            <span className="text-xs text-gray-400">
                                {product.supplier.name}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <div className="p-5 pt-0">
                <button
                    onClick={handleAddToCart}
                    disabled={isLoading || product.quantityInStock === 0}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                        product.quantityInStock === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : isLoading
                            ? "bg-red-400 text-white cursor-wait"
                            : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transform hover:scale-105"
                    }`}
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                        <FiShoppingCart className="w-4 h-4" />
                    )}
                    <span>
                        {product.quantityInStock === 0
                            ? "Hết hàng"
                            : isLoading
                            ? "Đang thêm..."
                            : "Thêm vào giỏ"}
                    </span>
                </button>
            </div>
        </div>
    );
}
