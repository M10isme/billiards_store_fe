import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const raw = localStorage.getItem("cart");
        return raw ? JSON.parse(raw) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (item) => {
        setItems((prev) => {
            const exist = prev.find((p) => p.productId === item.productId);
            if (exist) {
                return prev.map((p) =>
                    p.productId === item.productId
                        ? { ...p, quantity: p.quantity + item.quantity }
                        : p
                );
            }
            return [...prev, item];
        });
        toast.success("Đã thêm vào giỏ");
    };

    const removeFromCart = (productId) => {
        setItems((prev) => prev.filter((p) => p.productId !== productId));
        toast("Đã xóa sản phẩm");
    };

    const updateQuantity = (productId, quantity) => {
        setItems((prev) =>
            prev.map((p) =>
                p.productId === productId ? { ...p, quantity } : p
            )
        );
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalAmount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
