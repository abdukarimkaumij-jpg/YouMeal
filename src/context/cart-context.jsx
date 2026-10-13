
import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./toast-context";
import { useAuthContext } from "./authMe-context";

const CartContext = createContext({});

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { logout } = useAuthContext();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API =
        "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app/api/public/cart";

    // =========================
    // GET CART
    // =========================
    const getCart = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setCart([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await axios.get(API, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const items = res.data?.data?.items || [];

            setCart(items);

        } catch (error) {
            console.error(
                "GET CART FAILED:",
                error.response?.status,
                error.response?.data
            );

            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // ADD TO CART
    // =========================
    const addToCart = async (productId, quantity = 1) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            showToast(
                "Savatga qo'shish uchun avval ro'yxatdan o'ting",
                "warning"
            );

            navigate("/register");
            return;
        }

        if (!productId) {
            console.log("Product ID yo'q:", productId);
            return;
        }

        const body = {
            product_id: productId,
            quantity: Number(quantity),
        };

        try {
            const res = await axios.post(API, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            /*
             * Agar POST response ichida items kelsa,
             * GET qilish shart emas.
             */
            const serverItems = res.data?.data?.items;

            if (Array.isArray(serverItems)) {
                setCart(serverItems);
            } else {
                /*
                 * Server yangi cartni qaytarmasa,
                 * ekranni darhol yangilaymiz.
                 */
                setCart((prevCart) => {
                    const existingItem = prevCart.find(
                        (item) =>
                            item?.product?.id === productId ||
                            item?.product_id === productId
                    );

                    if (existingItem) {
                        return prevCart.map((item) => {
                            const id =
                                item?.product?.id || item?.product_id;

                            if (id === productId) {
                                return {
                                    ...item,
                                    quantity:
                                        Number(item.quantity || 0) +
                                        Number(quantity),
                                };
                            }

                            return item;
                        });
                    }

                    return prevCart;
                });
            }

            showToast("Mahsulot savatga qo'shildi", "success");
        } catch (error) {
            console.error(
                "ADD TO CART FAILED:",
                error.response?.status,
                error.response?.data
            );

            setError(error);

            if (error.response?.status === 401) {
                logout();
                setCart([]);

                showToast(
                    "Sessiya tugadi. Iltimos, qaytadan ro'yxatdan o'ting",
                    "warning"
                );

                navigate("/register");
                return;
            }

            showToast(
                error.response?.data?.message ||
                    "Savatga qo'shishda xatolik yuz berdi",
                "error"
            );
        }
    };

    // =========================
    // REMOVE
    // =========================
    const removeFromCart = async (productId) => {
        const token = localStorage.getItem("accessToken");

        if (!token || !productId) return;

        try {
            await axios.delete(`${API}/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // GET kutmaymiz — lokal cartni darhol o'zgartiramiz
            setCart((prevCart) =>
                prevCart.filter((item) => {
                    const id = item?.product?.id || item?.product_id;
                    return id !== productId;
                })
            );
        } catch (error) {
            console.error(
                "REMOVE CART FAILED:",
                error.response?.status,
                error.response?.data
            );

            setError(error);
        }
    };

    // =========================
    // INCREASE
    // =========================
    const increaseQuantity = async (productId, quantity) => {
        const token = localStorage.getItem("accessToken");

        if (!token || !productId) return;

        const newQuantity = Number(quantity) + 1;

        // UI darhol o'zgaradi
        setCart((prevCart) =>
            prevCart.map((item) => {
                const id = item?.product?.id || item?.product_id;

                if (id === productId) {
                    return {
                        ...item,
                        quantity: newQuantity,
                    };
                }

                return item;
            })
        );

        try {
            await axios.put(
                `${API}/${productId}`,
                {
                    quantity: newQuantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.error("INCREASE FAILED:", error);

            setError(error);

            // Xato bo'lsa serverdan qayta olamiz
            await getCart();
        }
    };

    // =========================
    // DECREASE
    // =========================
    const decreaseQuantity = async (productId, quantity) => {
        const token = localStorage.getItem("accessToken");

        if (!token || !productId) return;

        if (quantity <= 1) return;

        const newQuantity = Number(quantity) - 1;

        // UI darhol o'zgaradi
        setCart((prevCart) =>
            prevCart.map((item) => {
                const id = item?.product?.id || item?.product_id;

                if (id === productId) {
                    return {
                        ...item,
                        quantity: newQuantity,
                    };
                }

                return item;
            })
        );

        try {
            await axios.put(
                `${API}/${productId}`,
                {
                    quantity: newQuantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.error("DECREASE FAILED:", error);

            setError(error);

            await getCart();
        }
    };

    // =========================
    // INITIAL CART
    // =========================
    useEffect(() => {
        getCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                getCart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
