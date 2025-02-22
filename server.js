const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();
const { Client } = require("pg");

const app = express();

// Подключение к PostgreSQL
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Для Render
});

client.connect()
    .then(() => console.log("✅ Подключение к PostgreSQL успешно"))
    .catch(err => console.error("❌ Ошибка подключения к БД", err));

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Создание таблицы, если её нет
client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`).then(() => console.log("✅ Таблица users готова"))
  .catch(err => console.error("❌ Ошибка при создании таблицы", err));

// ✅ Регистрация нового пользователя
app.post("/register", async (req, res) => {
    console.log("Регистрация:", req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Все поля обязательны" });
    }

    try {
        // Проверяем, существует ли email
        const existingUser = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Этот email уже используется" });
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Записываем нового пользователя
        await client.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", 
            [username, email, hashedPassword]);

        console.log("✅ Пользователь добавлен:", username, email);
        res.json({ message: "Регистрация успешна!" });

    } catch (error) {
        console.error("❌ Ошибка регистрации", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Вход пользователя
app.post("/login", async (req, res) => {
    console.log("Вход:", req.body);
    const { email, password } = req.body;

    try {
        const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        console.log("✅ Успешный вход:", user.username);
        res.json({ message: `Добро пожаловать, ${user.username}!` });

    } catch (error) {
        console.error("❌ Ошибка входа", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// 🔥 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("🚀 Сервер работает!");
});

