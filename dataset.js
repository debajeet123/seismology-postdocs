const BASE_POSTDOCS = [
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

// Browser: expose fallback data for rendering when postdocs.json cannot be fetched.
if (typeof window !== 'undefined') {
  window.FALLBACK_POSTDOCS = BASE_POSTDOCS;
}

// Node: export the dataset so CLI utilities can reuse the canonical source of truth.
if (typeof module !== 'undefined') {
  module.exports = { BASE_POSTDOCS };
}
