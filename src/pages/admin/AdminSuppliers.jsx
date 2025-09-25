import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import toast from "react-hot-toast";

export default function AdminSuppliers() {
    const { token } = useAuth();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        id: null,
        name: "",
        contactInfo: "",
    });
    const [showForm, setShowForm] = useState(false);

    const load = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/suppliers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                const data = await res.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            setSuppliers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const save = async () => {
        try {
            const url = form.id
                ? `http://localhost:8080/api/suppliers/${form.id}`
                : "http://localhost:8080/api/suppliers";

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
                toast.success(form.id ? "Đã cập nhật NCC" : "Đã thêm NCC");
                setShowForm(false);
                setForm({ id: null, name: "", contactInfo: "" });
                load();
            } else {
                toast.error("Lỗi khi lưu NCC");
            }
        } catch (error) {
            console.error("Error saving supplier:", error);
            toast.error("Lỗi khi lưu NCC");
        }
    };

    const del = async (id) => {
        if (!window.confirm("Xóa nhà cung cấp này?")) return;
        try {
            const res = await fetch(
                `http://localhost:8080/api/suppliers/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.ok) {
                toast.success("Đã xóa NCC");
                load();
            } else {
                toast.error("Không thể xóa NCC");
            }
        } catch (error) {
            console.error("Error deleting supplier:", error);
            toast.error("Không thể xóa NCC");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý nhà cung cấp</h2>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowForm(true)}
                >
                    ➕ Thêm NCC
                </button>
            </div>

            {showForm && (
                <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">
                        {form.id
                            ? "Chỉnh sửa nhà cung cấp"
                            : "Thêm nhà cung cấp mới"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            className="border rounded-lg px-3 py-2"
                            placeholder="Tên nhà cung cấp"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                        <input
                            className="border rounded-lg px-3 py-2"
                            placeholder="Thông tin liên hệ"
                            value={form.contactInfo}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    contactInfo: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex space-x-3 mt-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            onClick={save}
                        >
                            {form.id ? "Cập nhật" : "Thêm mới"}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                            onClick={() => {
                                setShowForm(false);
                                setForm({
                                    id: null,
                                    name: "",
                                    contactInfo: "",
                                });
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Tên nhà cung cấp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Thông tin liên hệ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suppliers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    Không có nhà cung cấp nào
                                </td>
                            </tr>
                        ) : (
                            suppliers.map((supplier) => (
                                <tr
                                    key={supplier.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        #{supplier.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {supplier.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {supplier.contactInfo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={() => {
                                                    setForm(supplier);
                                                    setShowForm(true);
                                                }}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => del(supplier.id)}
                                            >
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
    );
}
