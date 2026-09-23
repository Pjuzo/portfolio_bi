

const state = {
    data: null,
    activeFilter: "all"
};

init();

async function init() {
    try {
        const res = await fetch('data.json?t=' + new Date().getTime());
        if (!res.ok) throw new Error(`Failed to load data.json (${res.status})`);
        state.data = await res.json();
    } catch (err) {
        console.error(err);
        document.querySelector(".hero-summary").textContent =
            "Could not load data.json. If you opened this file directly in the browser, " +
            "run a local server instead (e.g. `python3 -m http.server`) and open the shown URL.";
        return;
    }

    renderProfile(state.data.profile);
    renderFilters(state.data.projects);
    renderProjects(state.data.projects);
    renderChart(state.data.chart);
    renderTimeline(state.data.projects);
}

// ---------- Profile ----------
function renderProfile(profile) {
    if (!profile) return;
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-role").textContent = profile.role;
    document.getElementById("profile-summary").textContent = profile.summary;
}

// ---------- Filters ----------
function renderFilters(projects) {
    const categories = ["all", ...new Set(projects.map(p => p.category))];
    const container = document.getElementById("filters");
    container.innerHTML = "";

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "filter-btn" + (cat === "all" ? " is-active" : "");
        btn.dataset.filter = cat;
        btn.textContent = capitalize(cat);
        btn.addEventListener("click", () => {
            state.activeFilter = cat;
            document
                .querySelectorAll(".filter-btn")
                .forEach(b => b.classList.toggle("is-active", b.dataset.filter === cat));
            applyFilter();
        });
        container.appendChild(btn);
    });
}

function applyFilter() {
    document.querySelectorAll(".project-card").forEach(card => {
        const matches = state.activeFilter === "all" || card.dataset.category === state.activeFilter;
        card.classList.toggle("is-hidden", !matches);
    });
}

// ---------- Project cards ----------
function renderProjects(projects) {
    const grid = document.getElementById("project-grid");
    grid.innerHTML = "";

    projects.forEach(p => {
        const hasDetail = Boolean(p.detailUrl);
        const categ=p.category
        const card = document.createElement(hasDetail ? "a" : "article");
        card.className = "project-card" + (hasDetail ? " has-detail" : "");
        card.dataset.category = p.category;
        if (hasDetail) {
            card.href = p.detailUrl;
        }

        const tags = (p.tools || [])
            .map(t => `<li class="tag">${escapeHtml(t)}</li>`)
            .join("");

        // const metrics = Object.entries(p.metrics || {})
        //     .map(([k, v]) => `<span><strong>${escapeHtml(v)}</strong>${escapeHtml(k)}</span>`)
        //     .join("");

        const viewDetail = hasDetail & categ==='dashboard'
            ? `<span class="view-detail">View dashboard &rarr;</span>`
            : "";

        const viewSQL = categ==='analysis'|| categ==='SQL' ?`<span class="view-detail">View SQL &rarr;</span>`
            : "";

        card.innerHTML = `
<h3>${escapeHtml(p.title)}</h3>
<p>${escapeHtml(p.description)}</p>
<ul class="tag-list">${tags}</ul>
${viewDetail}
${viewSQL}
`;
        grid.appendChild(card);
    });
}

// // ---------- Bar chart (plain SVG, no libraries) ----------
// function renderChart(chart) {
//     if (!chart) return;
//     document.getElementById("chart-title").textContent = chart.title;

//     const svg = document.getElementById("bar-chart");
//     const width = 320;
//     const height = 220;
//     const paddingBottom = 30;
//     const paddingTop = 10;
//     const chartHeight = height - paddingBottom - paddingTop;

//     const bars = chart.bars || [];
//     const maxValue = Math.max(...bars.map(b => b.value), 1);
//     const barWidth = 60;
//     const gap = 30;
//     const startX = 20;

//     svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
//     svg.innerHTML = ""; // clear

//     // baseline axis
//     const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     axis.setAttribute("x1", 0);
//     axis.setAttribute("y1", height - paddingBottom);
//     axis.setAttribute("x2", width);
//     axis.setAttribute("y2", height - paddingBottom);
//     axis.setAttribute("class", "axis-line");
//     svg.appendChild(axis);

//     const baseline = height - paddingBottom;
//     const barEls = []; // { rect, value, targetHeight, targetY }

//     bars.forEach((bar, i) => {
//         const targetHeight = (bar.value / maxValue) * chartHeight;
//         const targetY = baseline - targetHeight;
//         const x = startX + i * (barWidth + gap);

//         // Start every bar at height 0, sitting on the baseline —
//         // the transition to targetHeight/targetY is triggered below.
//         const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//         rect.setAttribute("x", x);
//         rect.setAttribute("y", baseline);
//         rect.setAttribute("width", barWidth);
//         rect.setAttribute("height", 0);
//         rect.setAttribute("class", "bar");
//         rect.setAttribute("rx", 3);
//         rect.style.transitionDelay = `${i * 100}ms`;

//         const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
//         title.textContent = `${bar.label}: ${bar.value} ${chart.unit || ""}`;
//         rect.appendChild(title);
//         svg.appendChild(rect);

//         // Value label fades/rises in alongside the bar rather than
//         // popping in instantly, so it starts pinned to the baseline too.
//         const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
//         value.setAttribute("x", x + barWidth / 2);
//         value.setAttribute("y", baseline - 6);
//         value.setAttribute("text-anchor", "middle");
//         value.setAttribute("class", "bar-value");
//         value.style.opacity = "0";
//         value.style.transition = "y 0.6s ease, opacity 0.4s ease";
//         value.style.transitionDelay = `${i * 100 + 200}ms`;
//         value.textContent = bar.value;
//         svg.appendChild(value);

