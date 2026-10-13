import { createContext, useContext, useState, useCallback, useRef } from "react";
import axios from "axios";

const ProductDetailsContext = createContext(null);

const API =
    "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app/api/public/products";

export function ProductDetailsProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestId = useRef(0);

    // preview — kartadagi tayyor ma'lumot (modal bo'sh qolmasligi uchun)
    const openDetails = useCallback(async (productId, preview = null) => {
        const current = ++requestId.current;

        setIsOpen(true);
        setProduct(preview);
        setError(null);
        setLoading(true);

        try {
            const res = await axios.get(`${API}/${productId}`);
            if (current !== requestId.current) return;

            const data = res?.data?.data;
            const full = data?.product ?? data ?? null;

            if (full && typeof full === "object") {
                setProduct((prev) => ({ ...(prev || {}), ...full }));
            }
        } catch (err) {
            if (current !== requestId.current) return;
            console.error("Product details error:", err);
            setError("Ma'lumotni yuklab bo'lmadi");
        } finally {
            if (current === requestId.current) setLoading(false);
        }
    }, []);

    const closeDetails = useCallback(() => {
        requestId.current++;
        setIsOpen(false);
        setProduct(null);
        setError(null);
        setLoading(false);
    }, []);

    return (
        <ProductDetailsContext.Provider
            value={{ isOpen, product, loading, error, openDetails, closeDetails }}
        >
            {children}
        </ProductDetailsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProductDetails() {
    const ctx = useContext(ProductDetailsContext);
    if (!ctx) throw new Error("useProductDetails must be used inside ProductDetailsProvider");
    return ctx;
}
