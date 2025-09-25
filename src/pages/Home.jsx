import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowRight,
    FiShoppingBag,
    FiTrendingUp,
    FiStar,
    FiEye,
} from "react-icons/fi";
import CueImg from "../assets/Cue.png";
import BilliardsImg from "../assets/Billiards.png";

export default function Home() {
    const [flashSales, setFlashSales] = useState([]);
    const [bestSelling, setBestSelling] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [explore, setExplore] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const [flashRes, bestRes, newRes, exploreRes] =
                    await Promise.all([
                        fetch(
                            `${
                                import.meta.env.VITE_API_URL
                            }/products/flash-sales`
                        ),
                        fetch(
                            `${
                                import.meta.env.VITE_API_URL
                            }/products/best-selling`
                        ),
                        fetch(
                            `${
                                import.meta.env.VITE_API_URL
                            }/products/new-arrivals`
                        ),
                        fetch(
                            `${import.meta.env.VITE_API_URL}/products/explore`
                        ),
                    ]);

                const [flashData, bestData, newData, exploreData] =
                    await Promise.all([
                        flashRes.json(),
                        bestRes.json(),
                        newRes.json(),
                        exploreRes.json(),
                    ]);

                setFlashSales(flashData);
                setBestSelling(bestData);
                setNewArrivals(newData);
                setExplore(exploreData);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    // Skeleton loader component
    const ProductSkeleton = () => (
        <div className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-2/3 mb-2"></div>
            <div className="bg-gray-200 h-6 rounded w-1/2"></div>
        </div>
    );

    // Enhanced product card component
    const ProductCard = ({ product }) => (
        <div
            onClick={() => navigate(`/products/${product.id}`)}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-red-200"
        >
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                    src={CueImg}
                    alt={product.name}
                    className="w-full h-48 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiEye className="w-4 h-4 text-gray-600" />
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-red-600">
                        {product.price?.toLocaleString("vi-VN")}đ
                    </span>
                    <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                        Còn {product.quantityInStock}
                    </div>
                </div>
            </div>
        </div>
    );

    // Section component with modern design
    const ProductSection = ({
        title,
        products,
        icon: Icon,
        gradient,
        viewAllPath,
    }) => (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-2xl ${gradient}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {title}
                    </h2>
                </div>
                <button
                    onClick={() => navigate(viewAllPath)}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium group"
                >
                    <span>Xem tất cả</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading
                    ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
                    : products
                          .slice(0, 4)
                          .map((product) => (
                              <ProductCard key={product.id} product={product} />
                          ))}
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                    Nâng tầm
                                    <span className="block text-red-400">
                                        trải nghiệm bida
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    Khám phá bộ sưu tập cơ bida chuyên nghiệp từ
                                    các thương hiệu hàng đầu thế giới. Chất
                                    lượng cao, giá cả hợp lý.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate("/products")}
                                    className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
                                >
                                    <FiShoppingBag className="w-5 h-5" />
                                    <span>Mua sắm ngay</span>
                                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate("/about")}
                                    className="border-2 border-white/30 hover:border-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                                >
                                    Tìm hiểu thêm
                                </button>
                            </div>

                            <div className="flex items-center space-x-8 pt-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-400">
                                        500+
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        Sản phẩm
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-400">
                                        10K+
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        Khách hàng
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-400">
                                        5⭐
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        Đánh giá
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src={BilliardsImg}
                                    alt="Billiards"
                                    className="w-full max-w-lg mx-auto drop-shadow-2xl"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded-full blur-3xl transform rotate-12 scale-150"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Product Sections */}
                <ProductSection
                    title="Phân khúc tầm trung"
                    products={flashSales}
                    icon={FiTrendingUp}
                    gradient="bg-gradient-to-r from-orange-500 to-red-500"
                    viewAllPath="/products?category=flash-sales"
                />

                <ProductSection
                    title="Bán chạy nhất"
                    products={bestSelling}
                    icon={FiStar}
                    gradient="bg-gradient-to-r from-green-500 to-emerald-500"
                    viewAllPath="/products?category=best-selling"
                />

                <ProductSection
                    title="Hàng mới về"
                    products={newArrivals}
                    icon={FiShoppingBag}
                    gradient="bg-gradient-to-r from-blue-500 to-purple-500"
                    viewAllPath="/products?category=new-arrivals"
                />

                <ProductSection
                    title="Khám phá thêm"
                    products={explore}
                    icon={FiEye}
                    gradient="bg-gradient-to-r from-purple-500 to-pink-500"
                    viewAllPath="/products?category=explore"
                />

                {/* Features Section */}
                <section className="mt-20 bg-gradient-to-r from-gray-50 to-red-50 rounded-3xl p-8 lg:p-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tại sao chọn chúng tôi?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Những lý do khiến khách hàng tin tưởng và quay lại
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FiStar className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Chất lượng cao
                                </h3>
                                <p className="text-gray-600">
                                    Sản phẩm chính hãng từ các thương hiệu uy
                                    tín, đảm bảo chất lượng tốt nhất
                                </p>
                            </div>
                        </div>

                        <div className="text-center group">
                            <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FiShoppingBag className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Giao hàng nhanh
                                </h3>
                                <p className="text-gray-600">
                                    Đóng gói cẩn thận, giao hàng toàn quốc trong
                                    1-3 ngày làm việc
                                </p>
                            </div>
                        </div>

                        <div className="text-center group">
                            <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FiTrendingUp className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Giá tốt nhất
                                </h3>
                                <p className="text-gray-600">
                                    Cam kết giá cả cạnh tranh, nhiều chương
                                    trình khuyến mãi hấp dẫn
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
