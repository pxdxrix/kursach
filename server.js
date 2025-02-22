const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./users.db');

// Middleware для парсинга JSON
app.use(express.json());
app.use(cors());

// Регистрация нового пользователя
app.post('/register', async (req, res) => {
    console.log('Регистрация:', req.body); // Лог запроса

    const { username, email, password } = req.body;

    // Проверка на пустые поля
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны' });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Проверка на уникальность email
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (row) {
            return res.status(400).json({ message: 'Этот email уже используется' });
        }

        // Вставка нового пользователя в базу данных
        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, 
            [username, email, hashedPassword], 
            function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Ошибка сервера, попробуйте позже' });
                }
                console.log('Пользователь добавлен:', username, email);
                res.json({ message: 'Регистрация успешна!' });
            }
        );
    });
});

// Вход пользователя
app.post('/login', (req, res) => {
    console.log('Вход:', req.body); // Лог запроса
    const { email, password } = req.body;

    // Поиск пользователя по email
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        // Сравнение паролей
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        console.log('Успешный вход:', user.username);
        res.json({ message: `Добро пожаловать, ${user.username}!` });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
