import axios from "axios";
import {
    createContext,
    useContext,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./authMe-context";
import { useCartContext } from "./cart-context";

const ContextProvider = createContext({});

export const useLoginContext = () => {
    return useContext(ContextProvider);
};

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate();
    const { getUser } = useAuthContext();
    const { getCart } = useCartContext();

    const email = useRef();
    const password = useRef();

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const postLogin = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setLoading(true);

        const user = {
            email: email.current.value,
            password: password.current.value,
        };

        try {
            const res = await axios.post(
                "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app/api/public/auth/login",
                user
            );


            const token = res.data?.data?.accessToken;

            if (token) {
                localStorage.setItem("accessToken", token);
                await Promise.all([getUser(), getCart()]);

                navigate("/");
                return true;
            }

            setErrorMessage("Token topilmadi");
            return false;

        } catch (error) {

            setErrorMessage(
                error.response?.data?.message ||
                "Email yoki parol noto‘g‘ri"
            );

            return false;

        } finally {
            setLoading(false);
        }
    };

    return (
        <ContextProvider.Provider
            value={{
                email,
                password,
                postLogin,
                errorMessage,
                loading,
            }}
        >
            {children}
        </ContextProvider.Provider>
    );
};