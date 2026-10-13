import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext = createContext({});

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(
                "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app/api/public/auth/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setUser(res.data?.data || res.data);
        } catch {

            localStorage.removeItem("accessToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                getUser,
                logout,
                isAuth: Boolean(user),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};