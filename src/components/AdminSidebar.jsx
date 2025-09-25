import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
    FiHome,
    FiShoppingBag,
    FiPackage,
    FiUsers,
    FiBarChart2,
    FiLogOut,
    FiX,
    FiSettings,
    FiTruck,
} from "react-icons/fi";

export default function AdminSidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navigationItems = [
        {
            name: "Tổng quan",
            href: "/admin",
            icon: FiBarChart2,
            current: isActive("/admin"),
        },
        {
            name: "Đơn hàng",
            href: "/admin/orders",
            icon: FiShoppingBag,
            current: isActive("/admin/orders"),
        },
        {
            name: "Sản phẩm",
            href: "/admin/products",
            icon: FiPackage,
            current: isActive("/admin/products"),
            adminOnly: true,
        },
        {
            name: "Nhà cung cấp",
            href: "/admin/suppliers",
            icon: FiTruck,
            current: isActive("/admin/suppliers"),
            adminOnly: true,
        },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-white shadow-sm border-r border-gray-200">
                        {/* Logo and title */}
                        <div className="flex items-center h-16 flex-shrink-0 px-6 bg-red-600">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <FiBarChart2 className="w-5 h-5 text-red-600" />
                                </div>
                                <h1 className="ml-3 text-xl font-bold text-white">
                                    Admin Panel
                                </h1>
                            </div>
                        </div>

                        {/* User info */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 font-semibold text-sm">
                                        {(user?.fullName || user?.username)
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.fullName || user?.username}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Quản trị viên
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-1">
                            {navigationItems.map((item) => {
                                if (item.adminOnly && user?.role !== "ADMIN")
                                    return null;

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            item.current
                                                ? "bg-red-50 text-red-600 border border-red-200"
                                                : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                                        }`}
                                    >
                                        <item.icon
                                            className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                                                item.current
                                                    ? "text-red-600"
                                                    : "text-gray-400 group-hover:text-red-600"
                                            }`}
                                        />
                                        <span className="truncate">
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Bottom actions */}
                        <div className="flex-shrink-0 border-t border-gray-200 p-4">
                            <Link
                                to="/"
                                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <FiHome className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
                                <span className="truncate">Về trang chủ</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors mt-1"
                            >
                                <FiLogOut className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
                                <span className="truncate">Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-6 bg-red-600">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <FiBarChart2 className="w-5 h-5 text-red-600" />
                            </div>
                            <h1 className="ml-3 text-xl font-bold text-white">
                                Admin Panel
                            </h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md text-white hover:bg-red-500"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* User info */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 font-semibold text-sm">
                                    {(user?.fullName || user?.username)
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.fullName || user?.username}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Quản trị viên
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigationItems.map((item) => {
                            if (item.adminOnly && user?.role !== "ADMIN")
                                return null;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={onClose}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        item.current
                                            ? "bg-red-50 text-red-600 border border-red-200"
                                            : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                                    }`}
                                >
                                    <item.icon
                                        className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                                            item.current
                                                ? "text-red-600"
                                                : "text-gray-400 group-hover:text-red-600"
                                        }`}
                                    />
                                    <span className="truncate">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom actions */}
                    <div className="flex-shrink-0 border-t border-gray-200 p-4">
                        <Link
                            to="/"
                            onClick={onClose}
                            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <FiHome className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
                            <span className="truncate">Về trang chủ</span>
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                            className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors mt-1"
                        >
                            <FiLogOut className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
                            <span className="truncate">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
