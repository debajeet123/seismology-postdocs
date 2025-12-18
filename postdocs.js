let postdocs = [];
let currentSortCol = null;
let sortAsc = true;

const tbody = document.querySelector("#postdocTable tbody");
const searchInput = document.getElementById("searchInput");

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
  const diffDays = Math.ceil(
    (deadline - new Date()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return { text: "Expired", class: "deadline-soon" };
  if (diffDays <= 7) return { text: `${diffDays} days left`, class: "deadline-soon" };
  if (diffDays <= 14) return { text: `${diffDays} days left`, class: "deadline-mid" };
  return { text: `${diffDays} days left`, class: "deadline-ok" };
}

function setLastUpdated(isoDate) {
  const el = document.getElementById("lastUpdated");
  if (!el || !isoDate) return;

  const then = new Date(isoDate + "T00:00:00");
  const days = Math.floor((new Date() - then) / (1000 * 60 * 60 * 24));

  el.textContent =
    days === 0
      ? "Last updated: today"
      : `Last updated: ${days} day${days !== 1 ? "s" : ""} ago`;
}

function renderTable(data) {
  tbody.innerHTML = "";

  data.forEach((p, idx) => {
    const c = getCountdown(p.dl);
    const detailsId = `details-${idx}`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${esc(p.uni)}</td>
      <td>${esc(p.rg)}</td>
      <td class="${c.class}">
        ${esc(p.dl)}
        ${c.text ? `<span class="countdown">${c.text}</span>` : ""}
      </td>
      <td>
        ${p.details ? `<button class="details-btn" data-id="${detailsId}">Details</button>` : "—"}
      </td>
    `;
    tbody.appendChild(row);

    if (p.details) {
      const drow = document.createElement("tr");
      drow.id = detailsId;
      drow.style.display = "none";
      drow.innerHTML = `
        <td colspan="4">
          <div class="details-box">
            ${p.details.summary ? `<p><b>Summary:</b> ${esc(p.details.summary)}</p>` : ""}
            ${p.details.pi ? `<p><b>PI:</b> ${esc(p.details.pi)}</p>` : ""}
            ${Array.isArray(p.details.keywords)
              ? `<p><b>Keywords:</b> ${p.details.keywords.map(esc).join(", ")}</p>`
              : ""}
            ${p.details.notes ? `<p><b>Notes:</b> ${esc(p.details.notes)}</p>` : ""}
          </div>
        </td>
      `;
      tbody.appendChild(drow);
    }
  });

  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.onclick = () => {
      const row = document.getElementById(btn.dataset.id);
      const open = row.style.display === "table-row";
      row.style.display = open ? "none" : "table-row";
      btn.textContent = open ? "Details" : "Hide";
    };
  });
}

async function loadPostdocs() {
  const res = await fetch("postdocs.json", { cache: "no-cache" });
  const json = await res.json();

  postdocs = json.entries || [];
  setLastUpdated(json.last_updated);

  postdocs.sort((a, b) => deadlineValue(a.dl) - deadlineValue(b.dl));
  renderTable(postdocs);
}

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

function sortTable(colIndex) {
  const keys = ["uni", "rg", "dl"];
  sortAsc = currentSortCol === colIndex ? !sortAsc : true;
  currentSortCol = colIndex;

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

loadPostdocs();
