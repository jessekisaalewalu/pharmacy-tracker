Pharmacy Tracker - Web Frontend

This simple static frontend connects to the backend API at `/api/v1`.

How to run locally

1. From the `web-frontend` folder, serve the files. You can use a simple static server, for example:

   - Python 3: python -m http.server 8080
   - Node: npx serve -l 8080

2. Open http://localhost:8080 in your browser.

Notes

- The frontend tries `/api/v1` first and falls back to `http://127.0.0.1:8000/api/v1` if the first host is unavailable.
- CORS: Ensure your backend allows CORS for the origin serving the frontend when testing locally.
- Deploy: Host this folder on Netlify, Vercel, or GitHub Pages. Make sure to configure the API_BASE if your backend is hosted elsewhere.

Configuration & deployment notes

- To point the frontend to a different backend, set a global `window.API_BASE` in the served HTML (e.g., via a small inline script) or use the `?api=` query parameter. Example: `https://example.com/?api=https://api.example.com/api/v1`
- The included GitHub Actions workflow (`.github/workflows/deploy-web.yml`) will publish the `web-frontend` directory to GitHub Pages when you push to `main`.
