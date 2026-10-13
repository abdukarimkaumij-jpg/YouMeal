import "./product-card.css";
import { useCartContext } from "../../context/cart-context";
import { useProductDetails } from "../../context/product-details-context";

function ProductCard({ categoryId, id, name, image, price, weight }) {
    const { addToCart } = useCartContext();
    const { openDetails } = useProductDetails();

    const handleAddToCart = () => {
        addToCart(id);
    };

    // Kartadagi ma'lumot modalda darrov ko'rinadi, to'liq ma'lumot API dan keladi
    const handleOpen = () => {
        openDetails(id, {
            id,
            name,
            price,
            weight,
            main_image: image,
            category_id: categoryId,
        });
    };

    return (
        <div className="product__card">
            <div className="product__card-bg">
                <img src={image} alt={name} />
            </div>

            <div className="product__card-info">
                <p className="product__info-price">{price} ₽</p>

                <h5 className="product__info-name">{name}</h5>

                <div className="product__info-gram">{weight}</div>

                <div className="product__info-button">
                    <button
                        type="button"
                        className="product__info-btn"
                        onClick={handleAddToCart}
                    >
                        Добавить
                    </button>

                    <button
                        type="button"
                        className="product__info-btn"
                        onClick={handleOpen}
                    >
                        Подробно
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
