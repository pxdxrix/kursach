const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./users.db');

app.use(express.json());
app.use(cors());
app.post('/register', async (req, res) => {
    console.log('Регистрация:', req.body); // Лог запроса
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, 
        [username, email, hashedPassword], 
        function (err) {
            if (err) {
                return res.status(400).json({ message: 'Email уже используется' });
            }
            console.log('Пользователь добавлен:', username, email);
            res.json({ message: 'Регистрация успешна!' });
        }
    );
});

app.post('/login', (req, res) => {
    console.log('Вход:', req.body); // Лог запроса
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        console.log('Успешный вход:', user.username);
        res.json({ message: `Добро пожаловать, ${user.username}!` });
    });
});
console.log("Запускаем сервер...");
app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});