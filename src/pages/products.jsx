import { useGetProductsQuery } from "../store/api";
import ProductForm from "../components/product-form";
import ProductsTable from "../components/products-table"

function ProductsPage() {
    const {data: products, isLoading} = useGetProductsQuery();
    if (isLoading) {
            return <div>Загрузка...</div>;
    }
    console.log(products)
    return (
        <div>
            <h1>Продукты {products[22]["Продукт"]}</h1>
            <ProductForm/>
            <ProductsTable/>
        </div>
    )
}

export default ProductsPage;