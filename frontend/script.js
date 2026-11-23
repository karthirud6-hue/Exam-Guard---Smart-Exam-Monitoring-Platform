// Login page logic. Requires auth.js (API_BASE, ROLE_HOME, saveSession).

const GOOGLE_CLIENT_ID = "966807112657-k4i8k6rrcu0lltq5c3uujj5g8cicghhf.apps.googleusercontent.com";

// Read the username out of the JWT the backend returned.
function usernameFromToken(token) {
    try {
        const payload = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        return JSON.parse(atob(payload)).username || "";
    } catch (error) {
        return "";
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    const googleMessage = document.getElementById("googleMessage");

    // Common handler for password and Google login responses.
    function handleLoginSuccess(data) {

        if (!data.access_token || !ROLE_HOME[data.role]) {
            throw new Error("Invalid authentication response.");
        }

        saveSession(
            data.access_token,
            data.role,
            usernameFromToken(data.access_token)
        );

        window.location.href = ROLE_HOME[data.role];
    }

    // EMAIL / USERNAME AND PASSWORD LOGIN
    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const identifier = document.getElementById("email")
            .value.trim();

        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;
        const button = loginForm.querySelector("button[type='submit']");

        // Registered students log in with email; test accounts use a username.
        const credentials = identifier.includes("@")
            ? { email: identifier.toLowerCase() }
            : { username: identifier };

        loginMessage.textContent = "";
        button.disabled = true;
        button.textContent = "Signing in...";

        try {

            const response = await fetch(API_BASE + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...credentials,
                    password: password,
                    role: role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Rate limit and validation errors don't use a plain string.
                const detail = typeof data.detail === "string"
                    ? data.detail
                    : (data.error || "Login failed.");

                throw new Error(detail);
            }

            handleLoginSuccess(data);

        } catch (error) {

            loginMessage.textContent = error.message === "Failed to fetch"
                ? "Cannot reach the server. Make sure the backend is running on port 8000."
                : error.message;

        } finally {

            button.disabled = false;
            button.innerHTML = 'Sign In <span>→</span>';

        }

    });


    // GOOGLE SIGN-IN CALLBACK
    window.handleGoogleCredentialResponse = async function (response) {

        const role = document.getElementById("role").value;

        if (!role) {
            googleMessage.textContent = "Please select your role first.";
            return;
        }

        googleMessage.textContent = "Authenticating with ExamGuard...";

        try {

            const result = await fetch(API_BASE + "/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    credential: response.credential,
                    role: role
                })
            });

            const data = await result.json();

            if (!result.ok) {
                throw new Error(
                    typeof data.detail === "string"
                        ? data.detail
                        : "Google login failed."
                );
            }

            handleLoginSuccess(data);

        } catch (error) {

            googleMessage.textContent = error.message;

        }

    };


    // INITIALIZE GOOGLE IDENTITY SERVICES
    function initializeGoogleSignIn() {

        const container = document.getElementById("googleButtonContainer");

        if (!window.google || !window.google.accounts) {
            googleMessage.textContent =
                "Google Sign-In could not be loaded.";
            return;
        }

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: window.handleGoogleCredentialResponse
        });

        window.google.accounts.id.renderButton(
            container,
            {
                theme: "outline",
                size: "large",
                text: "continue_with",
                shape: "rect",
                width: 280
            }
        );

    }

    // The Google library loads asynchronously.
    const googleScript = document.getElementById("google-identity");

    if (window.google && window.google.accounts) {
        initializeGoogleSignIn();
    } else {
        googleScript.addEventListener("load", initializeGoogleSignIn);
        googleScript.addEventListener("error", function () {
            googleMessage.textContent =
                "Unable to load Google Sign-In.";
        });
    }

});
