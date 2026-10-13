import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const ContextProvider = createContext({});

export const useCategoryContext = () =>
    useContext(ContextProvider);
const extractCategories = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.categories)) return payload.categories;
    if (Array.isArray(payload?.data?.categories)) return payload.data.categories;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    return [];
};

export const CategoryContext = ({ children }) => {
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCategory = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app/api/public/categories"
            );

            setCategory(extractCategories(response.data));
        } catch (error) {
            console.log("Category error:", error);
            setError("Kategoriyalar yuklanmadi ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);
    const selectCategory = (id) => {
        setSelectedCategory((prev) => (prev === id ? null : id));
    };

    return (
        <ContextProvider.Provider
            value={{
                category,
                selectedCategory,
                setSelectedCategory,
                selectCategory,
                loading,
                error,
            }}
        >
            {children}
        </ContextProvider.Provider>
    );
};
