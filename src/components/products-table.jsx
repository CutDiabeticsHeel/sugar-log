import style from "../css/components/products-table.module.css";
import {useGetProductsQuery} from "../store/api";
import {useState, useMemo, useEffect} from "react";

function ProductsTable(){
    const {data: products, isLoading} = useGetProductsQuery();
    const [searchedVal, setSearchedVal] = useState("");
    const [debounceValue, setDebounceValue] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(searchedVal)
        }, 228)
        return () => clearTimeout(timer)
    }, [searchedVal])

    const filteredData = useMemo(() =>{
        if (!products) return []
        return products.filter((row) =>
            !searchedVal.length || row["Продукт"]
            .toString()
            .toLowerCase()
            .includes(debounceValue.toString().toLowerCase()) 
        )
    }, [products, debounceValue, searchedVal])

    if (isLoading) {
        return <div>Загрузка...</div>;
    }
    return (
        <table className={style.poductTable}>
            <caption className={style.searchContainer}>
                <label>
                    <input type="text" name="search" onChange={(e) => setSearchedVal(e.target.value)} className={style.searchRow} autoComplete="off"/>
                </label>
            </caption>
            <thead>
                <tr className={style.header}>
                    <th>Продукт</th>
                    <th>Белки</th>
                    <th>Жиры</th>
                    <th>Углеводы</th>
                    <th>Вес продукта, г</th>
                    <th>Ккал</th>
                    <th>БЖЕ</th>
                    <th>ХЕ</th>
                    <th>ХЕ + БЖЕ</th>
                    <th>Инсулина</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((product) => (
                    <tr key={product["id"]}>
                        <td>{product["Продукт"]}</td>
                        <td>{product["Белки"]}</td>
                        <td>{product["Жиры"]}</td>
                        <td>{product["Углеводы"]}</td>
                        <td>{product["Вес продукта"]}</td>
                        <td>{Number(product["ккал"]).toFixed(0)}</td>
                        <td>{Number(product["БЖЕ"]).toFixed(2)}</td>
                        <td>{Number(product["ХЕ"]).toFixed(2)}</td>
                        <td>{Number(product["ХЕ + БЖЕ"]).toFixed(2)}</td>
                        <td>{Number(product["Всего инсулина"]).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ProductsTable