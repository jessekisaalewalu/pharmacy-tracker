# Pharmacy Tracker - Vanilla HTML/CSS/JavaScript App

A fully responsive web application to find and register pharmacies with location-based search, built with vanilla HTML, CSS, and JavaScript (no frameworks).

## Features

✅ **Home Page** - Beautiful landing page with feature highlights
✅ **Find Pharmacies** - Search pharmacies near your location with:
  - Geolocation detection (uses browser's location API)
  - Distance calculation using Haversine formula (same as Google Maps)
  - Adjustable search radius (1-50 km)
  - Interactive map view with pharmacy markers
  - Text search by pharmacy name or address
  - Sorted by distance to your location

✅ **Pharmacy Details** - Click any pharmacy to see:
  - Full address and contact information
  - Phone number (clickable to call)
  - Email address (clickable to email)
  - Opening hours
  - Services offered
  - Distance from your location

✅ **Register Pharmacy** - Pharmacies can register with:
  - Automatic location detection
  - Manual coordinate entry
  - Full contact details (name, phone, email, address)
  - Services list
  - Opening hours
  - Form validation

✅ **Responsive Design** - Works perfectly on:
  - Desktop (1920px and above)
  - Tablet (768px - 1024px)
  - Mobile (320px - 480px)
  - All modern browsers

✅ **Real-time Search** - Instant filtering as you type
✅ **Modern UI** - Clean, professional design with smooth animations
✅ **Backend Integration** - Connects to Node.js/Express backend

## Project Structure

```
app/
├── index.html          # Main HTML structure
├── styles.css          # All styles (responsive design)
├── app.js             # Main app logic and functionality
├── api.js             # Backend API communication
├── package.json       # Dependencies (just http-server)
└── node_modules/      # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Backend server running on http://localhost:4000

### Installation

1. **Navigate to app directory**
   ```bash
   cd app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Frontend: http://localhost:8000
   - Backend: http://localhost:4000

## How to Use

### Finding Pharmacies
1. Click "Find Pharmacies" from home page
2. Click "Use My Location" button (browser will ask for permission)
3. Grant location access in your browser
4. Pharmacies within 10 km radius will appear automatically
5. Adjust search radius using the slider
6. Search by name or address using the search box
7. Click any pharmacy card to view details

### Registering a Pharmacy
1. Click "Register a Pharmacy" from home page
2. Fill in required fields (marked with *)
3. Click "Detect Current Location" to auto-fill coordinates
4. Or manually enter latitude/longitude
5. Add services (comma-separated)
6. Submit form

### Viewing Pharmacy Details
- Click on any pharmacy card in the list
- View all details in the modal popup
- Click phone number to call
- Click email to send message
- See distance from your location

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Node.js, Express, SQLite
- **APIs**: Browser Geolocation API, Fetch API
- **Styling**: CSS Grid, Flexbox, Media Queries
- **Icons**: Font Awesome 6.4.0

## Key Features Explained

### Distance Calculation
Uses the **Haversine formula** to calculate great-circle distance between two geographic points:
- Same method as Google Maps
- Accounts for Earth's spherical shape
- Accurate to within ~0.5%

```javascript
const R = 6371; // Earth's radius in km
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLng = (lng2 - lng1) * Math.PI / 180;
// ... haversine calculation
```

### Geolocation
- Uses browser's `navigator.geolocation` API
- Requires HTTPS in production (HTTP works on localhost)
- User must grant location permission
- Timeout: 10 seconds

### Responsive Design
Breakpoints:
- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (adjusted grid)
- **Mobile**: 320px - 767px (single column, full-width buttons)

## API Endpoints (Backend)

The app communicates with these endpoints:

```
GET    /api/pharmacies              # Get all pharmacies
POST   /api/pharmacies              # Create new pharmacy
GET    /api/pharmacies?search=name  # Search pharmacies
GET    /api/pharmacies/:id          # Get single pharmacy
PUT    /api/pharmacies/:id          # Update pharmacy
DELETE /api/pharmacies/:id          # Delete pharmacy
```

## Configuration

To change the backend URL, edit `api.js`:
```javascript
const BACKEND = 'http://localhost:4000'; // Change this
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+
- Chrome Mobile

## Known Limitations

1. **Map View** - Simple 2D projection, not a real map (no Leaflet/Google Maps)
2. **Geolocation** - Requires HTTPS in production
3. **Search Radius** - UI only (backend doesn't filter by distance)

## Performance

- **Bundle Size**: ~20KB (HTML + CSS + JS + API)
- **Load Time**: <1s on fast connection
- **No dependencies**: Pure vanilla code (except http-server for dev)
- **Animations**: GPU-accelerated with transforms

## Security Notes

- No authentication system yet
- Backend should implement CORS properly for production
- Form validation is client-side only
- Consider HTTPS for production deployment

## Troubleshooting

**App not loading?**
- Check if frontend (port 8000) and backend (port 4000) are running
- Open browser console (F12) for errors
- Check CORS settings if backend is on different origin

**Location not detected?**
- Browser must have location permission
- Works on localhost and HTTPS sites
- Check if location services are enabled on your device

**Pharmacies not showing?**
- Make sure backend is running (`npm start` in backend/)
- Check browser console for API errors
- Verify backend database has data

**Styles not loading?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check if styles.css is in the same directory

## Future Enhancements

- [ ] Real map integration (Leaflet/Mapbox)
- [ ] User authentication
- [ ] Pharmacy ratings and reviews
- [ ] Photo uploads
- [ ] Business hours calendar
- [ ] Medication search integration
- [ ] Chat with pharmacist
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)
- [ ] Dark mode

## License

MIT License - Free to use and modify

## Support

For issues or questions, check:
1. Browser console (F12)
2. Backend logs
3. Network tab for failed requests
4. CORS configuration

---

**Built with ❤️ for finding pharmacies easily**
