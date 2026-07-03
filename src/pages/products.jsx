import { useGetProductsQuery } from "../store/api";

function ProductsTable() {
    const {data: products} = useGetProductsQuery();
    return (
        <div>
            <h1>Продукты</h1>
            {products?.[0]?.id}
        </div>
    )
}

export default ProductsTable;