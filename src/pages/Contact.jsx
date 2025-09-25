import React, { useState } from "react";
import {
    FiPhone,
    FiMail,
    FiMapPin,
    FiClock,
    FiSend,
    FiCheck,
    FiMessageCircle,
    FiHeadphones,
} from "react-icons/fi";
import { LoadingSpinner } from "../components/Loading";
import toast from "react-hot-toast";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const contactInfo = [
        {
            icon: FiPhone,
            title: "Hotline hỗ trợ",
            info: "+84 909 999 999",
            description: "Hỗ trợ 24/7, tất cả các ngày trong tuần",
            color: "text-green-600 bg-green-50",
        },
        {
            icon: FiMail,
            title: "Email liên hệ",
            info: "contact@bkbilliards.com",
            description: "Gửi email, chúng tôi sẽ phản hồi trong 24h",
            color: "text-blue-600 bg-blue-50",
        },
        {
            icon: FiMapPin,
            title: "Địa chỉ cửa hàng",
            info: "123 Đường ABC, Quận 1, TP.HCM",
            description: "Đến trực tiếp showroom của chúng tôi",
            color: "text-red-600 bg-red-50",
        },
        {
            icon: FiClock,
            title: "Giờ làm việc",
            info: "8:00 - 22:00 (T2 - CN)",
            description: "Phục vụ khách hàng mọi ngày trong tuần",
            color: "text-purple-600 bg-purple-50",
        },
    ];

    const faqItems = [
        {
            question: "Làm thế nào để đặt hàng?",
            answer: "Bạn có thể đặt hàng trực tuyến qua website hoặc gọi hotline để được hỗ trợ.",
        },
        {
            question: "Chính sách bảo hành như thế nào?",
            answer: "Tất cả sản phẩm đều có bảo hành chính hãng từ 6-24 tháng tùy theo từng loại.",
        },
        {
            question: "Có giao hàng toàn quốc không?",
            answer: "Có, chúng tôi giao hàng toàn quốc với phí ship hợp lý và thời gian nhanh chóng.",
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: "" });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!form.name.trim()) {
            errors.name = "Vui lòng nhập họ và tên";
        }

        if (!form.email.trim()) {
            errors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = "Email không hợp lệ";
        }

        if (!form.phone.trim()) {
            errors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ""))) {
            errors.phone = "Số điện thoại không hợp lệ";
        }

        if (!form.subject.trim()) {
            errors.subject = "Vui lòng nhập chủ đề";
        }

        if (!form.message.trim()) {
            errors.message = "Vui lòng nhập nội dung tin nhắn";
        } else if (form.message.trim().length < 10) {
            errors.message = "Tin nhắn phải có ít nhất 10 ký tự";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/contact`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi gửi tin nhắn");
            }

            const message = await response.text();
            toast.success(message);
            setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-900 to-red-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với
                        chúng tôi qua bất kỳ hình thức nào bạn cảm thấy thuận
                        tiện nhất.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactInfo.map((info, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
                        >
                            <div
                                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${info.color}`}
                            >
                                <info.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {info.title}
                            </h3>
                            <p className="text-lg font-medium text-gray-900 mb-2">
                                {info.info}
                            </p>
                            <p className="text-sm text-gray-600">
                                {info.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                    <FiMessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Gửi tin nhắn
                                    </h2>
                                    <p className="text-gray-600">
                                        Chúng tôi sẽ phản hồi trong vòng 24 giờ
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.name
                                                    ? "border-red-300 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-red-500"
                                            }`}
                                            placeholder="Nhập họ và tên"
                                        />
                                        {fieldErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {fieldErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.email
                                                    ? "border-red-300 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-red-500"
                                            }`}
                                            placeholder="Nhập email"
                                        />
                                        {fieldErrors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {fieldErrors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.phone
                                                    ? "border-red-300 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-red-500"
                                            }`}
                                            placeholder="Nhập số điện thoại"
                                        />
                                        {fieldErrors.phone && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {fieldErrors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chủ đề *
                                        </label>
                                        <select
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.subject
                                                    ? "border-red-300 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-red-500"
                                            }`}
                                        >
                                            <option value="">
                                                Chọn chủ đề
                                            </option>
                                            <option value="product-inquiry">
                                                Tư vấn sản phẩm
                                            </option>
                                            <option value="order-support">
                                                Hỗ trợ đơn hàng
                                            </option>
                                            <option value="warranty">
                                                Bảo hành
                                            </option>
                                            <option value="complaint">
                                                Khiếu nại
                                            </option>
                                            <option value="other">Khác</option>
                                        </select>
                                        {fieldErrors.subject && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {fieldErrors.subject}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung tin nhắn *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows="6"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors resize-none ${
                                            fieldErrors.message
                                                ? "border-red-300 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-red-500"
                                        }`}
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                    />
                                    {fieldErrors.message && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {fieldErrors.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner
                                                size="sm"
                                                color="gray"
                                            />
                                            <span>Đang gửi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSend className="w-5 h-5" />
                                            <span>Gửi tin nhắn</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-8">
                        {/* Quick Support */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                    <FiHeadphones className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Hỗ trợ nhanh
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Cần hỗ trợ ngay lập tức? Gọi hotline của chúng
                                tôi
                            </p>
                            <a
                                href="tel:+84909999999"
                                className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors"
                            >
                                <FiPhone className="w-4 h-4" />
                                <span>Gọi ngay</span>
                            </a>
                        </div>

                        {/* FAQ */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Câu hỏi thường gặp
                            </h3>
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                                    >
                                        <h4 className="font-medium text-gray-900 mb-2">
                                            {item.question}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {item.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Vị trí cửa hàng
                            </h3>
                            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <FiMapPin className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-sm">
                                        Bản đồ Google Maps
                                    </p>
                                    <p className="text-xs">
                                        123 Đường ABC, Quận 1, TP.HCM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
