import "./auth-me.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../context/authMe-context";
import { useCartContext } from "../../context/cart-context";
import { useToast } from "../../context/toast-context";

const BASE_URL =
    "https://project--6a9c3c54-4341-46a0-b06e-2e941f3ecc83-dev.lovable.app";

const API_URL = `${BASE_URL}/api/public/auth/me`;

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : "-";

function AuthMe() {
    const navigate = useNavigate();
    const { logout } = useAuthContext();
    const { getCart } = useCartContext();
    const { showToast } = useToast();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [unauthorized, setUnauthorized] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setError("Avval tizimga kiring");
            setUnauthorized(true);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        axios
            .get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
            })
            .then((res) => {
                const userData = res.data?.data;

                if (!userData) {
                    setError("Ma'lumot topilmadi");
                    return;
                }

                setData(userData);

                const metadata = userData.metadata || {};

                setForm({
                    name: metadata.name || "",
                    phone: metadata.phone || "",
                    email: userData.email || "",
                    password: "",
                });

                setPreview(
                    userData.avatar ||
                    userData.image ||
                    userData.photo ||
                    metadata.avatar ||
                    ""
                );
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;

                if (err.response?.status === 401) {
                    logout();
                    setUnauthorized(true);
                    setError("Sessiya tugagan. Qayta tizimga kiring");
                } else {
                    setError("Ma'lumot olishda xatolik");
                }

                console.error(
                    "Profil xatosi:",
                    err.response?.data || err.message
                );
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Faqat rasm faylini tanlang", "error");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast("Rasm hajmi 5 MB dan oshmasin", "error");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("accessToken");

        if (!token) {
            setUnauthorized(true);
            setError("Avval tizimga kiring");
            return;
        }

        try {
            setSaving(true);

            const payload = new FormData();

            payload.append("name", form.name.trim());
            payload.append("phone", form.phone.trim());
            payload.append("email", form.email.trim());

            // Parol faqat foydalanuvchi yangi parol kiritsa yuboriladi.
            if (form.password.trim()) {
                payload.append("password", form.password);
            }

            // Backend kutadigan field nomi "image" bo'lishi kerak.
            if (image) {
                payload.append("image", image);
            }

            const res = await axios.patch(API_URL, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedUser = res.data?.data;

            if (updatedUser) {
                setData((prev) => ({
                    ...prev,
                    ...updatedUser,
                    metadata: {
                        ...prev?.metadata,
                        ...updatedUser.metadata,
                    },
                }));
            } else {
                setData((prev) => ({
                    ...prev,
                    email: form.email,
                    metadata: {
                        ...prev?.metadata,
                        name: form.name,
                        phone: form.phone,
                    },
                }));
            }

            setForm((prev) => ({
                ...prev,
                password: "",
            }));

            setImage(null);
            setEditing(false);
            showToast("Profil muvaffaqiyatli yangilandi", "success");
        } catch (err) {
            console.error(
                "Profilni yangilash xatosi:",
                err.response?.data || err.message
            );

            if (err.response?.status === 401) {
                setError("Sessiya tugagan. Qayta tizimga kiring");
                setUnauthorized(true);
                return;
            }

            showToast(
                err.response?.data?.message ||
                    "Profilni yangilashda xatolik",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        getCart();
        showToast("Tizimdan chiqdingiz", "success");
        navigate("/");
    };

    if (loading) {
        return <div className="user__state">Yuklanmoqda...</div>;
    }

    if (error || !data) {
        return (
            <div className="user__state">
                <p>{error || "Ma'lumot topilmadi"}</p>

                {unauthorized && (
                    <Link to="/login" className="user__state-link">
                        Kirish
                    </Link>
                )}
            </div>
        );
    }

    const orders = Array.isArray(data.orders) ? data.orders : [];
    const metadata = data.metadata || {};
    const ordersCount = data.ordersCount ?? orders.length;

    return (
        <>
            <aside className="profile">
                <div className="profile__card">
                    <div className="profile__header">
                        <h5 className="profile__title">Мой профиль</h5>
                    </div>

                    {editing ? (
                        <form
                            className="profile__form"
                            onSubmit={handleSave}
                        >
                            <div className="profile__avatar">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Profil rasmi"
                                        className="profile__avatar-img"
                                    />
                                ) : (
                                    <div className="profile__avatar-placeholder">
                                        Rasm yo'q
                                    </div>
                                )}

                                <label className="profile__label">
                                    Profil rasmi
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            <label className="profile__field">
                                Ism
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="profile__field">
                                Telefon
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </label>

                            <label className="profile__field">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="profile__field">
                                Yangi parol
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    autoComplete="new-password"
                                    placeholder="O'zgartirmasangiz bo'sh qoldiring"
                                />
                            </label>

                            <button
                                type="submit"
                                className="profile__btn"
                                disabled={saving}
                            >
                                {saving ? "Saqlanmoqda..." : "Saqlash"}
                            </button>

                            <button
                                type="button"
                                className="profile__btn"
                                onClick={() => {
                                    setEditing(false);
                                    setImage(null);
                                    setForm({
                                        name: metadata.name || "",
                                        phone: metadata.phone || "",
                                        email: data.email || "",
                                        password: "",
                                    });
                                    setPreview(
                                        data.avatar ||
                                        data.image ||
                                        data.photo ||
                                        metadata.avatar ||
                                        ""
                                    );
                                }}
                                disabled={saving}
                            >
                                Bekor qilish
                            </button>
                        </form>
                    ) : (
                        <>
                            <div className="profile__avatar">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Profil rasmi"
                                        className="profile__avatar-img"
                                    />
                                ) : (
                                    <div className="profile__avatar-placeholder">
                                        Rasm yo'q
                                    </div>
                                )}
                            </div>

                            <div className="profile__row">
                                <span className="profile__label">Email</span>
                                <span className="profile__value">
                                    {data.email || "-"}
                                </span>
                            </div>

                            <div className="profile__row">
                                <span className="profile__label">Ism</span>
                                <span className="profile__value">
                                    {metadata.name || "-"}
                                </span>
                            </div>

                            <div className="profile__row">
                                <span className="profile__label">Telefon</span>
                                <span className="profile__value">
                                    {metadata.phone || "-"}
                                </span>
                            </div>

                            <div className="profile__row">
                                <span className="profile__label">
                                    Ro'yxatdan o'tgan
                                </span>
                                <span className="profile__value">
                                    {formatDate(data.createdAt)}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="profile__btn"
                                onClick={() => setEditing(true)}
                            >
                                Profilni tahrirlash
                            </button>

                            <button
                                type="button"
                                className="profile__btn"
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                        </>
                    )}
                </div>
            </aside>

            <div className="profile__orders">
                <h2 className="profile__orders-title">
                    Buyurtmalar tarixi ({ordersCount})
                </h2>

                {orders.length === 0 ? (
                    <p className="profile__empty">
                        Hozircha buyurtmalar yo'q
                    </p>
                ) : (
                    <div className="profile__orders-list">
                        {orders.map((order, index) => (
                            <div
                                key={order.orderId ?? index}
                                className="profile__order"
                            >
                                <div className="profile__order-head">
                                    <span className="profile__order-id">
                                        {order.orderId ?? "-"}
                                    </span>

                                    <span className="profile__order-date">
                                        {formatDate(order.createdAt)}
                                    </span>

                                    <span className="profile__order-status">
                                        {order.status ?? "-"}
                                    </span>
                                </div>

                                <div className="profile__order-items">
                                    {(Array.isArray(order.items)
                                        ? order.items
                                        : []
                                    ).map((item, i) => (
                                        <div
                                            key={item.id ?? i}
                                            className="profile__order-item"
                                        >
                                            <span>
                                                {item.name ??
                                                    item.productId ??
                                                    "Mahsulot"}
                                            </span>

                                            <span className="profile__order-price">
                                                {item.quantity ?? 0} ×{" "}
                                                {item.price ?? 0}₽
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="profile__order-total">
                                    <span>
                                        Доставка: {order.deliveryPrice ?? 0}₽
                                    </span>

                                    <span className="profile__total">
                                        Итого: {order.grandTotal ?? 0}₽
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default AuthMe;

