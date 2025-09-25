import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiGrid, FiList } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { ListSkeleton, SectionLoading } from "../components/Loading";
import CueImg from "../assets/Cue.png";
import api from "../api/axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 500000000]);
    const [sort, setSort] = useState("default");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const pageSize = 8;
    const location = useLocation();
    const qParam = new URLSearchParams(location.search).get("q") || "";
    const [searchQuery, setSearchQuery] = useState(qParam);
    const navigate = useNavigate();

    useEffect(() => {
        // If qParam exists, use server-side search endpoint; otherwise fetch all products
        const endpoint =
            qParam && qParam.trim() !== ""
                ? `/products/search?q=${encodeURIComponent(qParam)}`
                : `/products`;

        setLoading(true);
        api.get(endpoint)
            .then((res) => res.data)
            .then((data) => {
                setProducts(data);
                setFiltered(data);
                const cats = [
                    ...new Set(data.map((p) => p.category || "Other")),
                ];
                setCategories(cats);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [qParam]);

    // sync searchQuery with URL q param when location changes
    useEffect(() => {
        setSearchQuery(qParam);
    }, [qParam]);

    // Apply filter + sort
    useEffect(() => {
        let result = [...products];

        // If we are NOT using server-side search (qParam), apply client-side search filtering
        if (!qParam || qParam.trim() === "") {
            if (searchQuery && searchQuery.trim() !== "") {
                const q = searchQuery.trim().toLowerCase();
                result = result.filter(
                    (p) =>
                        (p.name || "").toLowerCase().includes(q) ||
                        (p.description || "").toLowerCase().includes(q)
                );
            }
        }

        // filter price
        result = result.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        // sort
        if (sort === "priceLow") result.sort((a, b) => a.price - b.price);
        if (sort === "priceHigh") result.sort((a, b) => b.price - a.price);
        if (sort === "nameAsc")
            result.sort((a, b) => a.name.localeCompare(b.name));
        if (sort === "nameDesc")
            result.sort((a, b) => b.name.localeCompare(a.name));

        setFiltered(result);
        setPage(1); // reset về page 1 khi filter
    }, [priceRange, sort, products, searchQuery]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <aside className="col-span-12 md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                    <FiFilter className="w-5 h-5 text-red-600" />
                    <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Khoảng giá</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                                {priceRange[0].toLocaleString("vi-VN")}đ
                            </span>
                            <span>
                                {priceRange[1].toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={500000000}
                            step={100000}
                            value={priceRange[1]}
                            onChange={(e) =>
                                setPriceRange([
                                    priceRange[0],
                                    Number(e.target.value),
                                ])
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>
                </div>

                {/* Sort */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Sắp xếp</h3>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="default">Mặc định</option>
                        <option value="priceLow">Giá: Thấp → Cao</option>
                        <option value="priceHigh">Giá: Cao → Thấp</option>
                        <option value="nameAsc">Tên sản phẩm: A → Z</option>
                        <option value="nameDesc">Tên sản phẩm: Z → A</option>
                    </select>
                </div>

                {/* Reset filters */}
                <button
                    onClick={() => {
                        setPriceRange([0, 500000000]);
                        setSort("default");
                        setSearchQuery("");
                        navigate(".");
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                    Xóa bộ lọc
                </button>
            </aside>

            {/* Products Grid */}
            <main className="col-span-12 md:col-span-9">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-4">
                    <Link to="/" className="hover:text-red-500">
                        Trang chủ
                    </Link>{" "}
                    / Sản phẩm
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Danh mục sản phẩm
                    </h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const q = searchQuery.trim();
                            setSearchLoading(true);
                            navigate(q ? `?q=${encodeURIComponent(q)}` : ".");
                        }}
                        className="w-full max-w-md"
                    >
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Results count and view toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-gray-600">
                        Hiển thị {displayed.length} / {filtered.length} sản phẩm
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                                Hiển thị:
                            </span>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded ${
                                    viewMode === "grid"
                                        ? "bg-red-100 text-red-600"
                                        : "text-gray-400"
                                }`}
                            >
                                <FiGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded ${
                                    viewMode === "list"
                                        ? "bg-red-100 text-red-600"
                                        : "text-gray-400"
                                }`}
                            >
                                <FiList className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products display */}
                {loading ? (
                    <ListSkeleton count={8} />
                ) : (
                    <div
                        className={`grid gap-6 ${
                            viewMode === "grid"
                                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                                : "grid-cols-1"
                        }`}
                    >
                        {displayed.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                variant={viewMode}
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Không tìm thấy sản phẩm
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                navigate(".");
                                setPriceRange([0, 500000000]);
                                setSort("default");
                            }}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filtered.length > 0 && (
                    <div className="flex justify-center items-center mt-12 space-x-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                        >
                            Trước
                        </button>

                        {Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-4 py-2 border rounded-lg ${
                                            page === pageNum
                                                ? "bg-red-600 text-white border-red-600"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                        )}

                        <button
                            onClick={() =>
                                setPage(Math.min(totalPages, page + 1))
                            }
                            disabled={page === totalPages}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
