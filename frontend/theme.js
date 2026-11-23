// Exam Guard — light / dark theme.
// Loaded in <head> so the saved theme applies before the page paints.
// The choice is remembered per browser; until the user picks one, the
// system preference is followed.

(function () {

    var KEY = "eg-theme";
    var root = document.documentElement;

    function stored() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function system() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function apply(theme) {
        root.setAttribute("data-theme", theme);
    }

    function current() {
        return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    apply(stored() || system());

    var SUN = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    var MOON = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

    function render(button) {
        var dark = current() === "dark";
        var label = dark ? "Switch to light mode" : "Switch to dark mode";
        button.innerHTML = dark ? SUN : MOON;
        button.setAttribute("aria-label", label);
        button.title = label;
    }

    function mount() {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "theme-toggle";

        button.addEventListener("click", function () {
            var next = current() === "dark" ? "light" : "dark";
            apply(next);
            try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
            render(button);
        });

        render(button);

        var profile = document.querySelector(".topbar .profile");
        var appbar = document.querySelector(".appbar-inner");

        if (profile) {
            // Dashboards: sits next to the profile chip
            var actions = document.createElement("div");
            actions.className = "topbar-actions";
            profile.parentNode.insertBefore(actions, profile);
            actions.appendChild(button);
            actions.appendChild(profile);
        } else if (appbar) {
            // Inner pages: right end of the top bar
            appbar.appendChild(button);
        } else {
            // Sign-in, register, verify, invitation
            button.classList.add("floating");
            document.body.appendChild(button);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mount);
    } else {
        mount();
    }

    // Follow system changes only while the user hasn't chosen explicitly.
    if (window.matchMedia) {
        var query = window.matchMedia("(prefers-color-scheme: dark)");
        var onChange = function () {
            if (stored()) return;
            apply(system());
            var button = document.querySelector(".theme-toggle");
            if (button) render(button);
        };
        if (query.addEventListener) query.addEventListener("change", onChange);
    }

})();
