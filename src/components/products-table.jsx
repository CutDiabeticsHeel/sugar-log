import style from "../css/components/products-table.module.css";
import {useGetProductsQuery} from "../store/api";
import {useState, useMemo, useEffect} from "react";
import SearchIcon from '@mui/icons-material/Search';


function ProductsTable(){
    const {data: products, isLoading} = useGetProductsQuery();
    const [searchedVal, setSearchedVal] = useState("");
    const [debounceValue, setDebounceValue] = useState("");
    const [needScroll, setNeedScroll] = useState(false);

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
        <div>
            <label className={style.searchContainer}>
                <SearchIcon className={style.searchIcon}/>
                <input
                    type="text"
                    onChange={(e) => setSearchedVal(e.target.value)}
                    className={style.searchRow}
                    placeholder="Поиск по названию продукта..."
                    autoComplete="off"
                />
            </label>
            <div className={style.tableContainer}>
                <table className={style.productTable}>
                    <thead>
                        <tr>
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
                            <tr key={product.id}>
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
            </div>
        </div>
    )
}

export default ProductsTable