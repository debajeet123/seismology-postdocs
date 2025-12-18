const fs = require('fs');
const path = require('path');
const { BASE_POSTDOCS } = require('./dataset');

const TARGET_PATH = path.join(__dirname, 'postdocs.json');

function writeJson() {
  const json = JSON.stringify(BASE_POSTDOCS, null, 2);
  fs.writeFileSync(TARGET_PATH, `${json}\n`, 'utf8');
  console.log(`Wrote ${BASE_POSTDOCS.length} entries to postdocs.json`);
}

writeJson();
