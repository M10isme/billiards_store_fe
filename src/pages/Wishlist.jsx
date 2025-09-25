import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Wishlist() {
    const [products, setProducts] = useState([]);
    const ids = JSON.parse(localStorage.getItem("wishlist") || "[]");

    useEffect(() => {
        if (ids.length === 0) {
            setProducts([]);
            return;
        }
        api.get("/products").then((res) => {
            setProducts(res.data.filter((p) => ids.includes(p.id)));
        });
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Yêu thích</h2>
            {products.length === 0 ? (
                <p>Chưa có sản phẩm yêu thích.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <Link
                            key={p.id}
                            to={`/products/${p.id}`}
                            className="border rounded p-4 hover:shadow-lg"
                        >
                            <div className="h-32 bg-gray-200 rounded mb-3" />
                            <h3 className="font-semibold">{p.name}</h3>
                            <p className="text-blue-600 font-bold">
                                {(p.price || 0).toLocaleString()} đ
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
