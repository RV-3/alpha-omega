# Word Study Viewer

This project provides a simple static website that renders word-by-word study JSON files in a mobile-friendly layout.

## Development

Serve the site locally using Python's built‑in HTTP server and open `index.html` in your browser:

```bash
python3 -m http.server
```

The page loads `data/index.json` which lists available chapter/verse files. Choose a reference from the drop‑down to load its table and entries.

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

## Navigation and Search

The reference list appears on the left. Use the search box to filter the list by
book, chapter, or verse. Clicking a reference loads its data. You can also move
through the list sequentially with the **Previous** and **Next** buttons.


## HTML Sanitization

The viewer sanitizes entry snippets using [DOMPurify](https://github.com/cure53/DOMPurify) before inserting them into the page.
Only basic formatting tags like `<b>` and `<i>` are allowed. If existing JSON
files rely on stripped tags, remove or rewrite those elements in the JSON so the
sanitized output matches your expectations. Reload `index.html` locally after
each change to verify the rendered result.

## Maintaining the Manifest

All study data files live in the `data` directory. The `data/index.json`
manifest lists the available chapters so the drop‑down and sidebar can be
populated. Each entry has a `file` pointing to a verse JSON and a `title`
displayed in the UI:

```json
{
  "references": [
    {"file": "Matthew-13-56.json", "title": "Matthew 13:56"}
  ]
}
```

To add another passage:

1. Create a new JSON file in `data/` following the same structure as the
   existing ones (`context`, `title`, `subtitle`, `table`, `entries`, `source`).
2. Append an object for the file to `data/index.json`.

The viewer sorts entries automatically, so the order in the manifest does not
matter. Reload the page after saving to see the new verse in the list.

## Serving and Hosting

Any static file server can host the viewer. During development `python3 -m
http.server` is convenient. For production you can upload the contents of this
repository to services such as GitHub Pages, Netlify, or any web server capable
of serving static files.
