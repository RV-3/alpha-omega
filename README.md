# Word Study Viewer

This project provides a simple static website that renders word-by-word study data from a Sanity CMS in a mobile-friendly layout.

## Development

Serve the site locally using Python's built‑in HTTP server and open `index.html` in your browser:

```bash
python3 -m http.server
```

All verse data is fetched at runtime from your Sanity dataset. Populate the CMS and set `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_VERSION` in `sanityClient.js` or export them in your environment before launching the server. With valid credentials the page lists available references; choose one to load its table and entries.

## Quick Start (macOS)

The project has no build step or external dependencies. The commands below can be copied directly into a macOS terminal to view the site locally.

```bash
# Install Python 3 if it's not already available
brew install python

# Clone this repository
git clone https://github.com/yourusername/alpha-omega.git

# Navigate to the project directory
cd alpha-omega

# Provide your Sanity credentials (or edit sanityClient.js)
export SANITY_PROJECT_ID=your_project_id
export SANITY_DATASET=production
export SANITY_API_VERSION=2023-10-01

# Start a local development server
python3 -m http.server

# In a second terminal window, open the site in your default browser
open http://localhost:8000
```

You should now see the Word Study Viewer in your browser. Click any highlighted row to open a detailed entry overlay.

### Verify the server is running

With the server active you can check that files are being served correctly:

```bash
curl -I http://localhost:8000/index.html
```

The command should return an HTTP `200` response. Press `Ctrl+C` in the terminal running `http.server` when you are done.

## Navigation and Search

The reference list appears on the left. Use the search box to filter the list by book, chapter, or verse. Clicking a reference loads its data from Sanity. You can also move through the list sequentially with the **Previous** and **Next** buttons.

## HTML Sanitization

The viewer sanitizes entry snippets using [DOMPurify](https://github.com/cure53/DOMPurify) before inserting them into the page. Only basic formatting tags like `<b>` and `<i>` are allowed. If entries in the CMS rely on stripped tags, remove or rewrite those elements in Sanity so the sanitized output matches your expectations. Reload `index.html` locally after each change to verify the rendered result.

## Sanity Setup

1. Create a Sanity project and dataset. The [Sanity CLI](https://www.sanity.io/docs/getting-started) can initialize a new project.
2. Define a `reference` schema with a `slug` (used as the file name) and `title`. Include fields for `context`, `table`, and `entries` to store the passage content.
3. Note your project ID, dataset name, and preferred API version.
4. Set `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_VERSION` in `sanityClient.js` or supply them via environment variables before serving the site.

## Serving and Hosting

Any static file server can host the viewer. During development `python3 -m http.server` is convenient. For production you can upload the contents of this repository to services such as GitHub Pages, Netlify, or any web server capable of serving static files.
