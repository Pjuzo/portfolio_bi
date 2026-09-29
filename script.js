

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

