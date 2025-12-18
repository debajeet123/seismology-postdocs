const FALLBACK_POSTDOCS = typeof window !== "undefined" && Array.isArray(window.FALLBACK_POSTDOCS)
  ? window.FALLBACK_POSTDOCS
  : [];

let postdocs = [];
let currentSortCol = null;
let sortAsc = true;

const tbody = document.querySelector("#postdocTable tbody");
const searchInput = document.getElementById("searchInput");

/* ---------- HELPERS ---------- */
function deadlineValue(dl) {
  if (!dl || dl.toLowerCase() === "open") return Infinity;
  const time = Date.parse(dl);
  return Number.isNaN(time) ? Infinity : time;
}

function renderError(message) {
  tbody.innerHTML = `
    <tr>
      <td colspan="4" class="status-message">${message}</td>
    </tr>
  `;
}

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
    if (postdocs.length === 0) {
      renderError("Unable to load opportunities right now. Please try again later.");
      return;
    }
  }

  postdocs.sort((a, b) => deadlineValue(a.dl) - deadlineValue(b.dl));
  renderTable(postdocs);
}

/* ---------- RENDER TABLE ---------- */
row.innerHTML = `
  <td>${esc(p.uni)}</td>
  <td>${esc(p.rg)}</td>
  <td class="${countdown.class}">
    ${esc(p.dl)}
    ${countdown.text ? `<span class="countdown">${countdown.text}</span>` : ""}
  </td>
  <td>
    ${p.link
      ? `<a href="${p.link}" target="_blank" rel="noopener">Apply ↗</a>`
      : "—"}
  </td>
`;


/* ---------- SEARCH ---------- */
if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      const filtered = postdocs.filter(p =>
        p.uni.toLowerCase().includes(q) ||
        p.rg.toLowerCase().includes(q)
      );
      renderTable(filtered);
    });
  }
  

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

/* ---------- DEADLINE COLOR LOGIC ---------- */
function getCountdown(dl) {
  if (!dl || dl.toLowerCase() === "open") {
    return { text: "", class: "" };
  }

  const deadline = new Date(dl + "T00:00:00");

  if (Number.isNaN(deadline.getTime())) {
    return { text: "", class: "" };
  }

  const today = new Date();
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


function esc(str = "") {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  