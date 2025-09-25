import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";
import {
    FiShoppingCart,
    FiHeart,
    FiShare2,
    FiPlus,
    FiMinus,
    FiTruck,
    FiRotateCcw,
    FiShield,
    FiStar,
    FiCheck,
    FiAlertCircle,
    FiArrowLeft,
} from "react-icons/fi";
import { LoadingSpinner, SectionLoading } from "../components/Loading";
import CueImg from "../assets/Cue.png";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedColor, setSelectedColor] = useState("default");
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/products/${id}`
                );
                const data = await response.json();
                setProduct(data);
                setSelectedImage(CueImg);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Validate quantity when product loads or quantity changes
    useEffect(() => {
        if (product && quantity > product.quantityInStock) {
            setQuantity(Math.min(quantity, product.quantityInStock || 1));
        }
    }, [product, quantity]);

    const handleAddToCart = async () => {
        // Check if user is logged in
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        // Validate quantity before adding to cart
        if (quantity > product.quantityInStock) {
            toast.error(
                `Chỉ còn ${product.quantityInStock} sản phẩm trong kho!`
            );
            setQuantity(Math.min(quantity, product.quantityInStock));
            return;
        }

        if (product.quantityInStock <= 0) {
            toast.error("Sản phẩm đã hết hàng!");
            return;
        }

        setAddingToCart(true);
        try {
            await addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.imageUrl,
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        // Check if user is logged in
        if (!user) {
            toast.error("Vui lòng đăng nhập để mua hàng!");
            navigate("/login");
            return;
        }

        // Validate quantity before buying
        if (quantity > product.quantityInStock) {
            toast.error(
                `Chỉ còn ${product.quantityInStock} sản phẩm trong kho!`
            );
            setQuantity(Math.min(quantity, product.quantityInStock));
            return;
        }

        if (product.quantityInStock <= 0) {
            toast.error("Sản phẩm đã hết hàng!");
            return;
        }

        setBuyingNow(true);
        try {
            await addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.imageUrl,
            });
            navigate("/checkout");
        } catch (error) {
            console.error("Error buying now:", error);
        } finally {
            setBuyingNow(false);
        }
    };

    const stockStatus = product?.quantityInStock > 0;
    const stockMessage =
        product?.quantityInStock > 10
            ? "Còn hàng"
            : product?.quantityInStock > 0
            ? `Chỉ còn ${product.quantityInStock} sản phẩm`
            : "Hết hàng";

    if (loading) {
        return <SectionLoading message="Đang tải sản phẩm..." />;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Không tìm thấy sản phẩm
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Quay lại danh sách sản phẩm</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-red-600"
                        >
                            Trang chủ
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link
                            to="/products"
                            className="text-gray-500 hover:text-red-600"
                        >
                            Sản phẩm
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center">
                            <img
                                src={selectedImage || CueImg}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Image thumbnails - Mock data */}
                        <div className="grid grid-cols-4 gap-4">
                            {[CueImg, CueImg, CueImg, CueImg].map(
                                (img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square bg-white rounded-xl border-2 p-2 transition-all ${
                                            selectedImage === img
                                                ? "border-red-500"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`View ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className="w-5 h-5 text-yellow-400 fill-current"
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600">(4.8)</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-600">
                                    124 đánh giá
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-4xl font-bold text-red-600">
                                    {product.price.toLocaleString("vi-VN")}đ
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xl text-gray-400 line-through">
                                        {product.originalPrice.toLocaleString(
                                            "vi-VN"
                                        )}
                                        đ
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center space-x-2 mb-6">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        stockStatus
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                                ></div>
                                <span
                                    className={`font-medium ${
                                        stockStatus
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {stockMessage}
                                </span>
                            </div>
                        </div>

                        {/* Product Options */}
                        <div className="space-y-6">
                            {/* Color Selection */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Màu sắc:
                                </h4>
                                <div className="flex items-center space-x-3">
                                    {["default", "black", "brown"].map(
                                        (color) => (
                                            <button
                                                key={color}
                                                onClick={() =>
                                                    setSelectedColor(color)
                                                }
                                                className={`w-12 h-12 rounded-xl border-2 transition-all ${
                                                    selectedColor === color
                                                        ? "border-red-500 scale-110"
                                                        : "border-gray-300"
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        color === "default"
                                                            ? "#d4a574"
                                                            : color === "black"
                                                            ? "#1a1a1a"
                                                            : "#8b4513",
                                                }}
                                            >
                                                {selectedColor === color && (
                                                    <FiCheck className="w-6 h-6 text-white mx-auto" />
                                                )}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Số lượng:
                                </h4>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-xl">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1)
                                                )
                                            }
                                            disabled={quantity <= 1}
                                            className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="px-6 py-3 font-semibold min-w-[80px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        product?.quantityInStock ||
                                                            1,
                                                        quantity + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                quantity >=
                                                (product?.quantityInStock || 1)
                                            }
                                            className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-gray-600">
                                        {product.quantityInStock} sản phẩm có
                                        sẵn
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!stockStatus || addingToCart}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                                >
                                    {addingToCart ? (
                                        <LoadingSpinner
                                            size="sm"
                                            color="gray"
                                        />
                                    ) : (
                                        <FiShoppingCart className="w-5 h-5" />
                                    )}
                                    <span>
                                        {!stockStatus
                                            ? "Hết hàng"
                                            : addingToCart
                                            ? "Đang thêm..."
                                            : "Thêm vào giỏ"}
                                    </span>
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={!stockStatus || buyingNow}
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                                >
                                    {buyingNow ? (
                                        <LoadingSpinner
                                            size="sm"
                                            color="gray"
                                        />
                                    ) : (
                                        <span>
                                            {!stockStatus
                                                ? "Hết hàng"
                                                : "Mua ngay"}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() =>
                                        setIsWishlisted(!isWishlisted)
                                    }
                                    className={`flex items-center space-x-2 px-6 py-3 border rounded-xl transition-colors ${
                                        isWishlisted
                                            ? "border-red-500 text-red-600 bg-red-50"
                                            : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600"
                                    }`}
                                >
                                    <FiHeart
                                        className={`w-5 h-5 ${
                                            isWishlisted ? "fill-current" : ""
                                        }`}
                                    />
                                    <span>Yêu thích</span>
                                </button>

                                <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors">
                                    <FiShare2 className="w-5 h-5" />
                                    <span>Chia sẻ</span>
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <FiTruck className="w-5 h-5 text-green-600" />
                                <span>
                                    Miễn phí vận chuyển cho đơn hàng trên
                                    500.000đ
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <FiRotateCcw className="w-5 h-5 text-blue-600" />
                                <span>Đổi trả miễn phí trong 30 ngày</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <FiShield className="w-5 h-5 text-purple-600" />
                                <span>Bảo hành chính hãng 12 tháng</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {[
                                { id: "description", label: "Mô tả sản phẩm" },
                                {
                                    id: "specifications",
                                    label: "Thông số kỹ thuật",
                                },
                                { id: "reviews", label: "Đánh giá (124)" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? "border-red-500 text-red-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="py-8">
                        {activeTab === "description" && (
                            <div className="prose max-w-none">
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            Đặc điểm nổi bật:
                                        </h4>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center space-x-2">
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                                <span>
                                                    Chất liệu gỗ maple cao cấp
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                                <span>
                                                    Đầu cơ da nhiều lớp chính
                                                    hãng
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                                <span>
                                                    Thiết kế ergonomic, cầm nắm
                                                    thoải mái
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                                <span>
                                                    Phù hợp cho người chơi từ
                                                    trung cấp đến chuyên nghiệp
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            Bảo hành & Dịch vụ:
                                        </h4>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center space-x-2">
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                                <span>
                                                    Bảo hành 12 tháng lỗi do nhà
                                                    sản xuất
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                                <span>
                                                    Đổi trả trong 30 ngày đầu
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                                <span>
                                                    Dịch vụ bảo dưỡng, sửa chữa
                                                    chuyên nghiệp
                                                </span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <FiCheck className="w-4 h-4 text-green-600" />
                                                <span>Hỗ trợ tư vấn 24/7</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">
                                        Thông số cơ bản:
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">
                                                Chiều dài:
                                            </span>
                                            <span className="font-medium">
                                                147 cm
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">
                                                Trọng lượng:
                                            </span>
                                            <span className="font-medium">
                                                18-21 oz
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">
                                                Đường kính mũi:
                                            </span>
                                            <span className="font-medium">
                                                13mm
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">
                                                Chất liệu:
                                            </span>
                                            <span className="font-medium">
                                                Gỗ Maple
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">
                                        Chi tiết kỹ thuật:
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">
                                                Loại đầu cơ:
                                            </span>
                                            <span className="font-medium">
                                                Da nhiều lớp
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">
                                                Độ cứng:
                                            </span>
                                            <span className="font-medium">
                                                Medium
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">
                                                Khớp nối:
                                            </span>
                                            <span className="font-medium">
                                                5/16 x 18
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">
                                                Xuất xứ:
                                            </span>
                                            <span className="font-medium">
                                                Việt Nam
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div>
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        Tính năng đánh giá đang được phát
                                        triển...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
