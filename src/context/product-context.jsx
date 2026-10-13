import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const ContextProvider = createContext({});

export const useProductsContext = () =>
    useContext(ContextProvider);

const API =
    "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app/api/public/products";

export const ProductsContext = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const firstRes = await axios.get(API, {
                params: { page: 1 },
            });


            const firstData = firstRes?.data?.data;
            let allProducts = Array.isArray(firstData?.products)
                ? firstData.products
                : [];

            const totalPages = firstData?.pagination?.pages || 1;

            if (totalPages > 1) {
                const pageNumbers = Array.from(
                    { length: totalPages - 1 },
                    (_, i) => i + 2 
                );

                const restResponses = await Promise.all(
                    pageNumbers.map((page) =>
                        axios.get(API, { params: { page } })
                    )
                );

                restResponses.forEach((res) => {
                    const pageProducts = res?.data?.data?.products;
                    if (Array.isArray(pageProducts)) {
                        allProducts = allProducts.concat(pageProducts);
                    }
                });
            }
            const uniqueProducts = Array.from(
                new Map(
                    allProducts.map((item) => [item.id, item])
                ).values()
            );

            setProducts(uniqueProducts);
        } catch (err) {
            console.log("Product error:", err);

            setError("Products yuklanmadi ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <ContextProvider.Provider
            value={{
                products,
                loading,
                error,
                getProducts,
            }}
        >
            {children}
        </ContextProvider.Provider>
    );
};
