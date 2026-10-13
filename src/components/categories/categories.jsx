import { useCategoryContext } from "../../context/categories-context";
import "./categories.css";

function Categories() {
    const {
        category,
        selectedCategory,
        selectCategory,
        loading,
        error,
    } = useCategoryContext();

    if (loading) {
        return (
            <section className="categories">
                <div className="categories__content container">
                    <p>Kategoriyalar yuklanmoqda...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="categories">
                <div className="categories__content container">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="categories">
            <div className="categories__content container">
                <div className="categories__content-wrap">
                    <button
                        className={`categories__wrap-flex ${
                            selectedCategory === null ? "active" : ""
                        }`}
                        onClick={() => selectCategory(null)}
                    >
                        <span className="categories__wrap-name">
                            Barchasi
                        </span>
                    </button>

                    {category?.map((item) => (
                        <button
                            key={item.id}
                            className={`categories__wrap-flex ${
                                selectedCategory === item.id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => selectCategory(item.id)}
                        >
                            <div className="categories__flex-img">
                                {item.emoji || item.icon || "🍔"}
                            </div>

                            <span className="categories__wrap-name">
                                {item.name || item.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Categories;
