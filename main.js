document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = "https://kursach-x0h1.onrender.com"; // URL сервера на Render

    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");
    const switchToLogin = document.querySelector(".switch-to-login");
    const switchToRegister = document.querySelector(".switch-to-register");

    // Переключение между формами
    if (switchToLogin && switchToRegister) {
        switchToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            registerForm.style.display = "none";
            loginForm.style.display = "block";
        });

        switchToRegister.addEventListener("click", (e) => {
            e.preventDefault();
            loginForm.style.display = "none";
            registerForm.style.display = "block";
        });
    }

    // ✅ Регистрация
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !email || !password) {
                alert("Заполните все поля!");
                return;
            }

            console.log("Отправка данных регистрации:", { username, email, password });

            try {
                const response = await fetch(`${BASE_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                if (!response.ok) throw new Error("Ошибка регистрации");

                const result = await response.json();
                console.log("Ответ сервера:", result);

                alert("✅ Регистрация успешна!");
                window.location.href = "/login.html";
            } catch (error) {
                console.error("❌ Ошибка запроса:", error);
                alert("❌ Не удалось зарегистрироваться.");
            }
        });
    }

    // ✅ Авторизация
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            if (!email || !password) {
                alert("Введите email и пароль!");
                return;
            }

            console.log("Отправка данных входа:", { email, password });

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) throw new Error("Ошибка входа");

                const result = await response.json();
                console.log("Ответ сервера:", result);

                alert("✅ Вход выполнен!");
                window.location.href = "/dashboard.html";
            } catch (error) {
                console.error("❌ Ошибка запроса:", error);
                alert("❌ Неправильный email или пароль.");
            }
        });
    }
});
