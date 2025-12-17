const postdocs = [
    { uni: "University of Arizona", rg: "Computational Seismology, Urban Geohazards", dl: "12/15/2025" },
    { uni: "University of Memphis", rg: "CERI – Induced Seismicity", dl: "12/15/2025" },
    { uni: "Utah State University", rg: "Earthquake Science Group", dl: "12/19/2025" },
    { uni: "University of Florida", rg: "Seismic Wave–Dune Interaction", dl: "10/24/2025" },
    { uni: "Caltech", rg: "Seismological Laboratory", dl: "12/15/2025" },
    { uni: "Louisiana State University", rg: "Geophysics & Seismic Hazard", dl: "12/15/2025" },
    { uni: "University of Texas at Austin", rg: "TexNet Earthquake Monitoring", dl: "12/15/2025" },
    { uni: "UT Institute for Geophysics", rg: "Seismic Inversion & Modeling", dl: "12/15/2025" },
    { uni: "Princeton University", rg: "Seismology & Earth Structure", dl: "12/15/2025" },
    { uni: "University of Montana", rg: "Fiber Sensing & Seafloor Seismology", dl: "12/15/2025" }
  ];
  
  const tableBody = document.querySelector("#postdocTable tbody");
  const searchInput = document.getElementById("searchInput");
  
  function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.uni}</td>
        <td>${item.rg}</td>
        <td>${item.dl}</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  searchInput.addEventListener("keyup", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = postdocs.filter(p =>
      p.uni.toLowerCase().includes(query) ||
      p.rg.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });
  
  function sortTable(colIndex) {
    const keys = ["uni", "rg", "dl"];
    postdocs.sort((a, b) => a[keys[colIndex]].localeCompare(b[keys[colIndex]]));
    renderTable(postdocs);
  }
  
  renderTable(postdocs);
  