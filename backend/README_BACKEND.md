Node/Express is the active backend

This repository contains two backend implementations. The active API used by the frontend (React/React Native) is the Node/Express server located at the backend root ("index.js" and "routes/").

The Python/Flask code under `pharmacy_tracker_backend/` is legacy/experimental and is not used by the frontend. Please do not run or deploy the Flask app when you're running the React frontend — instead, use the Node server.

Quick notes:
- Start the active backend (Node/Express):

```powershell
cd backend
npm install
npm run dev   # or npm start
```

- The frontend `app/src/api.js` already points to `http://localhost:4000` by default.
- If you want to permanently remove the Flask code, consider moving `pharmacy_tracker_backend/` into an archive branch or deleting it with git once you're ready.

If you'd like, I can:
- Move the Flask folder into `backend/legacy_flask/` to keep it but reduce confusion, or
- Delete the Flask files entirely and update the repo to only contain the Node backend.

Tell me which option you prefer and I'll apply it.