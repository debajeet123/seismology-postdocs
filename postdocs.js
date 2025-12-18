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
    function renderTable(data) {
        tbody.innerHTML = "";
      
        data.forEach((p, idx) => {
          const countdown = getCountdown(p.dl);
          const detailsId = `details-${idx}`;
      
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${p.uni}</td>
            <td>${p.rg}</td>
            <td class="${countdown.class}">
              ${p.dl}
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
            detailsRow.className = "details-row";
            detailsRow.style.display = "none";
      
            detailsRow.innerHTML = `
              <td colspan="4">
                <div class="details-box">
                  ${p.details.summary ? `<p><strong>Summary:</strong> ${p.details.summary}</p>` : ""}
                  ${p.details.pi ? `<p><strong>PI:</strong> ${p.details.pi}</p>` : ""}
                  ${Array.isArray(p.details.keywords)
                    ? `<p><strong>Keywords:</strong> ${p.details.keywords.join(", ")}</p>`
                    : ""}
                  ${p.details.notes ? `<p><strong>Notes:</strong> ${p.details.notes}</p>` : ""}
                </div>
              </td>
            `;
      
            tbody.appendChild(detailsRow);
          }
        });
      
        attachDetailHandlers();
      }
      
    postdocs = data;

  } 
  function attachDetailHandlers() {
    document.querySelectorAll(".details-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.target);
        const isOpen = target.style.display === "table-row";
  
        target.style.display = isOpen ? "none" : "table-row";
        btn.textContent = isOpen ? "Details" : "Hide";
      });
    });
  }
  catch (err) {
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
  