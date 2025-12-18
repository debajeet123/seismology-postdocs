const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'postdocs.json');

function loadData() {
  const json = fs.readFileSync(DATA_PATH, 'utf8');
  const parsed = JSON.parse(json);

  if (!Array.isArray(parsed)) {
    throw new Error('Dataset must be an array of entries');
  }

  return parsed;
}

function isValidDeadline(dl) {
  if (typeof dl !== 'string' || dl.trim() === '') return false;
  if (dl.toLowerCase() === 'open') return true;

  const time = Date.parse(dl);
  return Number.isFinite(time);
}

function validate(entries) {
  let errors = 0;

  entries.forEach((entry, idx) => {
    const context = `Entry ${idx + 1}${entry.uni ? ` (${entry.uni})` : ''}`;

    ['uni', 'rg', 'dl'].forEach(key => {
      if (!entry[key]) {
        console.error(`${context}: missing required field "${key}"`);
        errors += 1;
      }
    });

    if (entry.link && !/^https?:\/\//.test(entry.link)) {
      console.error(`${context}: link must start with http:// or https://`);
      errors += 1;
    }

    if (!isValidDeadline(entry.dl)) {
      console.error(`${context}: deadline must be an ISO date (YYYY-MM-DD) or "open"`);
      errors += 1;
    }
  });

  return errors;
}

function main() {
  try {
    const entries = loadData();
    const errors = validate(entries);

    if (errors > 0) {
      console.error(`\nValidation failed with ${errors} issue${errors === 1 ? '' : 's'}.`);
      process.exit(1);
      return;
    }

    console.log(`Validation passed for ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}.`);
  } catch (err) {
    console.error('Unable to validate postdocs.json:', err.message);
    process.exit(1);
  }
}

main();
