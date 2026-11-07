function parseAutoFood(value) {
    if (!value) return [];
    return String(value)
        .split(",")
        .map((pair) => {
            const [id, amount] = pair.trim().split(":");
            return { id: Number(id), amount: Number(amount) };
        })
        .filter((p) => Number.isFinite(p.id) && Number.isFinite(p.amount));
}

export function formatFood(record, productsById) {
    const items = parseAutoFood(record.auto_food);

    if (!items.length) return record.food;

    const parts = items.map(({ id, amount }) => {

        const product = productsById.get(id);
        if (!product) return `#${id} x ${amount}`;
        if (amount === 1 && Number(product["Вес продукта"]) !== 100) {
            return `${product["Продукт"]}`
        }
        if (amount === 1 && Number(product["Вес продукта"]) === 100) {
            return `${product["Продукт"]} 100гр`
        }

        const qty =
            Number(product["Вес продукта"]) === 100
                ? `${100 * amount}гр`
                : `${amount}шт`;

        return `${product["Продукт"]} ${qty}`;
    });

    return record.food_text ? `${parts.join(", ")}, ${record.food_text}` : parts.join(", ");
}
