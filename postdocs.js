const FALLBACK_POSTDOCS = [
  {
    uni: "Stanford University",
    rg: "Computational Seismology / Earthquake Physics",
    dl: "2025-01-15",
    link: "https://example.com/stanford-postdoc",
  },
  {
    uni: "Caltech",
    rg: "Seismic Imaging & Inversion",
    dl: "2025-02-01",
    link: "https://example.com/caltech-postdoc",
  },
  {
    uni: "UC Berkeley",
    rg: "Distributed Acoustic Sensing (DAS)",
    dl: "open",
    link: "https://example.com/berkeley-postdoc",
  },
];

let postdocs = [];
let currentSortCol = null;
let sortAsc = true;

const tbody = document.querySelector("#postdocTable tbody");
const searchInput = document.getElementById("searchInput");

/* ---------- LOAD DATA ---------- */
async function loadPostdocs() {
  try {
    const res = await fetch("postdocs.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Empty dataset");
    }

    postdocs = data;
  } catch (err) {
    console.warn("Using built-in dataset because postdocs.json could not be loaded.", err);
    postdocs = [...FALLBACK_POSTDOCS];
  }

  postdocs.sort((a, b) => deadlineValue(a.dl) - deadlineValue(b.dl));
  renderTable(postdocs);
}

/* ---------- RENDER TABLE ---------- */
function renderTable(data) {
  tbody.innerHTML = "";

  data.forEach(p => {
    const row = document.createElement("tr");

    const countdown = getCountdown(p.dl);

    row.innerHTML = `
        <td>${p.uni}</td>
        <td>${p.rg}</td>
        <td class="${countdown.class}">
          ${p.dl}
          ${countdown.text ? `<span class="countdown">${countdown.text}</span>` : ""}
        </td>
        <td>
          ${p.link
            ? `<a href="${p.link}" target="_blank" rel="noopener">Apply ↗</a>`
            : "—"}
        </td>
      `;

    tbody.appendChild(row);
  });
}

/* ---------- SEARCH ---------- */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const filtered = postdocs.filter(p =>
    p.uni.toLowerCase().includes(q) ||
    p.rg.toLowerCase().includes(q)
  );
  renderTable(filtered);
});

/* ---------- SORT ---------- */
function sortTable(colIndex) {
  const keys = ["uni", "rg", "dl"];

  if (currentSortCol === colIndex) {
    sortAsc = !sortAsc;
  } else {
    currentSortCol = colIndex;
    sortAsc = true;
  }

  postdocs.sort((a, b) => {
    if (colIndex === 2) {
      // Deadline column → date-aware sort
      return sortAsc
        ? deadlineValue(a.dl) - deadlineValue(b.dl)
        : deadlineValue(b.dl) - deadlineValue(a.dl);
    }

    const A = a[keys[colIndex]].toLowerCase();
    const B = b[keys[colIndex]].toLowerCase();
    return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
  });

  renderTable(postdocs);
}

function deadlineValue(dl) {
  if (!dl || dl.toLowerCase() === "open") return Infinity;
  const time = new Date(dl).getTime();
  return Number.isNaN(time) ? Infinity : time;
}

/* ---------- DEADLINE COLOR LOGIC ---------- */
function getCountdown(dl) {
  if (!dl || dl.toLowerCase() === "open") {
    return { text: "", class: "" };
  }

  const today = new Date();
  const deadline = new Date(dl);
  const diffMs = deadline - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Expired", class: "deadline-soon" };
  }

  if (diffDays <= 7) {
    return { text: `${diffDays} days left`, class: "deadline-soon" };
  }

  if (diffDays <= 14) {
    return { text: `${diffDays} days left`, class: "deadline-mid" };
  }

  return { text: `${diffDays} days left`, class: "deadline-ok" };
}

/* ---------- INIT ---------- */
loadPostdocs();
