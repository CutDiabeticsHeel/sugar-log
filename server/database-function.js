import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./server/database/sugar-log.db");

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

async function addProduct({ nameProduct, protein, fat, carbs, weigth }) {
    const parsed = {
        protein: toNumber(protein),
        fat: toNumber(fat),
        carbs: toNumber(carbs),
        weight: toNumber(weigth),
    };

    const { kkal, bzhu, xe, xeBzhu } = calculateNutrition(parsed);

    const sql = `
        INSERT INTO products
            ("Продукт", "Белки", "Жиры", "Углеводы", "Вес продукта", "ккал", "БЖЕ", "ХЕ", "ХЕ + БЖЕ")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
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

    const info = await new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });

    return {
        id: info.lastID,
        nameProduct,
        kkal,
        bzhu,
        xe,
        xeBzhu
    };
}

async function getInsulinAndXEBE(foodItems) {
    return new Promise((resolve, reject) => {
        if (!foodItems || foodItems.length === 0) {
            return resolve({ insulin: 0, XEBE: 0 });
        }

        const ids = foodItems.map(item => item.value);
        const placeholders = ids.map(() => '?').join(',');

        const query = `
            SELECT id, "ХЕ + БЖЕ" as xebe, "Всего инсулина" as insulin
            FROM products
            WHERE id IN (${placeholders})
        `;

        db.all(query, ids, (err, rows) => {
            if (err) {
                return reject(err);
            }

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

                calculatedXEBE += xebe;
                calculatedInsulin += insulin;
            }

            resolve({
                insulin: parseFloat(calculatedInsulin.toFixed(2)),
                XEBE: parseFloat(calculatedXEBE.toFixed(2)),
            });
        });
    });
}

async function updateUserInfo(
    name,
    height,
    weight,
    shortInsulin,
    longInsulin
) {
    return new Promise((resolve, reject) => {
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
            resolve(0);
            return;
        }

        const sql = `
            UPDATE user_info
            SET ${fields.join(", ")}
        `;

        db.run(sql, values, function (error) {
            if (error) {
                reject(error);
                return;
            }

            resolve(this.changes);
        });
    });
}

async function addSugarRecord(entry) {
  return new Promise((resolve, reject) => {
    const foodList = Array.isArray(entry.food) ? entry.food : [];

    const foodName = entry.foodText && entry.foodText.trim()
      ? entry.foodText.trim()
      : foodList.map(f => f.label).join(', ');

    let protein = 0, fat = 0, carb = 0, ccal = 0;
    for (const f of foodList) {
      protein += Number(f.protein) || 0;
      fat += Number(f.fat) || 0;
      carb += Number(f.carbs) || 0;
      ccal += parseFloat(f.kcal) || 0;
    }

    const activityText = Array.isArray(entry.activity) && entry.activity.length
      ? `Активность: ${entry.activity.join(', ')}`
      : '';
    const notes = [entry.notes, activityText].filter(Boolean).join('; ');

    const sql = `INSERT INTO sugar_log (date, time, sugar, insulin, XEBE, food, notes, protein, fat, carb, ccal)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      entry.date, entry.time, entry.sugar, entry.insulin, entry.XEBE,
      foodName, notes, protein, fat, carb, ccal
    ];

    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

async function addQuestion(question) {
    return new Promise((resolve, reject) => {
        if (!question || question === "") {
            resolve(0);
            return;
        }

        const sql = `
            INSERT INTO questions (question)
            VALUES (?)
        `;

        db.run(sql, [question], function (error) {
            if (error) {
                reject(error);
                return;
            }

            resolve(this.lastID);
        });
    });
}

async function deleteQuestions(ids) {
    return new Promise((resolve, reject) => {
        if (!ids || ids.length === 0) {
            resolve(0);
            return;
        }

        const placeholders = ids.map(() => "?").join(", ");

        const sql = `
            DELETE FROM questions
            WHERE id IN (${placeholders})
        `;

        db.run(sql, ids, function (error) {
            if (error) {
                reject(error);
                return;
            }

            resolve(this.changes);
        });
    });
}

export { addProduct, getInsulinAndXEBE, updateUserInfo, addSugarRecord, addQuestion, deleteQuestions};