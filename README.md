# Word Study Viewer

This project provides a simple static website that renders word-by-word study JSON files in a mobile-friendly layout.

## Development

Serve the site locally using Python's built-in HTTP server and open `index.html` in your browser:

```bash
python3 -m http.server
```

The page loads `data/example.json` and highlights rows that have matching entries. Click a highlighted row to view additional information.
