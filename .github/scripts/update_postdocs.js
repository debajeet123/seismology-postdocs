const fs = require("fs");

const FILE = "postdocs.json";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const today = new Date();
const nextWeek = new Date(today.getTime() + ONE_WEEK);

function fmt(d) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

let changed = false;

const updated = data.map(p => {
  if (p.dl && p.dl.toLowerCase() === "open") {
    changed = true;
    return { ...p, dl: fmt(nextWeek) };
  }
  return p;
});

if (changed) {
  fs.writeFileSync(FILE, JSON.stringify(updated, null, 2));
  console.log("postdocs.json updated");
} else {
  console.log("No open deadlines found");
}
