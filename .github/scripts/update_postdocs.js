const fs = require("fs");
const path = require("path");

const FILE = path.join(process.cwd(), "postdocs.json");
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function fmt(d) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

const raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
const entries = raw.entries || [];

const today = new Date();
const nextWeek = new Date(today.getTime() + ONE_WEEK);

let changed = false;

const updatedEntries = entries.map(p => {
  if (p.dl && p.dl.toLowerCase() === "open") {
    changed = true;
    return { ...p, dl: fmt(nextWeek) };
  }
  return p;
});

const output = {
  last_updated: todayISO(),
  entries: updatedEntries
};

fs.writeFileSync(FILE, JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(
  changed
    ? "Updated deadlines and last_updated"
    : "No deadline changes; refreshed last_updated"
);