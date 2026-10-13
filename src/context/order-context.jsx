import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

const API_URL =
    "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app/api/public/orders";

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // GET orders
    const getOrders = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setOrders([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Orderlarni olishda xatolik"
                );
            }

            setOrders(data?.data || []);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // POST order
    const createOrder = async (orderData) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            throw new Error("Buyurtma berish uchun avval login qiling");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("accessToken");
                    throw new Error(
                        "Sessiya tugadi. Qaytadan login qiling"
                    );
                }

                const detail =
                    data?.message ||
                    (typeof data?.error === "string" ? data.error : data?.error?.message) ||
                    (Array.isArray(data?.errors) ? data.errors.map((e) => e?.message || e).join(", ") : "");

                throw new Error(
                    detail || `Order yaratishda xatolik (${response.status})`
                );
            }

            await getOrders();

            return data;
        } catch (error) {
            console.error("Create order error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                loading,
                error,
                getOrders,
                createOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export function useOrderContext() {
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error(
            "useOrderContext OrderProvider ichida ishlatilishi kerak"
        );
    }

    return context;
}

