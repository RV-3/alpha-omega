# Word Study Viewer

This project provides a simple static website that renders word-by-word study JSON files in a mobile-friendly layout.

## Development

Serve the site locally using Python's built-in HTTP server and open `index.html` in your browser:

```bash
python3 -m http.server
```

The page loads `data/example.json` and highlights rows that have matching entries. Click a highlighted row to view additional information.

## Quick Start (macOS)

The project has no build step or external dependencies. The commands below can be
copied directly into a macOS terminal to view the site locally.

```bash
# Install Python 3 if it's not already available
brew install python

# Navigate to the project directory (replace the path with the location
# where you cloned or unpacked this repository)
cd path/to/alpha-omega

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
