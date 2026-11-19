document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();

        const password = document.getElementById("password").value;

        const role = document.getElementById("role").value;

        // Student login
        if (
            role === "student" &&
            email === "student@example.com" &&
            password === "12345"
        ) {
            alert("Login Successful! Welcome, Student!");
            window.location.href = "dashboard.html";
        }

        // Examiner login
        else if (
            role === "examiner" &&
            email === "examiner@example.com" &&
            password === "12345"
        ) {
            alert("Login Successful! Welcome, Examiner!");
            window.location.href = "examiner.html";
        }

        // Admin login
        else if (
            role === "admin" &&
            email === "admin@example.com" &&
            password === "12345"
        ) {
            alert("Login Successful! Welcome, Admin!");
            window.location.href = "admin.html";
        }

        else {
            alert("Invalid Email, Password or Role!");
        }

    });

});