import { createClient } from "@libsql/client";
import 'dotenv/config';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

function toNumber(value) {
    return parseFloat(String(value).replace(",", "."));
}

function calculateNutrition({ protein, fat, carbs, weight }) {
    const kkal = ((protein * 4 + fat * 9 + carbs * 4) * weight) / 100;
    const bzhu = ((protein * 4 * weight) + (fat * 9 * weight)) / 10000;
    const xe = (carbs * weight / 100) / 12;
    const xeBzhu = xe + bzhu;

    return {
        kkal: kkal.toFixed(2),
        bzhu: bzhu.toFixed(2),
        xe: xe.toFixed(2),
        xeBzhu: xeBzhu.toFixed(2),
    };
}
async function getAll(sql, params = []) {
    const result = await db.execute({ sql, args: params });
    return result.rows;
}

async function addProduct({ id, nameProduct, protein, fat, carbs, weigth }) {
    const parsed = {
        protein: toNumber(protein),
        fat: toNumber(fat),
        carbs: toNumber(carbs),
        weight: toNumber(weigth),
    };

    const { kkal, bzhu, xe, xeBzhu } = calculateNutrition(parsed);

    const sql = `
        INSERT INTO products
            (id, "Продукт", "Белки", "Жиры", "Углеводы", "Вес продукта", "ккал", "БЖЕ", "ХЕ", "ХЕ + БЖЕ")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            "Продукт" = excluded."Продукт",
            "Белки" = excluded."Белки",
            "Жиры" = excluded."Жиры",
            "Углеводы" = excluded."Углеводы",
            "Вес продукта" = excluded."Вес продукта",
            "ккал" = excluded."ккал",
            "БЖЕ" = excluded."БЖЕ",
            "ХЕ" = excluded."ХЕ",
            "ХЕ + БЖЕ" = excluded."ХЕ + БЖЕ"
    `;

    const params = [
        id ?? null,
        nameProduct,
        parsed.protein.toFixed(2),
        parsed.fat.toFixed(2),
        parsed.carbs.toFixed(2),
        parsed.weight.toFixed(2),
        kkal,
        bzhu,
        xe,
        xeBzhu
    ];

    const result = await db.execute({ sql, args: params });

    return {
        id: id ?? Number(result.lastInsertRowid),
        nameProduct,
        kkal,
        bzhu,
        xe,
        xeBzhu
    };
}

async function getInsulinAndXEBE(foodItems) {
    if (!foodItems || foodItems.length === 0) {
        return { insulin: 0, XEBE: 0 };
    }

    const ids = foodItems.map(item => item.value);
    const placeholders = ids.map(() => '?').join(',');

    const query = `
        SELECT id, "ХЕ + БЖЕ" as xebe, "Всего инсулина" as insulin
        FROM products
        WHERE id IN (${placeholders})
    `;

    const result = await db.execute({ sql: query, args: ids });
    const rows = result.rows;

    let calculatedInsulin = 0;
    let calculatedXEBE = 0;

    for (const item of foodItems) {
        const row = rows.find(r => r.id === item.value);
        if (!row) {
            console.warn(`Продукт с id=${item.value} не найден в БД`);
            continue;
        }

        const xebe = parseFloat(String(row.xebe).replace(',', '.')) || 0;
        const insulin = parseFloat(String(row.insulin).replace(',', '.')) || 0;
        const amount = item.amount;

        calculatedXEBE += xebe * amount;
        calculatedInsulin += insulin * amount;
    }

    return {
        insulin: parseFloat(calculatedInsulin.toFixed(2)),
        XEBE: parseFloat(calculatedXEBE.toFixed(2))
    };
}

async function updateUserInfo(
    name,
    height,
    weight,
    shortInsulin,
    longInsulin
) {
    const fields = [];
    const values = [];

    if (name !== "") {
        fields.push("name = ?");
        values.push(name);
    }

    if (height !== "") {
        fields.push("height = ?");
        values.push(height);
    }

    if (weight !== "") {
        fields.push("weight = ?");
        values.push(weight);
    }

    if (shortInsulin !== "") {
        fields.push("short_insulin = ?");
        values.push(shortInsulin);
    }

    if (longInsulin !== "") {
        fields.push("long_insulin = ?");
        values.push(longInsulin);
    }

    if (fields.length === 0) {
        return 0;
    }

    const sql = `
        UPDATE user_info
        SET ${fields.join(", ")}
    `;

    const result = await db.execute({ sql, args: values });
    return result.rowsAffected;
}

