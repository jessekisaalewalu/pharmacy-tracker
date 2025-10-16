# Pharmacy Tracker (Expo + Node/SQLite)


## Prerequisites
- Node.js (16+ recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`) or use `npx expo` commands


## Backend setup (server)
1. Open terminal -> `cd backend`
2. `npm install`
3. Create `./data` folder if you want, the app will create DB automatically.
4. `node index.js` (or `npm start`) — server runs by default on port 4000


API endpoints:
- `GET /api/pharmacies` — returns all pharmacies
- `GET /api/pharmacies?lat=<>&lng=<>&limit=5` — returns nearest pharmacies sorted by distance
- `GET /api/pharmacies/:id` — get one
- `POST /api/pharmacies` — create `{ name, contact, address, latitude, longitude, description }`
- `PUT /api/pharmacies/:id` — update
- `DELETE /api/pharmacies/:id` — delete


## Frontend (Expo app)
1. Open another terminal -> `cd app`
2. `npm install`
3. Start app: `expo start` (choose `web`, `android`, or `ios`)


The app expects backend at `http://localhost:4000`. If running the app on a physical device, replace this with your machine's local IP (e.g. `http://192.168.1.100:4000`).


## Notes
- For real production use, switch sqlite to a managed DB or add authentication.
- For maps in-app, integrate `react-native-maps` and configure API keys.


Enjoy!