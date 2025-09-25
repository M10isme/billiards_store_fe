import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../context/CartContext";
import {
    FiSearch,
    FiShoppingCart,
    FiUser,
    FiMenu,
    FiX,
    FiLogOut,
    FiHome,
    FiGrid,
    FiHeart,
} from "react-icons/fi";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { items } = useCart();
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const isCustomer =
        !!user && String(user.role || "").toLowerCase() === "customer";
    const isAdmin = !!user && user.role === "ADMIN";
    const [query, setQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const onSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
        setQuery("");
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Show admin navbar for admin
    if (isAdmin) {
        return (
            <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/admin"
                                className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                            >
                                <div className="text-2xl font-extrabold text-blue-400">
                                    🎱
                                </div>
                                <div className="font-semibold hidden sm:block">
                                    Admin Panel
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-300 hidden md:block">
                                Xin chào, {user.fullName || user.username}
                            </span>
                            <Link
                                to="/"
                                className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                            >
                                <FiHome className="w-4 h-4" />
                                <span className="hidden sm:block">
                                    Trang chủ
                                </span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                            >
                                <FiLogOut className="w-4 h-4" />
                                <span className="hidden sm:block">
                                    Đăng xuất
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Mobile menu button */}
                    <button
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <FiX className="w-6 h-6" />
                        ) : (
                            <FiMenu className="w-6 h-6" />
                        )}
                    </button>

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 flex-shrink-0"
                    >
                        <div className="text-3xl">🎱</div>
                        <div className="hidden sm:block">
                            <div className="font-bold text-xl text-gray-900">
                                BK Billiards
                            </div>
                            <div className="text-xs text-gray-500">
                                Chuyên cơ bida cao cấp
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8 text-gray-600">
                        <Link
                            to="/"
                            className="flex items-center space-x-1 hover:text-red-600 transition-colors font-medium"
                        >
                            <FiHome className="w-4 h-4" />
                            <span>Trang chủ</span>
                        </Link>
                        <Link
                            to="/products"
                            className="flex items-center space-x-1 hover:text-red-600 transition-colors font-medium"
                        >
                            <FiGrid className="w-4 h-4" />
                            <span>Sản phẩm</span>
                        </Link>
                        {user && (
                            <Link
                                to="/my-orders"
                                className="flex items-center space-x-1 hover:text-red-600 transition-colors font-medium"
                            >
                                <FiShoppingCart className="w-4 h-4" />
                                <span>Đơn hàng của tôi</span>
                            </Link>
                        )}
                    </nav>

                    {/* Search - Desktop */}
                    <form
                        onSubmit={onSearch}
                        className="hidden md:block flex-1 max-w-lg mx-8"
                    >
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        {user && (
                            <Link
                                to="/cart"
                                className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <FiShoppingCart className="w-6 h-6" />
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {count > 9 ? "9+" : count}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User menu */}
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/account"
                                    className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <FiUser className="w-4 h-4" />
                                    <span className="font-medium">
                                        {user.fullName || user.username}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                                >
                                    <FiLogOut className="w-4 h-4" />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-red-600 transition-colors font-medium"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-4 space-y-4">
                            {/* Mobile search */}
                            <form onSubmit={onSearch}>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="search"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </form>

                            {/* Mobile navigation */}
                            <nav className="space-y-3">
                                <Link
                                    to="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors py-2"
                                >
                                    <FiHome className="w-5 h-5" />
                                    <span className="font-medium">
                                        Trang chủ
                                    </span>
                                </Link>
                                <Link
                                    to="/products"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors py-2"
                                >
                                    <FiGrid className="w-5 h-5" />
                                    <span className="font-medium">
                                        Sản phẩm
                                    </span>
                                </Link>
                                {user && (
                                    <Link
                                        to="/profile?tab=orders"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors py-2"
                                    >
                                        <FiShoppingCart className="w-5 h-5" />
                                        <span className="font-medium">
                                            Đơn hàng của tôi
                                        </span>
                                    </Link>
                                )}

                                {user && (
                                    <>
                                        <div className="border-t border-gray-200 pt-3">
                                            <Link
                                                to="/profile"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors py-2"
                                            >
                                                <FiUser className="w-5 h-5" />
                                                <span className="font-medium">
                                                    Tài khoản
                                                </span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors py-2 w-full text-left"
                                            >
                                                <FiLogOut className="w-5 h-5" />
                                                <span className="font-medium">
                                                    Đăng xuất
                                                </span>
                                            </button>
                                        </div>
                                    </>
                                )}

                                {!user && (
                                    <div className="border-t border-gray-200 pt-3 space-y-3">
                                        <Link
                                            to="/login"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="block text-center bg-gray-100 text-gray-700 py-2 rounded-lg font-medium"
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="block text-center bg-red-600 text-white py-2 rounded-lg font-medium"
                                        >
                                            Đăng ký
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
