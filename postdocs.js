let postdocs = [];
let currentSortCol = null;
let sortAsc = true;

const tbody = document.querySelector("#postdocTable tbody");
const searchInput = document.getElementById("searchInput");

/* ---------- HELPERS ---------- */
function deadlineValue(dl) {
  if (!dl || dl.toLowerCase() === "open") {
    return Infinity;
  }
  const parsed = new Date(dl);
  return isNaN(parsed) ? Infinity : parsed;
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
    const res = await fetch("postdocs.json");
    if (!res.ok) {
      throw new Error(`Failed to load opportunities (status ${res.status})`);
    }

    postdocs = await res.json();
    postdocs.sort((a, b) => deadlineValue(a.dl) - deadlineValue(b.dl));
    renderTable(postdocs);
  } catch (err) {
    renderError("Unable to load opportunities right now. Please try again later.");
    console.error(err);
  }
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
      const da = deadlineValue(a.dl);
      const db = deadlineValue(b.dl);
      return sortAsc ? da - db : db - da;
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

  const deadline = new Date(dl);
  if (isNaN(deadline)) {
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
