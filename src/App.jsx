import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import { LoadingSpinner } from "./components/Loading";

// Customer Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyOrders from "./pages/MyOrders";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./auth/RequireAuth";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSuppliers from "./pages/admin/AdminSuppliers";
import AdminOrders from "./pages/admin/AdminOrders";

import RequireRole from "./components/RequireRole";
import AdminRedirect from "./components/AdminRedirect";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                            <Suspense
                                fallback={
                                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                        <div className="text-center">
                                            <LoadingSpinner size="lg" />
                                            <p className="text-gray-600 mt-4">
                                                Đang tải trang...
                                            </p>
                                        </div>
                                    </div>
                                }
                            >
                                <Routes>
                                    {/* Public */}
                                    <Route
                                        path="/"
                                        element={
                                            <AdminRedirect>
                                                <Home />
                                            </AdminRedirect>
                                        }
                                    />
                                    <Route
                                        path="/products"
                                        element={
                                            <AdminRedirect>
                                                <Products />
                                            </AdminRedirect>
                                        }
                                    />
                                    <Route
                                        path="/products/:id"
                                        element={
                                            <AdminRedirect>
                                                <ProductDetail />
                                            </AdminRedirect>
                                        }
                                    />
                                    <Route
                                        path="/cart"
                                        element={
                                            <AdminRedirect>
                                                <Cart />
                                            </AdminRedirect>
                                        }
                                    />
                                    <Route
                                        path="/checkout"
                                        element={
                                            <AdminRedirect>
                                                <Checkout />
                                            </AdminRedirect>
                                        }
                                    />
                                    <Route
                                        path="/wishlist"
                                        element={
                                            <AdminRedirect>
                                                <Wishlist />
                                            </AdminRedirect>
                                        }
                                    />
                                    <Route
                                        path="/my-orders"
                                        element={
                                            <RequireAuth>
                                                <AdminRedirect>
                                                    <MyOrders />
                                                </AdminRedirect>
                                            </RequireAuth>
                                        }
                                    />
                                    <Route
                                        path="/account"
                                        element={
                                            <RequireAuth>
                                                <AdminRedirect>
                                                    <Account />
                                                </AdminRedirect>
                                            </RequireAuth>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <RequireAuth>
                                                <AdminRedirect>
                                                    <Profile />
                                                </AdminRedirect>
                                            </RequireAuth>
                                        }
                                    />
                                    <Route
                                        path="/about"
                                        element={
                                            <AdminRedirect>
                                                <About />
                                            </AdminRedirect>
                                        }
                                    />
                                    <Route
                                        path="/contact"
                                        element={
                                            <AdminRedirect>
                                                <Contact />
                                            </AdminRedirect>
                                        }
                                    />
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/register"
                                        element={<Register />}
                                    />

                                    {/* Order Detail Page */}
                                    <Route
                                        path="/orders/:id"
                                        element={
                                            <RequireAuth>
                                                <AdminRedirect>
                                                    <OrderDetail />
                                                </AdminRedirect>
                                            </RequireAuth>
                                        }
                                    />

                                    {/* 404 Not Found */}
                                    <Route
                                        path="*"
                                        element={
                                            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                                                <div className="text-center">
                                                    <h1 className="text-6xl font-bold text-gray-900 mb-4">
                                                        404
                                                    </h1>
                                                    <p className="text-xl text-gray-600 mb-8">
                                                        Trang bạn tìm kiếm không
                                                        tồn tại
                                                    </p>
                                                    <a
                                                        href="/"
                                                        className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                                    >
                                                        Về trang chủ
                                                    </a>
                                                </div>
                                            </div>
                                        }
                                    />

                                    {/* Admin */}
                                    <Route
                                        path="/admin"
                                        element={
                                            <RequireRole roles={["ADMIN"]} />
                                        }
                                    >
                                        <Route element={<AdminLayout />}>
                                            <Route
                                                index
                                                element={<AdminDashboard />}
                                            />
                                            <Route
                                                path="orders"
                                                element={<AdminOrders />}
                                            />
                                            <Route
                                                path="products"
                                                element={
                                                    <RequireRole
                                                        roles={["ADMIN"]}
                                                    />
                                                }
                                            >
                                                <Route
                                                    index
                                                    element={<AdminProducts />}
                                                />
                                            </Route>
                                            <Route
                                                path="suppliers"
                                                element={
                                                    <RequireRole
                                                        roles={["ADMIN"]}
                                                    />
                                                }
                                            >
                                                <Route
                                                    index
                                                    element={<AdminSuppliers />}
                                                />
                                            </Route>
                                        </Route>
                                    </Route>
                                </Routes>
                            </Suspense>
                        </main>
                        <Footer />
                        <Toaster position="top-right" />
                    </div>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
