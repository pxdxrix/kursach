const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("./users.db");

// Middleware
app.use(express.json());
app.use(cors());

// Создание таблицы users, если её нет
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

// ✅ Регистрация нового пользователя
app.post("/register", async (req, res) => {
    console.log("Регистрация:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Все поля обязательны" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (row) {
            return res.status(400).json({ message: "Этот email уже используется" });
        }

        db.run(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(500).json({ message: "Ошибка сервера" });
                }
                console.log("Пользователь добавлен:", username, email);
                res.json({ message: "Регистрация успешна!" });
            }
        );
    });
});

// ✅ Вход пользователя
app.post("/login", (req, res) => {
    console.log("Вход:", req.body);
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        console.log("Успешный вход:", user.username);
        res.json({ message: `Добро пожаловать, ${user.username}!` });
    });
});

// 🔥 Сервер запускается на порту, который даёт Render
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
