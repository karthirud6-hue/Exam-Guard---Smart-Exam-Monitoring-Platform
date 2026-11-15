document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const username = document.querySelector('input[type="text"]').value.trim();

        const password = document.querySelector('input[type="password"]').value;

        const role = document.getElementById("role").value;

        // Student login
        if (
            role === "student" &&
            username === "student" &&
            password === "12345"
        ) {
            alert("Login Successful! Welcome, Student!");
            window.location.href = "dashboard.html";
        }

        // Examiner login
        else if (
            role === "examiner" &&
            username === "examiner" &&
            password === "12345"
        ) {
            alert("Login Successful! Welcome, Examiner!");
            window.location.href = "examiner.html";
        }

        // Admin login
        else if (
            role === "admin" &&
            username === "admin" &&
            password === "12345"
        ) {
            alert("Login Successful! Welcome, Admin!");
            window.location.href = "admin.html";
        }

        else {
            alert("Invalid Username, Password or Role!");
        }

    });

});