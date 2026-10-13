import Card from "../components/card/card"
import Categories from "../components/categories/categories"
import Product from "../components/product/product"

function Home() {
    return (
        <>
            <Categories/>
            <section className="main">
                <div className="main__content container">
                    <Card/>
                    <Product/>
                </div>
            </section>
        </>
    )
}
export default Home