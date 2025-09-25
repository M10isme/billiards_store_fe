import React from "react";
import {
    FiAward,
    FiUsers,
    FiShoppingBag,
    FiTruck,
    FiShield,
    FiHeart,
    FiTarget,
    FiTrendingUp,
} from "react-icons/fi";
import Billiards from "../assets/Billiards.png";

export default function About() {
    const stats = [
        {
            icon: FiUsers,
            label: "Khách hàng tin tưởng",
            value: "50,000+",
            color: "text-blue-600",
        },
        {
            icon: FiShoppingBag,
            label: "Sản phẩm chất lượng",
            value: "1,000+",
            color: "text-green-600",
        },
        {
            icon: FiAward,
            label: "Năm kinh nghiệm",
            value: "10+",
            color: "text-purple-600",
        },
        {
            icon: FiTruck,
            label: "Đơn hàng thành công",
            value: "100,000+",
            color: "text-red-600",
        },
    ];

    const values = [
        {
            icon: FiTarget,
            title: "Chất lượng hàng đầu",
            description:
                "Chúng tôi cam kết cung cấp những sản phẩm bida chất lượng cao nhất từ các thương hiệu uy tín trên thế giới.",
        },
        {
            icon: FiHeart,
            title: "Đam mê bida",
            description:
                "Với tình yêu dành cho môn bida, chúng tôi hiểu những gì người chơi thực sự cần và mong muốn.",
        },
        {
            icon: FiShield,
            title: "Tin cậy & Bảo hành",
            description:
                "Mọi sản phẩm đều được bảo hành chính hãng và có chế độ đổi trả linh hoạt cho khách hàng.",
        },
        {
            icon: FiTrendingUp,
            title: "Phát triển bền vững",
            description:
                "Chúng tôi không ngừng cải tiến và phát triển để mang đến trải nghiệm mua sắm tốt nhất.",
        },
    ];

    const team = [
        {
            name: "Nguyễn Văn A",
            role: "CEO & Founder",
            description: "15 năm kinh nghiệm trong ngành bida và thể thao",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        {
            name: "Trần Thị B",
            role: "Head of Product",
            description: "Chuyên gia về các sản phẩm bida chuyên nghiệp",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        {
            name: "Lê Văn C",
            role: "Customer Experience",
            description: "Đảm bảo trải nghiệm khách hàng hoàn hảo",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-gray-900 to-red-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl font-bold mb-6">
                                Về BK Billiards
                            </h1>
                            <p className="text-xl text-gray-200 leading-relaxed mb-8">
                                Chúng tôi là điểm đến tin cậy cho những người
                                đam mê bida, cung cấp sản phẩm chất lượng cao và
                                dịch vụ xuất sắc từ năm 2015.
                            </p>
                            <div className="flex items-center space-x-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">
                                        10+
                                    </div>
                                    <div className="text-gray-300">
                                        Năm kinh nghiệm
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">
                                        50K+
                                    </div>
                                    <div className="text-gray-300">
                                        Khách hàng
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">
                                        1K+
                                    </div>
                                    <div className="text-gray-300">
                                        Sản phẩm
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src={Billiards}
                                alt="BK Billiards"
                                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                                <FiAward className="w-12 h-12 text-gray-900" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4`}
                                >
                                    <stat.icon
                                        className={`w-8 h-8 ${stat.color}`}
                                    />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Câu chuyện của chúng tôi
                            </h2>
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p>
                                    Thành lập từ năm 2015, BK Billiards bắt đầu
                                    từ một cửa hàng nhỏ với tình yêu dành cho
                                    môn bida. Chúng tôi nhận ra rằng thị trường
                                    Việt Nam cần một nơi cung cấp sản phẩm bida
                                    chất lượng cao với dịch vụ chuyên nghiệp.
                                </p>
                                <p>
                                    Sau 10 năm phát triển, chúng tôi đã trở
                                    thành một trong những nhà cung cấp thiết bị
                                    bida hàng đầu tại Việt Nam. Với hơn 50,000
                                    khách hàng tin tưởng và 1,000+ sản phẩm đa
                                    dạng.
                                </p>
                                <p>
                                    Sứ mệnh của chúng tôi là mang đến cho người
                                    chơi bida những sản phẩm tốt nhất, từ người
                                    mới bắt đầu đến những tay cơ chuyên nghiệp.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                                alt="Câu chuyện BK Billiards"
                                className="w-full rounded-2xl shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Giá trị cốt lõi
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Những giá trị này định hướng mọi hoạt động của chúng
                            tôi và tạo nên sự khác biệt trong dịch vụ
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl mb-4">
                                    <value.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Đội ngũ của chúng tôi
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Những con người tài năng và đam mê tạo nên thành
                            công của BK Billiards
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                            >
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-red-600 font-medium mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-red-600 to-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Sẵn sàng bắt đầu hành trình bida?
                    </h2>
                    <p className="text-xl text-gray-200 mb-8">
                        Khám phá bộ sưu tập sản phẩm bida chất lượng cao của
                        chúng tôi ngay hôm nay
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Xem sản phẩm
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                        >
                            Liên hệ với chúng tôi
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
