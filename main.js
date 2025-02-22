document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = "https://kursach-x0h1.onrender.com"; // Сервер на Render
    const container = document.querySelector(".container");
    const registerBtn = document.querySelector(".toggle-panel .register-btn");
    const loginBtn = document.querySelector(".toggle-panel .login-btn");
    const registerForm = document.querySelector(".form-box.register form");
    const loginForm = document.querySelector(".form-box.login form");

    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            container.classList.add("active");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            container.classList.remove("active");
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const username = registerForm.querySelector("input[placeholder='Имя']").value;
            const email = registerForm.querySelector("input[placeholder='Email']").value;
            const password = registerForm.querySelector("input[placeholder='Пароль']").value;

            try {
                const response = await fetch(`${BASE_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password })
                });

                const result = await response.json();
                alert(result.message || "Регистрация прошла успешно!");

                if (response.ok) {
                    window.location.href = "login.html"; // Переход на страницу входа
                }
            } catch (error) {
                console.error("Ошибка запроса:", error);
                alert("Ошибка регистрации. Попробуйте позже.");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = loginForm.querySelector("input[placeholder='Имя']").value;
            const password = loginForm.querySelector("input[placeholder='Пароль']").value;

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                alert(result.message || "Вход выполнен!");

                if (response.ok) {
                    window.location.href = "dashboard.html"; // Переход на защищенную страницу
                }
            } catch (error) {
                console.error("Ошибка запроса:", error);
                alert("Ошибка входа. Попробуйте позже.");
            }
        });
    }
});
