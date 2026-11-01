import { useState } from "react"
import AsyncSelect from "react-select/async"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import DeleteIcon from "@mui/icons-material/Delete"

import { useGetProductsQuery } from "../store/api"
import Preloader from "./preloader"
import style from "../css/components/productSelect.module.css"


const MIN = 0

const increment = (value) => Number((Number(value) + 1).toFixed(1))
const decrement = (value) => Math.max(MIN, Number((Number(value) - 1).toFixed(1)))

function ProductSelect({setProducts}) {
  const { data: allProduct, isLoading } = useGetProductsQuery()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [foodList, setFoodList] = useState([])

  if (isLoading) return <Preloader />

  const forEachProduct = (allProduct ?? []).map((item) => ({
    value: item.id,
    label: item["Продукт"],
    kcal: item["ккал"],
    protein: item["Белки"],
    fat: item["Жиры"],
    carbs: item["Углеводы"],
    weight: item["Вес продукта"],
  }))

  const filterProducts = (inputValue) =>
    forEachProduct.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    )

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(filterProducts(inputValue)), 228)
    })

  const addProduct = () => {
    if (!selectedProduct) return
    setFoodList((prev) => [
      ...prev,
      { ...selectedProduct, amount: 1, uid: crypto.randomUUID() },
    ])
    setSelectedProduct(null)
  }

  const updateItem = (index, patch) =>
    setFoodList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    )

  const removeItem = (index) =>
    setFoodList((prev) => prev.filter((_, i) => i !== index))

  const calculatedCurve = () => {
    if (!foodList.length) return
    setProducts((prev) => [...prev, ...foodList])
    setFoodList([])
  }

  return (
    <section className={style.addCurveContainer}>
        <div className={style.foodSelectContainer}>
        <span>Выберите продукт и количество в порциях</span>

        <AsyncSelect
            value={selectedProduct}
            cacheOptions
            defaultOptions
            loadOptions={promiseOptions}
            className={style.foodSelect}
            styles={{
            control: (base, state) => ({
                ...base,
                backgroundColor: "var(--paper-soft)",
                outline: state.isFocused ? "2px solid #000000" : "none",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                boxShadow: "none",
            }),
            menu: (base) => ({ ...base, backgroundColor: "var(--paper-soft)" }),
            dropdownIndicator: (base) => ({ ...base, cursor: "pointer" }),
            }}
            onChange={setSelectedProduct}
        />

        <button type="button" className={style.addEntry} onClick={addProduct}>
            Добавить продукт
        </button>

        <ul className={style.productsList}>
            {foodList.map((product, index) => {
            const isGrams = product.weight === 100
            const factor = isGrams ? 100 : 1
            const productUnit = isGrams ? "г" : "шт"
            const shownAmount =
                product.draft ?? String(Number((product.amount * factor).toFixed(1)))

            return (
                <li key={product.uid} className={style.foodItem}>
                <span className={style.productLabel}>{product.label}</span>

                <button
                    className={style.counter}
                    type="button"
                    onClick={() =>
                    updateItem(index, { amount: decrement(product.amount), draft: undefined })
                    }
                >
                    <RemoveIcon />
                </button>

                <input
                    className={style.foodAmount}
                    name="foodAmount"
                    value={shownAmount}
                    onChange={(e) => {
                    const raw = e.target.value.replace(",", ".")
                    if (!/^\d*\.?\d?$/.test(raw)) return
                    const num = parseFloat(raw)
                    updateItem(index, {
                        draft: raw,
                        amount: isNaN(num) ? "" : Number((num / factor).toFixed(4)),
                    })
                    }}
                    onBlur={() => {
                    const num = parseFloat(product.amount)
                    updateItem(index, { amount: isNaN(num) ? 1 : num, draft: undefined })
                    }}
                />
                <span className={style.productUnit}>{productUnit}</span>

                <button
                    className={style.counter}
                    type="button"
                    onClick={() =>
                    updateItem(index, { amount: increment(product.amount), draft: undefined })
                    }
                >
                    <AddIcon />
                </button>

                <button
                    className={style.deleteButton}
                    type="button"
                    onClick={() => removeItem(index)}
                >
                    <DeleteIcon />
                </button>
                </li>
            )
            })}
        </ul>
        </div>
        <button className={style.calculateCurve} onClick={()=> calculatedCurve()}>Рассчитать кривую</button>
    </section>
  )
}

export default ProductSelect