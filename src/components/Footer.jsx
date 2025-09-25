import React from "react";
import {
    FiPhone,
    FiMail,
    FiMapPin,
    FiFacebook,
    FiInstagram,
    FiYoutube,
    FiTwitter,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Main footer content */}
                <div className="px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-3xl">🎱</div>
                                <div>
                                    <h3 className="font-bold text-lg">
                                        BK Billiards
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Chuyên cơ bida cao cấp
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Chúng tôi chuyên cung cấp các sản phẩm cơ bida
                                chất lượng cao từ các thương hiệu uy tín trên
                                thế giới. Mang đến trải nghiệm chơi bida tuyệt
                                vời nhất cho bạn.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FiFacebook className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FiInstagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FiYoutube className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FiTwitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">
                                Liên kết nhanh
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        to="/"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/products"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Sản phẩm
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/contact"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Customer Support */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">
                                Hỗ trợ khách hàng
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Chính sách đổi trả
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Chính sách bảo hành
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Hướng dẫn mua hàng
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Câu hỏi thường gặp
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">
                                Thông tin liên hệ
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start space-x-3">
                                    <FiMapPin className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-400">
                                        123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiPhone className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <a
                                        href="tel:+84123456789"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        +84 123 456 789
                                    </a>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiMail className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <a
                                        href="mailto:info@bkbilliards.com"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        info@bkbilliards.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © 2024 BK Billiards. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Điều khoản sử dụng
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Chính sách bảo mật
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
