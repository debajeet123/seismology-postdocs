async function loadPostdocs() {
    const res = await fetch("postdocs.json");
    const postdocs = await res.json();
  
    const tbody = document.querySelector("#postdocTable tbody");
    tbody.innerHTML = "";
  
    postdocs.forEach(p => {
      const row = document.createElement("tr");
  
      const linkCell = p.link
        ? `<a href="${p.link}" target="_blank" rel="noopener">Apply ↗</a>`
        : "—";
  
      row.innerHTML = `
        <td>${p.uni}</td>
        <td>${p.rg}</td>
        <td>${p.dl}</td>
        <td>${linkCell}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  loadPostdocs();
  