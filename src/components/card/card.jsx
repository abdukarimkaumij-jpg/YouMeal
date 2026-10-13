import { useState } from "react";
import "./card.css";
import { useCartContext } from "../../context/cart-context";
import Delivery from "../delivery/delivery";
import deliveryIcon from "../../assets/delivery.svg";

// Savat elementi ham { product: {...} }, ham yassi ko'rinishda kelishi mumkin
const getProductId = (item) =>
    item?.product?.id ?? item?.product_id ?? item?.id;
const getField = (item, key) => item?.product?.[key] ?? item?.[key];

function Card() {
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
    } = useCartContext();

    const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

    const totalPrice = cart.reduce(
        (sum, item) =>
            sum +
            Number(getField(item, "price") || 0) *
                Number(item?.quantity || 1),
        0
    );

    return (
        <>
            <div className="car-fixed">
                <div className="card">

                    <div className="card__header">
                        <h5 className="card__header-name">
                            Корзина
                        </h5>

                        <span className="card__header-number">
                            {cart.length}
                        </span>
                    </div>

                    <div className="card__body">

                        <div className="card__body-position">

                            {cart.length === 0 ? (
                                <p className="card__body-empty">
                                    Корзина пуста
                                </p>
                            ) : (
                                cart.map((item) => {
                                    if (!item) return null;

                                    const productId = getProductId(item);

                                    return (
                                        <div
                                            className="card__position-group"
                                            key={productId}
                                        >
                                            <div className="card__group-bg">
                                                <img
                                                    src={getField(item, "main_image")}
                                                    alt={getField(item, "name")}
                                                />
                                            </div>

                                            <div className="card__group-info">
                                                <h5 className="card__info-name">
                                                    {getField(item, "name")}
                                                </h5>

                                                <p className="card__info-oldprice">
                                                    {getField(item, "weight")}
                                                </p>

                                                <p className="card__info-price">
                                                    {getField(item, "price")}₽
                                                </p>
                                            </div>

                                            <div className="card__group-quantity">

                                                <button
                                                    className="card__quantity-btn"
                                                    onClick={() => {
                                                        if (item.quantity <= 1) {
                                                            removeFromCart(productId);
                                                        } else {
                                                            decreaseQuantity(
                                                                productId,
                                                                item.quantity
                                                            );
                                                        }
                                                    }}
                                                >
                                                    -
                                                </button>

                                                <span className="card__quantity-number">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    className="card__quantity-btn"
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            productId,
                                                            item.quantity
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>
                                        </div>
                                    );
                                })
                            )}

                        </div>

                        {cart.length > 0 && (
                            <>
                                <div className="card__body-total">
                                    <h5 className="card__total-name">
                                        Итого
                                    </h5>

                                    <div className="card__total-price">
                                        {totalPrice}₽
                                    </div>
                                </div>

                                <button
                                    className="card__body-btn"
                                    onClick={() => setIsDeliveryOpen(true)}
                                >
                                    Оформить заказ
                                </button>

                                <div className="card__body-message">
                                    <img
                                        src={deliveryIcon}
                                        alt=""
                                    />

                                    <p>
                                        Бесплатная доставка
                                    </p>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>

            {isDeliveryOpen && (
                <Delivery
                    onClose={() => setIsDeliveryOpen(false)}
                />
            )}
        </>
    );
}

export default Card;