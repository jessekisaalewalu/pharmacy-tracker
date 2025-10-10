# Pharmacy Tracker App (frontend)

This is the Expo/React Native frontend for Pharmacy Tracker.

Quick start:

1. Install dependencies: `npm install` or `yarn`
2. Start Metro: `npx expo start` or `expo start`

Notes:
- The frontend expects the backend API at `/api/v1/pharmacies`. In development you may need to proxy or run the backend on `http://127.0.0.1:8000` as fallback.
- The app includes a `list` tab with a badge that shows the number of pharmacies (fetches every 60s).
