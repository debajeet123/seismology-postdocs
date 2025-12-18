# seismology-postdocs

Static page to browse seismology and geophysics postdoctoral openings in the United States.

## Running locally
Use any static server so the page can load `postdocs.json` without browser security warnings:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) to see the table. If the JSON file cannot be fetched (for example when opening the file directly via `file://`), the page now falls back to a small built-in dataset so the list still shows.

To regenerate the sample `postdocs.json` from the canonical dataset in `dataset.js`, run:

```bash
node generate-json.js
```

## Validating the dataset
Run the lightweight validator to ensure `postdocs.json` has the expected shape and deadline formats:

```bash
node validate.js
```
