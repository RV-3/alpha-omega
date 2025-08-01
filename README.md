# Word Study Viewer

This project provides a simple static website that renders word-by-word study JSON files in a mobile-friendly layout.

## Development

Serve the site locally using Python's built-in HTTP server and open `index.html` in your browser:

```bash
python3 -m http.server
```

The page loads `data/index.json` which lists available chapter/verse files. Choose a reference from the drop-down to load its table and entries.

## Quick Start (macOS)

The project has no build step or external dependencies. The commands below can be
copied directly into a macOS terminal to view the site locally.

```bash
# Install Python 3 if it's not already available
brew install python

# Clone this repository
git clone https://github.com/yourusername/alpha-omega.git

# Navigate to the project directory
cd alpha-omega

# Start a local development server
python3 -m http.server

# In a second terminal window, open the site in your default browser
open http://localhost:8000
```

You should now see the Word Study Viewer in your browser. Click any highlighted
row to open a detailed entry overlay.

### Verify the server is running

With the server active you can check that files are being served correctly:

```bash
curl -I http://localhost:8000/index.html
```

The command should return an HTTP `200` response. Press `Ctrl+C` in the terminal
running `http.server` when you are done.

## HTML Sanitization

The viewer sanitizes entry snippets using [DOMPurify](https://github.com/cure53/DOMPurify) before inserting them into the page.
Only basic formatting tags like `<b>` and `<i>` are allowed. If existing JSON
files rely on stripped tags, remove or rewrite those elements in the JSON so the
sanitized output matches your expectations. Reload `index.html` locally after
each change to verify the rendered result.

## Maintaining the Manifest

All study data files live in the `data` directory. The `data/index.json`
manifest lists the available chapters so the drop-down on the page can be
populated. When you add a new JSON file, include an object in the manifest with
its filename and a human‑readable title. The viewer will then offer it as a
selectable reference.