//         const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
//         label.setAttribute("x", x + barWidth / 2);
//         label.setAttribute("y", height - paddingBottom + 14);
//         label.setAttribute("text-anchor", "middle");
//         label.setAttribute("class", "bar-label");
//         label.textContent = bar.label;
//         svg.appendChild(label);

//         barEls.push({ rect, value, targetHeight, targetY, valueY: targetY - 6 });
//     });

//     // Two animation frames: the first lets the browser paint the
//     // height:0 state, the second applies the real values so the CSS
//     // transition (defined on .bar in style.css) actually animates
//     // instead of jumping straight to the final size.
//     requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//             barEls.forEach(({ rect, value, targetHeight, targetY, valueY }) => {
//                 rect.setAttribute("height", targetHeight);
//                 rect.setAttribute("y", targetY);
//                 value.setAttribute("y", valueY);
//                 value.style.opacity = "1";
//             });
//         });
//     });
// }

// // ---------- Timeline (horizontal SVG, spaced proportionally by date) ----------
// function renderTimeline(projects) {
//     const svg = document.getElementById("timeline-svg");
//     svg.innerHTML = "";

//     const sorted = [...projects].sort((a, b) => new Date(a.date) - new Date(b.date));
//     if (sorted.length === 0) return;

//     const width = 700;
//     const height = 200;
//     const midY = height / 2;
//     const padding = 60; // left/right margin so end labels don't clip

//     const times = sorted.map(p => new Date(p.date).getTime());
//     const minTime = Math.min(...times);
//     const maxTime = Math.max(...times);
//     const span = maxTime - minTime;

//     svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

//     // x position proportional to how far along the date range each
//     // project falls; if every date is identical, spread evenly instead
//     // of dividing by zero.
//     const xFor = time =>
//         span === 0
//             ? padding + ((width - 2 * padding) * 0.5)
//             : padding + ((time - minTime) / span) * (width - 2 * padding);

//     // baseline axis
//     const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     axis.setAttribute("x1", padding);
//     axis.setAttribute("y1", midY);
//     axis.setAttribute("x2", width - padding);
//     axis.setAttribute("y2", midY);
//     axis.setAttribute("class", "timeline-axis");
//     svg.appendChild(axis);

//     sorted.forEach((p, i) => {
//         const x = xFor(new Date(p.date).getTime());
//         const above = i % 2 === 0; // alternate label position to reduce crowding
//         const labelY = above ? midY - 24 : midY + 40;
//         const connectorY2 = above ? midY - 8 : midY + 8;

//         const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
//         group.setAttribute("class", "timeline-node");

//         const connector = document.createElementNS("http://www.w3.org/2000/svg", "line");
//         connector.setAttribute("x1", x);
//         connector.setAttribute("y1", midY);
//         connector.setAttribute("x2", x);
//         connector.setAttribute("y2", connectorY2);
//         connector.setAttribute("class", "timeline-connector");
//         group.appendChild(connector);

//         const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//         circle.setAttribute("cx", x);
//         circle.setAttribute("cy", midY);
//         circle.setAttribute("r", 6);
//         circle.setAttribute("class", "timeline-dot");
//         const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
//         title.textContent = `${p.title} — ${p.description}`;
//         circle.appendChild(title);
//         group.appendChild(circle);

//         const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
//         dateText.setAttribute("x", x);
//         dateText.setAttribute("y", above ? labelY - 14 : labelY + 28);
//         dateText.setAttribute("text-anchor", "middle");
//         dateText.setAttribute("class", "timeline-date-label");
//         dateText.textContent = formatDate(p.date);
//         group.appendChild(dateText);

//         const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
//         titleText.setAttribute("x", x);
//         titleText.setAttribute("y", labelY);
//         titleText.setAttribute("text-anchor", "middle");
//         titleText.setAttribute("class", "timeline-title-label");
//         titleText.textContent = p.title;
//         group.appendChild(titleText);

//         svg.appendChild(group);
//     });
// }

// ---------- Helpers ----------
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

///////вставка для старого html
// // small helper: open modal and set iframe src from button's data-embed
// function openDashboard(btn) {
//     var url = btn.getAttribute('data-embed');
//     if (!url || url.indexOf('PLACEHOLDER') > -1) {
//         alert('Replace the data-embed attribute with your Power BI Publish-to-Web URL or other embed URL (check comments in the HTML).');
//         return;
//     }
//     var modal = document.getElementById('modal');
//     var frame = document.getElementById('embedFrame');
//     frame.src = url;
//     modal.classList.add('show');
//     modal.setAttribute('aria-hidden', 'false');
// }
// function closeDashboard() {
//     var modal = document.getElementById('modal');
//     var frame = document.getElementById('embedFrame');
//     frame.src = 'about:blank';
//     modal.classList.remove('show');
//     modal.setAttribute('aria-hidden', 'true');
// }
// // download case study demo (replace with real files or GitHub links)
// function downloadCaseStudy(event, filename) {
//     event.preventDefault();
//     alert('This demo triggers a download. Replace this function with a real file link or GitHub path.');
// }
// document.getElementById('year').textContent = new Date().getFullYear();

// // Accessibility: close modal with ESC
// document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDashboard(); });