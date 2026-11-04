import Fastify from "fastify";
import cors from "@fastify/cors";
import dayjs from "dayjs";
import {getAll, getOne, getUserId, addProduct, sugarTable, updateUserInfo, addSugarRecord, addQuestion,
    deleteQuestions, updateEndocrinologistInfo, deleteSugarLogById, deleteProductById
} from "./database-function.js";

const PORT = process.env.PORT || 5000;

const app = Fastify({
    logger: true,
});

app.register(cors, {
    origin: ["http://localhost:4000", "http://localhost:4173", "https://sugar-log-feeb.onrender.com", "https://sugar-log-k53m.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

app.get("/", async (request, reply) => {
    try {
        return { message: "Sugar Log API is running" };
    } catch (err) {
        console.log("ROOT ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.get("/api/user-info", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        const user = await getOne("SELECT * FROM users_info WHERE user_id = ?", [userId]);
        console.log(userId, user)
        if (!user) return reply.code(404).send({ error: "Пользователь не найден" });

        return user;
    } catch (err) {
        console.log("USER-INFO ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.get("/api/data-for-metrics", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        return await getAll(`SELECT sugar, date, time FROM ${sugarTable(userId)}`);
    } catch (err) {
        console.log("DATA-FOR-METRICS ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.get("/api/user-questions", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        return await getAll("SELECT * FROM questions WHERE user_id = ?", [userId]);
    } catch (err) {
        console.log("USER-QUESTIONS ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.get("/api/endocrinologist", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        return await getAll("SELECT * FROM endocrinologists WHERE user_id = ?", [userId]);
    } catch (err) {
        console.log("ENDOCRINOLOGIST ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.get("/api/products", async (request, reply) => {
    try {
        return await getAll("SELECT * FROM products");
    } catch (err) {
        console.log("PRODUCTS ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.get("/api/all-sugar-log", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        return await getAll(`SELECT * FROM ${sugarTable(userId)} ORDER BY date ASC, time ASC`);
    } catch (err) {
        console.log("ALL-SUGAR-LOG ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.get("/api/day-period-sugar-log", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        const { from, to } = request.query;
        if (!from || !to) {
            return reply.code(400).send({ error: "from и to обязательны" });
        }

        return await getAll(`
            SELECT * FROM ${sugarTable(userId)}
            WHERE date BETWEEN ? AND ?
            ORDER BY id DESC
        `, [from, to]);
    } catch (err) {
        console.log("DAY-PERIOD-SUGAR-LOG ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.get("/api/today-sugar-log", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        const today = dayjs().format("YYYY-MM-DD");
        return await getAll(`SELECT * FROM ${sugarTable(userId)} WHERE date = ?`, [today]);
    } catch (err) {
        console.log("TODAY-SUGAR-LOG ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.post("/api/addSugar", async (request, reply) => {
    try {
        await addSugarRecord(request.body);
        return { message: "Успешно" };
    } catch (err) {
        console.log("ADD-SUGAR ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.post("/api/addProduct", async (request, reply) => {
    try {
        const result = await addProduct(request.body);
        return reply.code(201).send(result);
    } catch (err) {
        console.log("ADD-PRODUCT ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.post("/api/selectPeriod", async (request, reply) => {
    try {
        const data = request.body.dateRange;
        return { message: "Успешно" };
    } catch (err) {
        console.log("SELECT-PERIOD ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.post("/api/changeUserInfo", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        const { name, height, weight, shortInsulin, longInsulin, sugarDecline } = request.body;
        await updateUserInfo(userId, name, height, weight, shortInsulin, longInsulin, sugarDecline);
        return { message: "Успешно" };
    } catch (err) {
        console.log("CHANGE-USER-INFO ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.post("/api/add-question", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        const { question } = request.body;
        await addQuestion(userId, question);
        return { message: "Успешно" };
    } catch (err) {
        console.log("ADD-QUESTION ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.delete("/api/delete-question", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        const { ids } = request.body;
        await deleteQuestions(userId, ids);
        return { message: "Успешно" };
    } catch (err) {
        console.log("DELETE-QUESTION ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.put("/api/update-endocrinologist", async (request, reply) => {
    try {
        const userId = getUserId(request);
        if (!userId) return reply.code(400).send({ error: "Нет userId" });

        const { name, day, month, time } = request.body;
        await updateEndocrinologistInfo(userId, name, day, month, time);
        return { message: "Успешно" };
    } catch (err) {
        console.log("UPDATE-ENDOCRINOLOGIST ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.delete("/api/delete-sugar-record", async (request, reply) => {
    try {
        await deleteSugarLogById(request.body);
        return { message: "Успешно" };
    } catch (err) {
        console.log("DELETE-SUGAR-RECORD ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

app.delete("/api/delete-product", async (request, reply) => {
    try {
        await deleteProductById(request.body);
        return { message: "Успешно" };
    } catch (err) {
        console.log("DELETE-PRODUCT ERROR:", err);
        return reply.code(500).send({ error: err.message });
    }
});

const start = async () => {
    try {
        await app.listen({
            port: PORT,
            host: "0.0.0.0",
        });
        console.log("✅ Сервер запущен на http://localhost:5000");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();