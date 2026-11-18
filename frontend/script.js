
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");
    const loginButton = document.getElementById("loginButton");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const selectedRole = document.getElementById("role").value;

        message.textContent = "";
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        try {

            const response = await fetch("http://127.0.0.1:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Login failed.");
            }

            if (data.role !== selectedRole) {
                throw new Error("The selected role does not match your account.");
            }

            sessionStorage.setItem("access_token", data.access_token);
            sessionStorage.setItem("user_role", data.role);

            alert("Login successful! Welcome, " + data.role + "!");

            if (data.role === "student") {
                window.location.href = "dashboard.html";
            }
            else if (data.role === "examiner") {
                window.location.href = "Examiner.html";
            }
            else if (data.role === "admin") {
                window.location.href = "Admin.html";
            }

        } catch (error) {

            message.textContent = error.message;

        } finally {

            loginButton.disabled = false;
            loginButton.textContent = "Login";

        }

    });

});
