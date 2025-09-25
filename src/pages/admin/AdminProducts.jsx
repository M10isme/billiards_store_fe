import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import toast from "react-hot-toast";
import CueImg from "../../assets/Cue.png";
import {
    FiPlus,
    FiEdit3,
    FiTrash2,
    FiSearch,
    FiFilter,
    FiEye,
    FiPackage,
    FiDollarSign,
    FiBox,
    FiImage,
} from "react-icons/fi";
import { LoadingSpinner } from "../../components/Loading";

export default function AdminProducts() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [form, setForm] = useState({
        id: null,
        name: "",
        description: "",
        price: 0,
        quantityInStock: 0,
        supplierId: "",
        categoryId: "",
        imageUrl: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const load = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/products`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const loadSuppliers = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/suppliers`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            toast.error("Lỗi khi tải danh sách nhà cung cấp");
        }
    };

    const save = async () => {
        try {
            const url = form.id
                ? `${import.meta.env.VITE_API_URL}/products/${form.id}`
                : `${import.meta.env.VITE_API_URL}/products`;

            const method = form.id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                toast.success(
                    form.id
                        ? "Cập nhật sản phẩm thành công!"
                        : "Thêm sản phẩm thành công!"
                );
                setShowForm(false);
                setForm({
                    id: null,
                    name: "",
                    description: "",
                    price: 0,
                    quantityInStock: 0,
                    supplierId: "",
                    categoryId: "",
                    imageUrl: "",
                });
                load();
            } else {
                toast.error("Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Có lỗi xảy ra");
        }
    };

    const del = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/products/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.ok) {
                    toast.success("Xóa sản phẩm thành công!");
                    load();
                } else {
                    toast.error("Có lỗi xảy ra");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Có lỗi xảy ra");
            }
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" ||
            product.categoryId === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        load();
        loadSuppliers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header with Actions */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Quản lý sản phẩm
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Quản lý danh sách sản phẩm trong cửa hàng
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            <FiPlus className="h-4 w-4 mr-2" />
                            Thêm sản phẩm
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {form.id
                                        ? "Chỉnh sửa sản phẩm"
                                        : "Thêm sản phẩm mới"}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setForm({
                                            id: null,
                                            name: "",
                                            description: "",
                                            price: 0,
                                            quantityInStock: 0,
                                            supplierId: "",
                                            categoryId: "",
                                            imageUrl: "",
                                        });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="sr-only">Đóng</span>
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên sản phẩm *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="Nhập tên sản phẩm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giá *
                                    </label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                price:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số lượng tồn kho *
                                    </label>
                                    <input
                                        type="number"
                                        value={form.quantityInStock}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                quantityInStock:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL hình ảnh
                                    </label>
                                    <input
                                        type="url"
                                        value={form.imageUrl}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                imageUrl: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="Nhập mô tả sản phẩm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nhà cung cấp
                                    </label>
                                    <select
                                        value={form.supplierId}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                supplierId: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="">
                                            -- Chọn nhà cung cấp --
                                        </option>
                                        {suppliers.map((supplier) => (
                                            <option
                                                key={supplier.id}
                                                value={supplier.id}
                                            >
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setForm({
                                            id: null,
                                            name: "",
                                            description: "",
                                            price: 0,
                                            quantityInStock: 0,
                                            supplierId: "",
                                            categoryId: "",
                                            imageUrl: "",
                                        });
                                    }}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={save}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    {form.id ? "Cập nhật" : "Thêm mới"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiPackage className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Tổng sản phẩm
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {products.length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Giá trị tồn kho
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {products
                                            .reduce(
                                                (total, product) =>
                                                    total +
                                                    product.price *
                                                        product.quantityInStock,
                                                0
                                            )
                                            .toLocaleString("vi-VN")}
                                        ₫
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiBox className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Sắp hết hàng
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {
                                            products.filter(
                                                (p) => p.quantityInStock <= 5
                                            ).length
                                        }
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FiImage className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Đã có hình ảnh
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {products.length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sản phẩm
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tồn kho
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{product.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        src={CueImg}
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {product.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.price?.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.quantityInStock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    product.quantityInStock > 10
                                                        ? "bg-green-100 text-green-800"
                                                        : product.quantityInStock >
                                                          0
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {product.quantityInStock > 10
                                                    ? "Còn hàng"
                                                    : product.quantityInStock >
                                                      0
                                                    ? "Sắp hết"
                                                    : "Hết hàng"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setForm({
                                                            id: product.id,
                                                            name:
                                                                product.name ||
                                                                "",
                                                            description:
                                                                product.description ||
                                                                "",
                                                            price:
                                                                product.price ||
                                                                0,
                                                            quantityInStock:
                                                                product.quantityInStock ||
                                                                0,
                                                            supplierId:
                                                                product.supplierId ||
                                                                "",
                                                            categoryId:
                                                                product.categoryId ||
                                                                "",
                                                            imageUrl:
                                                                product.imageUrl ||
                                                                "",
                                                        });
                                                        setShowForm(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900 flex items-center"
                                                >
                                                    <FiEdit3 className="h-4 w-4 mr-1" />
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        del(product.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900 flex items-center"
                                                >
                                                    <FiTrash2 className="h-4 w-4 mr-1" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
