import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex h-screen">
                {/* Sidebar */}
                <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top bar for mobile */}
                    <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <span className="ml-3 text-lg font-semibold text-gray-900">
                            Admin Dashboard
                        </span>
                    </div>

                    {/* Page content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
