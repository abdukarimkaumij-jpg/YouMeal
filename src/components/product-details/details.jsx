import { useEffect } from "react";
import { useProductDetails } from "../../context/product-details-context";
import { useCartContext } from "../../context/cart-context";
import "./details.css";

function Details() {
    const { isOpen, product, loading, error, closeDetails } = useProductDetails();
    const { addToCart } = useCartContext();

    // Esc bilan yopish + modal ochiq paytda sahifa scrollini to'xtatish
    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e) => {
            if (e.key === "Escape") closeDetails();
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, closeDetails]);

    if (!isOpen) return null;

    // composition massiv ham, matn ham bo'lishi mumkin
    const composition = Array.isArray(product?.composition)
        ? product.composition
        : typeof product?.composition === "string" && product.composition.trim()
          ? product.composition.split(",").map((s) => s.trim())
          : [];

    const handleAdd = () => {
        if (product?.id) addToCart(product.id);
    };

    return (
        <div className="details background" onClick={closeDetails}>
            <div onClick={(e) => e.stopPropagation()} className="details__content">
                <div className="details__content-header">
                    <h2 className="details__header-name">{product?.name}</h2>
                    <button
                        type="button"
                        onClick={closeDetails}
                        className="details__header-close"
                        aria-label="Yopish"
                    >
                        ✕
                    </button>
                </div>

                {product ? (
                    <div className="details__content-body">
                        <div className="details__body-img">
                            <img
                                src={product.main_image}
                                alt={product.name}
                                className="details__img-bg"
                            />
                        </div>
                        <div className="details__body-info">
                            {loading && !product.description && <p>Yuklanmoqda...</p>}
                            {error && <p>{error}</p>}

                            {product.description && (
                                <p className="details__info-text">{product.description}</p>
                            )}

                            {composition.length > 0 && (
                                <div className="details__info-compound">
                                    <h6 className="details__compound-name">Состав:</h6>
                                    <ul className="details__compound-item">
                                        {composition.map((item, i) => (
                                            <li key={i} className="details__item-list">
                                                <p>{item}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {product.weight && (
                                <p className="details__item-info">{product.weight}</p>
                            )}
                            <p className="details__info-price">{product.price} ₽</p>

                            <button
                                type="button"
                                className="details__info-button"
                                onClick={handleAdd}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                ) : loading ? (
                    <p>Yuklanmoqda...</p>
                ) : (
                    <p>{error || "Mahsulot topilmadi"}</p>
                )}
            </div>
        </div>
    );
}
export default Details;
