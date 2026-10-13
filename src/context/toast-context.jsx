import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import "../components/toast/toast.css";

const ToastContext = createContext({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS = {
    success: "✓",
    error: "✕",
    warning: "!",
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});
    const nextId = useRef(0);

    const removeToast = useCallback((id) => {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message, type = "success", duration = 3000) => {
            const id = ++nextId.current;

            setToasts((prev) => [...prev, { id, message, type }]);
            timers.current[id] = setTimeout(() => removeToast(id), duration);
        },
        [removeToast]
    );

    useEffect(() => {
        const activeTimers = timers.current;
        return () => Object.values(activeTimers).forEach(clearTimeout);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="toast-container" aria-live="polite">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`toast toast--${t.type}`}
                        role="status"
                        onClick={() => removeToast(t.id)}
                    >
                        <span className="toast__icon">{ICONS[t.type]}</span>
                        <p className="toast__text">{t.message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
