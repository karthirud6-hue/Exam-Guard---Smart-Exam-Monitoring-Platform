// Shared authentication helpers for Exam Guard.
// The backend runs on port 8000 of the same host that serves the frontend.

const API_BASE = "http://" + window.location.hostname + ":8000";

const ROLE_HOME = {
    student: "dashboard.html",
    examiner: "Examiner.html",
    admin: "Admin.html"
};

function getToken() {
    return sessionStorage.getItem("accessToken");
}

function getRole() {
    return sessionStorage.getItem("userRole");
}

function saveSession(token, role, username) {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("username", username);
}

function clearSession() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("username");
}

function logout() {
    clearSession();
    window.location.href = "login.html";
}

// Protect a page: only the given roles may view it.
// The page is hidden until the backend confirms the token.
function requireRole(...allowedRoles) {

    document.documentElement.style.visibility = "hidden";

    const token = getToken();
    const role = getRole();

    if (!token || !role) {
        logout();
        return;
    }

    if (!allowedRoles.includes(role)) {
        alert("You are not authorized to access this page.");
        window.location.href = ROLE_HOME[role] || "login.html";
        return;
    }

    // The backend checks the token's signature, expiry and role.
    fetch(API_BASE + "/" + role + "/dashboard", {
        headers: { "Authorization": "Bearer " + token }
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Session invalid");
            }
            document.documentElement.style.visibility = "";
        })
        .catch(function () {
            alert("Your session has expired or the server is unreachable. Please log in again.");
            logout();
        });
}