async function addSugarRecord(entry) {
    const foodList = Array.isArray(entry.food) ? entry.food : [];
    const autoNames = foodList.map(food =>  `${food.label} x ${food.amount}`).filter(Boolean);
    const manualText = entry.foodText && entry.foodText.trim() ? entry.foodText.trim() : '';
    const foodName = [manualText, ...autoNames].filter(Boolean).join(', ');

    let autoProtein = 0, autoFat = 0, autoCarb = 0, autoCcal = 0;
    for (const food of foodList) {
        autoProtein += Number(food.protein * food.amount) || 0;
        autoFat += Number(food.fat * food.amount) || 0;
        autoCarb += Number(food.carbs * food.amount) || 0;
        autoCcal += parseFloat(food.kcal * food.amount) || 0;
    }

    const autoFood = foodList.map(food => `${food.value}:${food.amount}`).join(',');
    const activity = Array.isArray(entry.activity) ? entry.activity.join(',') : '';
    const notes = entry.notes;

    const manulProtein = entry.protein || 0;
    const manulFat = entry.fat || 0;
    const manulCarb = entry.carb || 0;

    const protein = manulProtein + autoProtein;
    const fat = manulFat + autoFat;
    const carb = manulCarb + autoCarb;
    const ccal = Math.round(manulProtein * 4 + manulFat * 9 + manulCarb * 4 + autoCcal);

    if (entry.id) {
        const sql = `UPDATE sugar_log
                     SET date = ?, time = ?, sugar = ?, insulin = ?, XEBE = ?, food = ?, protein = ?, fat = ?, carb = ?, ccal = ?, notes = ?, auto_food = ?, activity = ?, food_text = ?
                     WHERE id = ?`;

        const params = [
            entry.date, entry.time, entry.sugar, entry.insulin, entry.XEBE, foodName,
            protein, fat, carb, ccal, notes, autoFood, activity, manualText, entry.id
        ];

        await db.execute({ sql, args: params });
        return entry.id;
    } else {
        const sql = `INSERT INTO sugar_log (date, time, sugar, insulin, XEBE, food, protein, fat, carb, ccal, notes, auto_food, activity, food_text)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            entry.date, entry.time, entry.sugar, entry.insulin, entry.XEBE, foodName,
            protein, fat, carb, ccal, notes, autoFood, activity, manualText
        ];

        const result = await db.execute({ sql, args: params });
        return Number(result.lastInsertRowid);
    }
}
async function addQuestion(question) {
    if (!question || question === "") {
        return 0;
    }

    const sql = `
        INSERT INTO questions (question)
        VALUES (?)
    `;

    const result = await db.execute({ sql, args: [question] });
    return Number(result.lastInsertRowid);
}

async function deleteQuestions(ids) {
    if (!ids || ids.length === 0) {
        return 0;
    }

    const placeholders = ids.map(() => "?").join(", ");

    const sql = `
        DELETE FROM questions
        WHERE id IN (${placeholders})
    `;

    const result = await db.execute({ sql, args: ids });
    return result.rowsAffected;
}

async function updateEndocrinologistInfo(name, day, month, time) {
    const fields = [];
    const values = [];

    if (name !== "") {
        fields.push("name = ?");
        values.push(name);
    }
    if (day !== "") {
        fields.push("day = ?");
        values.push(day);
    }
    if (month !== "") {
        fields.push("month = ?");
        values.push(month);
    }
    if (time !== "") {
        fields.push("time = ?");
        values.push(time);
    }
    if (fields.length === 0) {
        return 0;
    }

    const sql = `
        UPDATE endocrinologist
        SET ${fields.join(", ")}
    `;

    const result = await db.execute({ sql, args: values });
    return result.rowsAffected;
}

async function deleteSugarLogById(id) {
    const result = await db.execute({ sql: 'DELETE FROM sugar_log WHERE id = ?', args: [id] });
    return result.rowsAffected;
}

async function deleteProductById(id) {
    const result = await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] });
    return result.rowsAffected;
}

export { getAll, addProduct, getInsulinAndXEBE, updateUserInfo, addSugarRecord, addQuestion,
    deleteQuestions, updateEndocrinologistInfo, deleteSugarLogById, deleteProductById };