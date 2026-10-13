import { useProductsContext } from "../../context/product-context";
import { useCategoryContext } from "../../context/categories-context";
import ProductCard from "../product-card/product-card";
import "./product.css";

function Product() {
    const { products, loading, error } = useProductsContext();
    const { category, selectedCategory } = useCategoryContext();

    if (loading) {
        return <h2>Yuklanmoqda...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    const getCategoryId = (item) =>
        item.category_id ?? item.categoryId ?? item.category?.id;

    const filteredProducts = selectedCategory
        ? products.filter(
              (item) =>
                  String(getCategoryId(item)) ===
                  String(selectedCategory)
          )
        : products;

    const selectedCategoryName = selectedCategory
        ? category.find(
              (item) =>
                  String(item.id) === String(selectedCategory)
          )?.name || "Kategoriya"
        : "Barcha mahsulotlar";

    return (
        <div className="product">
            <h2 className="product-title">
                {selectedCategoryName}
            </h2>

            <div className="product__content">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                            <ProductCard
                                key={item.id}
                                id={item.id || item.product_id}
                                image={item.main_image}
                                price={item.price}
                                categoryId={getCategoryId(item)}
                                name={item.name}
                                weight={item.weight}
                            />
                    ))
                ) : (
                    <p>Mahsulotlar topilmadi</p>
                )}
            </div>


        </div>
    );
}

export default Product;
