import { useGetProductsQuery } from "../store/api";
import ProductForm from "../components/product-form";
import ProductsTable from "../components/products-table"

function ProductsPage() {
    const {data: products} = useGetProductsQuery();
    return (
        <div>
            <h1>Продукты</h1>
            <ProductForm/>
            <ProductsTable/>
        </div>
    )
}

export default ProductsPage;