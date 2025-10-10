# 💊 Pharmacy Tracker

![Pharmacy Tracker Banner](https://user-images.githubusercontent.com/placeholder/banner.png)

---

## 🚀 Overview

**Pharmacy Tracker** is a full-stack application designed to help users find, register, and manage pharmacies with ease. It features a robust backend, a beautiful React Native mobile app, and a modern static web frontend. Built for accessibility, speed, and developer happiness.

---

## 🏗️ Project Structure

```
pharmacy-tracker/
├── backend/                  # Flask backend (API, DB, migrations)
│   ├── app.py                # Waitress server entry point
│   ├── requirements.txt      # Python dependencies
│   ├── pharmacy_tracker_backend/
│   │   ├── __init__.py       # App factory, DB setup
│   │   ├── database/         # SQLAlchemy models
│   │   └── routes/           # API endpoints (Blueprints)
│   └── migrations/           # Alembic migrations
├── pharmacy-tracker-app/     # React Native (Expo) mobile app
│   ├── app/                  # Screens, tabs, modal, tests
│   ├── components/           # Shared UI components
│   ├── package.json          # NPM dependencies
│   └── ...                   # Jest config, mocks, assets
├── web-frontend/             # Static HTML/CSS/JS web app
│   ├── index.html            # Main SPA-like page
│   ├── pharmacy.html         # Pharmacy details/edit page
│   ├── styles.css            # Modern, animated styles
│   ├── app.js, pharmacy.js   # JS logic (fetch, map, slideshow)
│   └── README.md             # Web frontend usage
└── README.md                 # 📖 You're here!
```

---

## ✨ Features

- **Backend (Flask + SQLAlchemy):**
  - RESTful API (`/api/v1/pharmacies`) for listing, searching, registering, editing, and deleting pharmacies
  - SQLite database for easy local development
  - Blueprint-based route organization
  - Production-ready Waitress WSGI server (Windows-friendly)
  - Alembic migrations for schema changes

- **Mobile App (React Native + Expo):**
  - Tab-based navigation: Find Pharmacies, Register, All Pharmacies
  - Animated badge showing pharmacy count
  - Pull-to-refresh list, search, and registration form
  - Accessible, visually appealing UI with vector icons
  - About/help modal
  - Jest test setup (disabled by default for easier onboarding)

- **Web Frontend (HTML/CSS/JS):**
  - Pharmacy list, search, and registration
  - Details modal, edit/delete actions
  - Leaflet map integration for location
  - Animated slideshow, badges, and modern CSS
  - Accessibility: `<html lang="en">`, keyboard navigation, ARIA labels
  - GitHub Actions workflow for easy deployment

---

## 🛠️ Setup & Usage

### 1. Backend (Flask)

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
- The API will be available at `http://127.0.0.1:8080/api/v1/pharmacies`

### 2. Mobile App (Expo)

```powershell
cd pharmacy-tracker-app
npm install --legacy-peer-deps
npm start
```
- Scan the QR code with Expo Go or run on Android/iOS simulator.

### 3. Web Frontend

```powershell
cd web-frontend
npx serve .
```
- Open `http://localhost:3000` in your browser.

---

## 🧪 Testing

- Jest setup is present but disabled by default. To run tests manually:
  ```powershell
  cd pharmacy-tracker-app
  npm run test:jest
  ```
- For production, re-enable Jest and add robust mocks for Expo modules.

---

## 📦 Deployment

- Static web frontend is ready for GitHub Pages or any static host.
- Backend can be deployed on any Windows-friendly server (Waitress).
- Mobile app can be published via Expo.

---

## 🗂️ API Reference

- **GET /api/v1/pharmacies** — List all pharmacies
- **POST /api/v1/pharmacies** — Register a new pharmacy
- **GET /api/v1/pharmacies/:id** — Get pharmacy details
- **PUT /api/v1/pharmacies/:id** — Edit pharmacy
- **DELETE /api/v1/pharmacies/:id** — Delete pharmacy

Fields:
- `name`, `phone_number`, `address`, `latitude`, `longitude`, `services`

---

## 🖼️ Screenshots

| Mobile App | Web Frontend |
|:----------:|:------------:|
| ![Mobile](https://user-images.githubusercontent.com/placeholder/mobile.png) | ![Web](https://user-images.githubusercontent.com/placeholder/web.png) |

---

## 👤 Author

**Created by:**

> ### Jesse Kisaale Walusansa
> 📧 princejesse009@gmail.com

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Expo](https://expo.dev/), [React Native](https://reactnative.dev/), [Flask](https://flask.palletsprojects.com/), [SQLAlchemy](https://www.sqlalchemy.org/), [Leaflet](https://leafletjs.com/)
- All contributors and testers!

---

## 💡 Tips

- For best results, run backend and frontend locally and use the same API base URL.
- Customize pharmacy fields and UI as needed for your region.
- Accessibility and mobile-first design are built-in.

---

## 🌟 Enjoy using Pharmacy Tracker!

---

> _"Built with ❤️ by Jesse Kisaale Walusansa — princejesse009@gmail.com"_
