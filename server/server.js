const Fastify = require("fastify");
const sqlite3 = require("sqlite3");
const cors = require("@fastify/cors");
const static = require("@fastify/static");

const app = Fastify({
    logger: true,
});

const db = new sqlite3.Database("./server/database/sugar-log.db");

app.register(cors);


function getAll(sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

app.get("/api/products", async (request, reply) => {
    return await getAll("SELECT * FROM products");

});

app.post("/api/addSugar", async (request, reply) => {
    console.log("Принял", request.body)
    return {message: "Успешно"}
})

app.post("/api/addProduct", async (request, reply) => {
    console.log("Принял", request.body)
    return {message: "Успешно"}
})

app.post("/api/foodAuto", async (request, reply) => {
    console.log("Еда", request.body)
    const calculatedInsulin = 4.5;
    const calculatedXEBE = 3.2;

    return {
        insulin: calculatedInsulin,
        XEBE: calculatedXEBE,
    };
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