import Fastify from "fastify";
import sqlite3 from "sqlite3";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import dayjs from "dayjs";
import {addProduct, getInsulinAndXEBE, updateUserInfo, addSugarRecord, addQuestion,
    deleteQuestions
} from "./database-function.js";

const app = Fastify({
    logger: true,
});

const db = new sqlite3.Database("./server/database/sugar-log.db");

app.register(cors, {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

function getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

app.get("/api/user-info", async (request, reply) => {
    return await getAll("SELECT * FROM user_info");

});

app.get("/api/data-for-metrics", async (request, reply) => {
    return await getAll("SELECT sugar, date, time FROM sugar_log");

});

app.get("/api/user-questions", async (request, reply) => {
    return await getAll("SELECT * FROM questions");

});

app.get("/api/endocrinologist", async (request, reply) => {
    return await getAll("SELECT * FROM endocrinologist");

});

app.get("/api/products", async (request, reply) => {
    return await getAll("SELECT * FROM products");

});

app.get("/api/all-sugar-log", async (request, reply) => {
    return await getAll("SELECT * FROM sugar_log");

});

app.get("/api/day-period-sugar-log", async (request, reply) => {
    const limit = request.query.limit || 7;
    return await getAll(`
        SELECT * FROM (
            SELECT * FROM sugar_log 
            ORDER BY id DESC LIMIT ?
        ) AS sub
        ORDER BY id ASC
    `, [limit]);
});

app.get("/api/sugar-log-for-chart", async (request, reply) => {
    return await getAll(`
        SELECT * FROM (
            SELECT * FROM sugar_log 
            ORDER BY id DESC LIMIT ?
        ) AS sub
        ORDER BY id ASC
    `, [50]);
});

app.get("/api/today-sugar-log", async (request, reply) => {
    const today = dayjs().format("YYYY-MM-DD");

    return await getAll("SELECT * FROM sugar_log WHERE date= ?", today);
});

app.post("/api/addSugar", async (request, reply) => {
    try {
        await addSugarRecord(request.body)
    } catch (err) {
        console.log(err)
        reply.status(500).send({error: "Database write failed"})
    }
    return {message: "Успешно"}
})

app.post("/api/addProduct", async (request, reply) => {
    try {
        const { nameProduct, protein, fat, carbs, weigth } = request.body;

        if (!nameProduct || !protein || !fat || !carbs || !weigth) {
            return reply.status(400).send({ error: "Missing required fields" });
        }

        const result = await addProduct(request.body);

        reply.status(201).send(result);
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: "Database write failed" });
    }
});

app.post("/api/selectPeriod", async (request, reply) => {
    const data = request.body.dateRange
    console.log("Принял", data)
    return {message: "Успешно"}
})

app.post("/api/foodAuto", async (request, reply) => {
    try {
        const { insulin, XEBE } = await getInsulinAndXEBE(request.body)

        return {
            insulin,
            XEBE,
        };
    } catch (err) {
        console.log(err)
        reply.code(500)
        return {error: "Ошибка при расчете"}
    }

    return {
        insulin: calculatedInsulin,
        XEBE: calculatedXEBE,
    };
})

app.post("/api/changeUserInfo", async (request, reply) => {
    try {
        const {name, height, weight, shortInsulin, longInsulin} = request.body;
        await updateUserInfo(name, height, weight, shortInsulin, longInsulin)
        return {message: "Успешно"}
    } catch(err){
        console.log(err)
        reply.code(500)
        return err
    }
})

app.post("/api/add-question", async (request, reply) => {
    try {
        const {question} = request.body
        console.log(question)
        await addQuestion(question)
        return {message: "Успешно"}
    } catch(err){
        console.log(err)
        reply.code(500)
        return err
    }
})

app.delete("/api/delete-question", async (request, reply) => {
    try {
        const {ids} = request.body
        await deleteQuestions(ids)
        return {message: "Успешно"}
    } catch(err){
        console.log(err)
        reply.code(500)
        return err
    }
})

const start = async () => {
    try {
        await app.listen({
            port: 5000,
            host: "0.0.0.0"
        });
        console.log("✅ Сервер запущен на http://localhost:5000");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();