import "./delivery.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../../context/order-context";
import { useCartContext } from "../../context/cart-context";
import { useToast } from "../../context/toast-context";
import closeIcon from "../../assets/close.svg";

function Delivery({ onClose }) {
    const navigate = useNavigate();
    const { createOrder, loading } = useOrderContext();
    const { getCart } = useCartContext();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        type: "delivery",
        floor: "",
        intercom: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!localStorage.getItem("accessToken")) {
            showToast("Buyurtma berish uchun avval login qiling", "warning");
            onClose();
            navigate("/login");
            return;
        }

        const payload = {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            type: formData.type,
        };

        // Etaj va domofon faqat yetkazib berishda kerak
        if (formData.type === "delivery") {
            if (formData.floor !== "") payload.floor = Number(formData.floor);
            if (formData.intercom !== "") payload.intercom = formData.intercom.trim();
        }

        try {
            await createOrder(payload);
            await getCart(); // buyurtmadan keyin savat yangilanadi

            showToast("Заказ успешно оформлен!", "success");
            onClose();
        } catch (error) {
            showToast(error.message || "Buyurtma yaratishda xatolik", "error");
        }
    };

    return (
        <div className="delivery background" onClick={onClose}>
            <div
                className="delivery__content"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    type="button"
                    className="delivery__content-btn"
                    onClick={onClose}
                >
                    <img
                        src={closeIcon}
                        alt="Закрыть"
                        className="delivery__btn-img"
                    />
                </button>

                {/* <div className="delivery__content-maps">
                    <iframe
                        className="delivery__maps-iframe"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d47965.201285601965!2d69.24810538251957!3d41.29091124625276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2s!4v1790862604015!5m2!1sru!2s"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Google Maps"
                    ></iframe>
                </div> */}

                <form
                    className="delivery__content-form"
                    onSubmit={handleSubmit}
                >

                    <div className="delivery__form-wrap">
                        <input
                            type="text"
                            name="name"
                            placeholder="Ваше имя"
                            className="delivery__wrap-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="delivery__form-wrap">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Телефон"
                            className="delivery__wrap-input"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="delivery__form-wrap">
                        <input
                            type="radio"
                            name="type"
                            value="pickup"
                            className="delivery__wrap-radio"
                            checked={formData.type === "pickup"}
                            onChange={handleChange}
                        />

                        <span className="delivery__wrap-span">
                            Самовывоз
                        </span>
                    </div>

                    <div className="delivery__form-wrap">
                        <input
                            type="radio"
                            name="type"
                            value="delivery"
                            className="delivery__wrap-radio"
                            checked={formData.type === "delivery"}
                            onChange={handleChange}
                        />

                        <span className="delivery__wrap-span">
                            Доставка
                        </span>
                    </div>

                    {formData.type === "delivery" && (
                        <div className="delivery__form-wrap">
                            <div className="delivery__form-flex">

                                <input
                                    type="number"
                                    min="0"
                                    name="floor"
                                    placeholder="Этаж"
                                    className="delivery__wrap-input"
                                    value={formData.floor}
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name="intercom"
                                    placeholder="Домофон"
                                    className="delivery__wrap-input"
                                    value={formData.intercom}
                                    onChange={handleChange}
                                />

                            </div>
                        </div>
                    )}
                    {/* <div className="delivery__form-wrap">
                        <input
                            type="tex"
                            name="tex"
                            placeholder="address"
                            className="delivery__wrap-input"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div> */}

                    <button
                        type="submit"
                        className="delivery__form-btn"
                        disabled={loading}
                    >
                        {loading ? "Оформление..." : "Оформить"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Delivery;