document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const BASE_URL = "https://kursach-x0h1.onrender.com"; // Используем Render-сервер

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Отправка данных регистрации:", { username, email, password });

            try {
                const response = await fetch(`${BASE_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                const result = await response.json();
                console.log("Ответ сервера:", result);

                if (response.ok) {
                    alert("Регистрация прошла успешно!");
                    window.location.href = "/login.html"; // Переход на страницу входа
                } else {
                    alert(result.message || "Ошибка регистрации");
                }
            } catch (error) {
                console.error("Ошибка запроса:", error);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            console.log("Отправка данных входа:", { email, password });

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();
                console.log("Ответ сервера:", result);

                if (response.ok) {
                    alert("Вход выполнен!");
                    window.location.href = "/dashboard.html"; // Переход на защищенную страницу
                } else {
                    alert(result.message || "Ошибка входа");
                }
            } catch (error) {
                console.error("Ошибка запроса:", error);
            }
        });
    }
});
