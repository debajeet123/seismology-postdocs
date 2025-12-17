let postdocs = [];
let currentSortCol = null;
let sortAsc = true;

const tbody = document.querySelector("#postdocTable tbody");
const searchInput = document.getElementById("searchInput");

/* ---------- LOAD DATA ---------- */
async function loadPostdocs() {
    const res = await fetch("postdocs.json");
    postdocs = await res.json();
    postdocs.sort((a, b) => new Date(a.dl) - new Date(b.dl));
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
      const da = a.dl.toLowerCase() === "open" ? Infinity : new Date(a.dl);
      const db = b.dl.toLowerCase() === "open" ? Infinity : new Date(b.dl);
      return sortAsc ? da - db : db - da;
    }

    const A = a[keys[colIndex]].toLowerCase();
    const B = b[keys[colIndex]].toLowerCase();
    return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
  });

  renderTable(postdocs);
}
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
      const da = a.dl.toLowerCase() === "open" ? Infinity : new Date(a.dl);
      const db = b.dl.toLowerCase() === "open" ? Infinity : new Date(b.dl);
      return sortAsc ? da - db : db - da;
    }

    const A = a[keys[colIndex]].toLowerCase();
    const B = b[keys[colIndex]].toLowerCase();
    return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
  });

  renderTable(postdocs);
}
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
      const da = a.dl.toLowerCase() === "open" ? Infinity : new Date(a.dl);
      const db = b.dl.toLowerCase() === "open" ? Infinity : new Date(b.dl);
      return sortAsc ? da - db : db - da;
    }

    const A = a[keys[colIndex]].toLowerCase();
    const B = b[keys[colIndex]].toLowerCase();
    return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
  });

  renderTable(postdocs);
}
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
      const da = a.dl.toLowerCase() === "open" ? Infinity : new Date(a.dl);
      const db = b.dl.toLowerCase() === "open" ? Infinity : new Date(b.dl);
      return sortAsc ? da - db : db - da;
    }

    const A = a[keys[colIndex]].toLowerCase();
    const B = b[keys[colIndex]].toLowerCase();
    return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
  });

  renderTable(postdocs);
}
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
        const da = a.dl.toLowerCase() === "open" ? Infinity : new Date(a.dl);
        const db = b.dl.toLowerCase() === "open" ? Infinity : new Date(b.dl);
        return sortAsc ? da - db : db - da;
      }
  
      const A = a[keys[colIndex]].toLowerCase();
      const B = b[keys[colIndex]].toLowerCase();
      return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
    });
  
    renderTable(postdocs);
  }
  
  

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
  
/* ---------- DEADLINE COLOR LOGIC ---------- */


/* ---------- INIT ---------- */
loadPostdocs();
