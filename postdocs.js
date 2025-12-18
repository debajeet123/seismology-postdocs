const FALLBACK_POSTDOCS =
  typeof window !== "undefined" && Array.isArray(window.FALLBACK_POSTDOCS)
    ? window.FALLBACK_POSTDOCS
    : [];

let postdocs = [];
let currentSortCol = null;
let sortAsc = true;

const tbody = document.querySelector("#postdocTable tbody");
const searchInput = document.getElementById("searchInput");

/* ---------- HELPERS ---------- */
function esc(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function deadlineValue(dl) {
  if (!dl || dl.toLowerCase() === "open") return Infinity;
  const t = Date.parse(dl);
  return Number.isNaN(t) ? Infinity : t;
}

function getCountdown(dl) {
  if (!dl || dl.toLowerCase() === "open") return { text: "", class: "" };

  const deadline = new Date(dl + "T00:00:00");
  if (Number.isNaN(deadline.getTime())) return { text: "", class: "" };

  const diffDays = Math.ceil(
    (deadline - new Date()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return { text: "Expired", class: "deadline-soon" };
  if (diffDays <= 7) return { text: `${diffDays} days left`, class: "deadline-soon" };
  if (diffDays <= 14) return { text: `${diffDays} days left`, class: "deadline-mid" };
  return { text: `${diffDays} days left`, class: "deadline-ok" };
}

/* ---------- DETAILS TOGGLE ---------- */
function attachDetailHandlers() {
  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      const open = target.style.display === "table-row";
      target.style.display = open ? "none" : "table-row";
      btn.textContent = open ? "Details" : "Hide";
    });
  });
}

/* ---------- RENDER TABLE ---------- */
function renderTable(data) {
  tbody.innerHTML = "";

  data.forEach((p, idx) => {
    const countdown = getCountdown(p.dl);
    const detailsId = `details-${idx}`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${esc(p.uni)}</td>
      <td>${esc(p.rg)}</td>
      <td class="${countdown.class}">
        ${esc(p.dl)}
        ${countdown.text ? `<span class="countdown">${countdown.text}</span>` : ""}
      </td>
      <td>
        ${p.details ? `<button class="details-btn" data-target="${detailsId}">Details</button>` : "—"}
      </td>
    `;
    tbody.appendChild(row);

    if (p.details) {
      const detailsRow = document.createElement("tr");
      detailsRow.id = detailsId;
      detailsRow.style.display = "none";
      detailsRow.innerHTML = `
        <td colspan="4">
          <div class="details-box">
            ${p.details.summary ? `<p><strong>Summary:</strong> ${esc(p.details.summary)}</p>` : ""}
            ${p.details.pi ? `<p><strong>PI:</strong> ${esc(p.details.pi)}</p>` : ""}
            ${Array.isArray(p.details.keywords)
              ? `<p><strong>Keywords:</strong> ${p.details.keywords.map(esc).join(", ")}</p>`
              : ""}
            ${p.details.notes ? `<p><strong>Notes:</strong> ${esc(p.details.notes)}</p>` : ""}
          </div>
        </td>
      `;
      tbody.appendChild(detailsRow);
    }
  });

  attachDetailHandlers();
}

/* ---------- LOAD DATA ---------- */
async function loadPostdocs() {
  try {
    const res = await fetch("postdocs.json", { cache: "no-cache" });
    if (!res.ok) throw new Error();
    postdocs = await res.json();
    if (!Array.isArray(postdocs)) throw new Error();
  } catch {
    postdocs = [...FALLBACK_POSTDOCS];
  }

  postdocs.sort((a, b) => deadlineValue(a.dl) - deadlineValue(b.dl));
  renderTable(postdocs);
}

/* ---------- SEARCH ---------- */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    renderTable(
      postdocs.filter(p =>
        p.uni.toLowerCase().includes(q) ||
        p.rg.toLowerCase().includes(q)
      )
    );
  });
}

/* ---------- SORT ---------- */
function sortTable(colIndex) {
  const keys = ["uni", "rg", "dl"];

  if (currentSortCol === colIndex) sortAsc = !sortAsc;
  else {
    currentSortCol = colIndex;
    sortAsc = true;
  }

  postdocs.sort((a, b) =>
    colIndex === 2
      ? sortAsc
        ? deadlineValue(a.dl) - deadlineValue(b.dl)
        : deadlineValue(b.dl) - deadlineValue(a.dl)
      : sortAsc
        ? a[keys[colIndex]].localeCompare(b[keys[colIndex]])
        : b[keys[colIndex]].localeCompare(a[keys[colIndex]])
  );

  renderTable(postdocs);
}

/* ---------- INIT ---------- */
loadPostdocs();
