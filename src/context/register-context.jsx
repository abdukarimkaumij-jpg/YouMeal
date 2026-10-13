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

    export const useRegisterContext = () =>
        useContext(ContextProvider);

    export const RegisterProvider = ({ children }) => {
        const navigate = useNavigate();
        const { getUser } = useAuthContext();
        const { getCart } = useCartContext();

        const email = useRef();
        const password = useRef();

        const [errorMessage, setErrorMessage] = useState("");

        const postUser = async (e) => {
            e.preventDefault();

            const emailValue = email.current.value;
            const passwordValue = password.current.value;

            if (!emailValue || !passwordValue) {
                return setErrorMessage(
                    "Email va password kiriting"
                );
            }

            try {
                const res = await axios.post(
                    "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app/api/public/auth/register",
                    {
                        email: emailValue,
                        password: passwordValue,
                    },
                    {
                        headers: {
                            "x-api-key":
                                "free_user_3Ebev4zdibgHpbDl1Xp3iFGC70w",
                        },
                    }
                );

                const token =
                    res.data?.data?.accessToken ||
                    res.data?.accessToken ||
                    res.data?.data?.token ||
                    res.data?.token;

                if (!token) {
                    return setErrorMessage(
                        "Ro'yxatdan o'tildi, lekin token kelmadi. Login qiling."
                    );
                }

                // Boshqa joylar "accessToken" kalitini o'qiydi
                localStorage.setItem("accessToken", token);
                await Promise.all([getUser(), getCart()]);

                setErrorMessage("");

                navigate("/");
            } catch (error) {
                setErrorMessage(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Xatolik yuz berdi"
                );
            }
        };

    return (
        <ContextProvider.Provider
            value={{
                postUser,
                email,
                password,
                errorMessage,
            }}
        >
            {children}
        </ContextProvider.Provider>
    );
};