// Exam Guard — small, dependency-free charts.
// Reads the same localStorage data the pages already use and renders
// an average-score ring, a recent-attempts bar chart and inline score bars.

(function () {

    function pct(value) {
        const n = parseFloat(value);
        return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
    }

    function read(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    // Results saved by exam.html carry `percentage`; older entries may be plain numbers.
    function percentOf(item) {
        if (typeof item === "number") return pct(item);
        return pct(item && (item.percentage ?? item.score));
    }

    /* ---------- Tooltip ---------- */

    let tip = null;

    function tooltip() {
        if (!tip) {
            tip = document.createElement("div");
            tip.className = "chart-tip";
            tip.setAttribute("role", "tooltip");
            document.body.appendChild(tip);
        }
        return tip;
    }

    function moveTip(x, y) {
        const t = tooltip();
        const box = t.getBoundingClientRect();
        let left = x + 14;
        let top = y + 14;
        if (left + box.width > window.innerWidth - 8) left = x - box.width - 14;
        if (top + box.height > window.innerHeight - 8) top = y - box.height - 14;
        t.style.transform = "translate(" + Math.max(8, left) + "px," + Math.max(8, top) + "px)";
    }

    function showTip(x, y, lines) {
        const t = tooltip();
        t.replaceChildren();
        lines.forEach(function (line, i) {
            const row = document.createElement(i === 0 ? "strong" : "div");
            row.textContent = line;
            t.appendChild(row);
        });
        t.classList.add("show");
        moveTip(x, y);
    }

    function hideTip() {
        if (tip) tip.classList.remove("show");
    }

    /* ---------- Ring meter ---------- */

    function renderRing(el, value, caption) {
        if (!el) return;
        const p = pct(value);
        const r = 42;
        const c = 2 * Math.PI * r;

        el.innerHTML =
            '<svg class="ring" viewBox="0 0 100 100" role="img" aria-label="' + p.toFixed(1) + ' percent">' +
                '<circle class="ring-track" cx="50" cy="50" r="' + r + '"/>' +
                '<circle class="ring-fill" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + c + '"/>' +
            '</svg>' +
            '<div class="ring-label"><strong>' + p.toFixed(0) + '%</strong><small></small></div>';

        el.querySelector("small").textContent = caption || "average";

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                el.querySelector(".ring-fill").style.strokeDashoffset = c * (1 - p / 100);
            });
        });
    }

    /* ---------- Horizontal bar chart (single series, 0–100 %) ---------- */

    function renderBars(el, items, limit) {
        if (!el) return;
        el.replaceChildren();

        const rows = items.slice(-(limit || 8)).reverse();

        if (!rows.length) {
            const empty = document.createElement("p");
            empty.className = "empty";
            empty.textContent = "No attempts yet — completed exams will appear here.";
            el.appendChild(empty);
            return;
        }

        rows.forEach(function (item) {
            const p = percentOf(item);
            const name = (item && item.examName) || "Examination";
            const meta = [item && item.student, item && item.date].filter(Boolean).join(" · ");

            const row = document.createElement("div");
            row.className = "bar-row";
            row.tabIndex = 0;

            const label = document.createElement("div");
            label.className = "bar-label";
            const strong = document.createElement("strong");
            strong.textContent = name;
            label.appendChild(strong);
            if (meta) {
                const small = document.createElement("small");
                small.textContent = meta;
                label.appendChild(small);
            }

            const track = document.createElement("div");
            track.className = "bar-track";
            const fill = document.createElement("div");
            fill.className = "bar-fill";
            track.appendChild(fill);

            const value = document.createElement("span");
            value.className = "bar-value";
            value.textContent = p.toFixed(0) + "%";

            row.append(label, track, value);
            el.appendChild(row);

            const lines = [name];
            if (item && item.student) lines.push("Student: " + item.student);
            if (item && item.score !== undefined) {
                lines.push("Score: " + item.score + (item.totalQuestions ? " / " + item.totalQuestions : ""));
            }
            lines.push("Percentage: " + p.toFixed(2) + "%");
            if (item && item.warnings !== undefined) lines.push("Warnings: " + item.warnings);

            row.setAttribute("aria-label", lines.join(", "));
            row.addEventListener("mouseenter", function (e) { showTip(e.clientX, e.clientY, lines); });
            row.addEventListener("mousemove", function (e) { moveTip(e.clientX, e.clientY); });
            row.addEventListener("mouseleave", hideTip);
            row.addEventListener("focus", function () {
                const b = track.getBoundingClientRect();
                showTip(b.left + b.width * p / 100, b.bottom, lines);
            });
            row.addEventListener("blur", hideTip);

            requestAnimationFrame(function () {
                requestAnimationFrame(function () { fill.style.width = p + "%"; });
            });
        });

        const axis = document.createElement("div");
        axis.className = "bar-axis";
        axis.innerHTML = "<span></span><div><span>0%</span><span>50%</span><span>100%</span></div><span></span>";
        el.appendChild(axis);
    }

    /* ---------- Performance block (ring + stats + bars) ---------- */

    // Fills #avgRing, #perfAttempts, #perfWarnings, #perfPass and #recentBars when present.
    function mountPerformance(storageKey) {
        const items = read(storageKey);
        const percents = items.map(percentOf);
        const avg = percents.length
            ? percents.reduce(function (a, b) { return a + b; }, 0) / percents.length
            : 0;
        const warnings = items.reduce(function (sum, item) {
            return sum + (Number(item && item.warnings) || 0);
        }, 0);
        const passed = percents.filter(function (p) { return p >= 40; }).length;

        renderRing(document.getElementById("avgRing"), avg, "average");

        const set = function (id, text) {
            const node = document.getElementById(id);
            if (node) node.textContent = text;
        };

        set("perfAttempts", String(items.length).padStart(2, "0"));
        set("perfWarnings", String(warnings).padStart(2, "0"));
        set("perfPass", items.length ? Math.round(passed / items.length * 100) + "%" : "—");

        renderBars(document.getElementById("recentBars"), items, 8);
    }

    // Adds a small bar under the text of each cell in the given column (1-based).
    function decoratePercentCells(tbody, column) {
        if (!tbody) return;
        tbody.querySelectorAll("tr").forEach(function (tr) {
            const cell = tr.children[column - 1];
            if (!cell) return;
            const p = pct(cell.textContent);
            const bar = document.createElement("span");
            bar.className = "cell-bar";
            const fill = document.createElement("span");
            fill.style.width = p + "%";
            bar.appendChild(fill);
            cell.appendChild(bar);
        });
    }

    window.ExamCharts = {
        mountPerformance: mountPerformance,
        renderRing: renderRing,
        renderBars: renderBars,
        decoratePercentCells: decoratePercentCells
    };

})();
