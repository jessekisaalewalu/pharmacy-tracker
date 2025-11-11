# 🔄 Pharmacy Tracker - Development Workflows

## Overview
This document outlines standard development workflows, deployment processes, and best practices for the Pharmacy Tracker project.

---

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Git Workflow](#git-workflow)
4. [Testing & QA](#testing--qa)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)
7. [Code Standards](#code-standards)
8. [CI/CD Considerations](#cicd-considerations)

---

## 🚀 Getting Started

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/jessekisaalewalu/pharmacy-tracker.git
cd pharmacy-tracker

# Install frontend dependencies
cd app
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### First Run

```bash
# Terminal 1: Frontend (port 8000)
cd app
npm start

# Terminal 2: Backend (port 4000)
cd backend
npm start

# Open browser
http://localhost:8000
```

---

## 💻 Development Workflow

### Frontend Development (app/)

```bash
# Navigate to app directory
cd app

# Start development server
npm start
# Server runs on http://localhost:8000 with hot-reload

# Edit files in:
# - index.html (Structure)
# - styles.css (Styling & animations)
# - app.js (Logic & state)
# - api.js (Backend communication)

# Changes auto-refresh in browser (with http-server)
```

### Backend Development (backend/)

```bash
# Navigate to backend directory
cd backend

# Start server
npm start
# Server runs on http://localhost:4000

# Edit files in:
# - index.js (Server setup)
# - db.js (Database initialization)
# - routes/pharmacies.js (API endpoints)
# - pharmacy_tracker_backend/ (Python models)
```

### File Structure Reference

```
pharmacy-tracker/
├── app/                          # Frontend (vanilla JS)
│   ├── index.html               # Main HTML file
│   ├── styles.css               # All styling & animations
│   ├── app.js                   # Main app logic
│   ├── api.js                   # API communication
│   ├── package.json             # Frontend dependencies
│   └── assets/                  # Images, icons, fonts
│
├── backend/                      # Backend (Node.js + Python)
│   ├── index.js                 # Express server
│   ├── db.js                    # SQLite database
│   ├── routes/pharmacies.js     # Pharmacy CRUD routes
│   ├── pharmacy_tracker_backend/ # Python logic
│   │   ├── config.py
│   │   ├── models.py
│   │   └── database/
│   ├── package.json             # Backend dependencies
│   └── requirements.txt          # Python dependencies
│
├── .gitignore                    # Git ignore rules
├── WORKFLOWS.md                  # This file
├── IMPLEMENTATION_GUIDE.md       # User guide
└── README.md                     # Project overview
```

---

## 🌳 Git Workflow

### Branch Naming Convention

```
main              # Production-ready code
├── develop       # Development branch
│   ├── feature/pharmacy-search      # New features
│   ├── bugfix/location-filter       # Bug fixes
│   ├── hotfix/api-error             # Critical fixes
│   └── docs/update-readme           # Documentation
```

### Standard Git Flow

#### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/issue-description
```

#### 2. Make Changes

```bash
# Edit files...

# Check status
git status

# Stage changes
git add .
# Or stage specific files
git add app/index.html app/styles.css

# Commit with clear message
git commit -m "feat: add location filter dropdown"
# Or
git commit -m "fix: resolve API timeout issue"
```

#### 3. Push to Remote

```bash
# Push your branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Write clear description of changes
```

#### 4. Merge to Main

```bash
# After PR approval:
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main

# Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

### Commit Message Convention

Follow this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test additions/updates
- `chore`: Build, dependencies, etc.

**Examples:**
```bash
git commit -m "feat(search): add country filter dropdown"
git commit -m "fix(api): handle null pharmacy data"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(app.js): extract location logic to helper"
```

---

## 🧪 Testing & QA

### Frontend Testing

```bash
cd app

# Manual Testing Checklist:
# ✓ Navigate between pages (Home > Search > Register)
# ✓ Select country/region/city
# ✓ Search pharmacies by name
# ✓ Click "Use My Location" (grant permission)
# ✓ Click pharmacy card to view details
# ✓ Fill and submit registration form
# ✓ Test responsive design (F12 > toggle device toolbar)
# ✓ Check mobile layout (320px, 768px, 1200px+)
# ✓ Verify animations (smooth, no jank)
# ✓ Clear browser cache and reload
```

### Backend Testing

```bash
cd backend

# Test API endpoints:
curl http://localhost:4000/api/pharmacies

# Get all pharmacies
curl http://localhost:4000/api/pharmacies/all

# Create new pharmacy (POST)
curl -X POST http://localhost:4000/api/pharmacies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Pharmacy",
    "phone": "+250791234567",
    "address": "Kigali, Rwanda",
    "latitude": -1.9536,
    "longitude": 29.8739
  }'

# Get pharmacy by ID
curl http://localhost:4000/api/pharmacies/1

# Update pharmacy (PUT)
curl -X PUT http://localhost:4000/api/pharmacies/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# Delete pharmacy (DELETE)
curl -X DELETE http://localhost:4000/api/pharmacies/1
```

### Browser Developer Tools

```
F12 → Console
- Check for JavaScript errors
- Verify API responses
- Monitor network requests

F12 → Network
- Check API call status (200, 404, 500)
- Verify response times
- Check CORS issues

F12 → Application
- View local storage
- Check cookies
- Clear cache if needed

F12 → Device Toolbar
- Test mobile responsive design
- Check touch interactions
```

---

## 🚢 Deployment

### Pre-Deployment Checklist

```bash
# 1. Test locally
npm start  # in both app/ and backend/
# ✓ All features working
# ✓ No console errors
# ✓ Responsive on mobile

# 2. Update version
# Edit package.json version number
# Run: npm install (to update package-lock.json)

# 3. Build (if needed)
# Current setup uses vanilla JS, no build step needed
# For future: add webpack/vite configuration

# 4. Environment setup
# Create .env file with:
# NODE_ENV=production
# PORT=4000
# DB_PATH=/path/to/database

# 5. Security check
# ✓ No API keys in code
# ✓ CORS properly configured
# ✓ Input validation on server
# ✓ No console.log() with sensitive data

# 6. Final commit
git add .
git commit -m "release: v1.0.0"
git tag v1.0.0
git push origin main
git push origin --tags
```

### Deployment Options

#### Option 1: Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd app
vercel

# Create vercel.json
```

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-builds"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Option 2: Heroku (Full Stack)

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create pharmacy-tracker

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=4000

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Option 3: Docker (Containerized)

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy and install dependencies
COPY app/package*.json ./
RUN npm install --production

# Copy app files
COPY app/ ./

EXPOSE 8000
CMD ["npm", "start"]
```

```bash
# Build & run
docker build -t pharmacy-tracker .
docker run -p 8000:8000 pharmacy-tracker
```

---

## 🔧 Troubleshooting

### Frontend Issues

| Issue | Solution |
|-------|----------|
| App not loading | Check if `npm start` running in app/ directory |
| Styles not applying | Clear browser cache (Ctrl+Shift+Delete) |
| API calls failing | Verify backend running on port 4000 |
| Location not working | Check browser location permissions |
| Animations choppy | Check browser console for errors |
| Mobile layout broken | Press F12 > Toggle device toolbar |

### Backend Issues

| Issue | Solution |
|-------|----------|
| Port 4000 already in use | `netstat -ano \| findstr :4000` (Windows) to find process |
| Database locked | Restart backend server |
| API 404 errors | Check route names in routes/pharmacies.js |
| CORS errors | Verify cors middleware in index.js |
| Data not persisting | Check database path in db.js |

### Git Issues

| Issue | Solution |
|-------|----------|
| Merge conflicts | `git status` to see conflicts, resolve manually |
| Wrong branch | `git checkout correct-branch` |
| Accidentally committed | `git reset HEAD~1` to undo |
| Lost commits | `git reflog` to find them |

---

## 📝 Code Standards

### JavaScript Style Guide

```javascript
// Use camelCase for variables
const pharmacyName = "Test Pharmacy";

// Use PascalCase for classes
class PharmacyTrackerApp {
  constructor() { }
}

// Use UPPER_SNAKE_CASE for constants
const MAX_SEARCH_RADIUS = 50;

// Use arrow functions
const filterPharmacies = (list) => {
  return list.filter(p => p.distance < 10);
};

// Add comments for complex logic
// Calculate distance using Haversine formula
const distance = calculateDistance(lat1, lon1, lat2, lon2);

// Use const by default, let when needed, avoid var
const API_URL = 'http://localhost:4000/api';
let currentPharmacies = [];
```

### CSS Standards

```css
/* Use custom properties for colors */
:root {
  --primary-blue: #0a84ff;
  --dark-text: #0b1226;
  --light-bg: #f6f8fb;
}

/* Use BEM naming for classes */
.pharmacy-card { }
.pharmacy-card__header { }
.pharmacy-card--highlighted { }

/* Group related properties */
.btn {
  /* Layout */
  display: inline-block;
  padding: 1rem 2rem;
  
  /* Typography */
  font-size: 1rem;
  font-weight: 600;
  
  /* Colors */
  color: white;
  background: var(--primary-blue);
  
  /* Effects */
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Mobile-first approach */
.pharmacy-list {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .pharmacy-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### HTML Standards

```html
<!-- Use semantic HTML -->
<header>Header content</header>
<nav>Navigation</nav>
<main>Main content</main>
<section>Page section</section>
<article>Article content</article>
<footer>Footer content</footer>

<!-- Proper heading hierarchy -->
<h1>Page title (only one per page)</h1>
<h2>Section title</h2>
<h3>Subsection title</h3>

<!-- Use alt text for images -->
<img src="pharmacy.jpg" alt="Pharmacy storefront">

<!-- Use proper form structure -->
<form>
  <label for="name">Name:</label>
  <input id="name" type="text" required>
</form>
```

---

## 🔄 CI/CD Considerations

### GitHub Actions Setup

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install frontend dependencies
        run: cd app && npm install
      
      - name: Install backend dependencies
        run: cd backend && npm install
      
      - name: Lint frontend
        run: cd app && npm run lint
        continue-on-error: true
      
      - name: Start servers and test
        run: |
          cd app && npm start &
          cd backend && npm start &
          sleep 2
          curl http://localhost:4000/api/pharmacies
```

### Quality Checks

```bash
# Add to package.json scripts:
{
  "scripts": {
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write .",
    "start": "npx http-server -p 8000"
  }
}
```

---

## 📚 Additional Resources

- [Pharmacy Tracker Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [Frontend Code](./app/)
- [Backend Code](./backend/)
- [Git Documentation](https://git-scm.com/doc)
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Guidelines](https://www.w3.org/Style/CSS/)

---

## ✅ Checklist for New Contributors

- [ ] Read this WORKFLOWS.md file
- [ ] Clone repository locally
- [ ] Run `npm install` in both app/ and backend/
- [ ] Start both servers successfully
- [ ] Access app at http://localhost:8000
- [ ] Test a feature (find pharmacies, register, etc.)
- [ ] Create a feature branch
- [ ] Make a small change
- [ ] Commit with proper message format
- [ ] Push to GitHub
- [ ] Create a Pull Request
- [ ] Wait for review and feedback

---

## 🤝 Support & Questions

For issues or questions:
1. Check [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
2. Review existing GitHub issues
3. Create a new issue with detailed description
4. Tag with appropriate label (bug, feature, documentation)

---

**Last Updated:** November 11, 2025  
**Maintained by:** Pharmacy Tracker Team  
**Version:** 1.0.0
