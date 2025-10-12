// Frontend app.js - connects to backend and powers UI interactions
// API base can be set via window.API_BASE or query param ?api=
const FALLBACK_BASES = ['/api/v1', 'http://127.0.0.1:8000/api/v1'];
let apiBase = window.API_BASE || null;
// allow override with ?api=https://host
try {
  const qp = new URLSearchParams(window.location.search).get('api');
  if (qp) apiBase = qp.replace(/\/+$/, '');
} catch (e) {}
if (!apiBase) apiBase = FALLBACK_BASES[0];

function tryFetch(path, opts) {
  return fetch(apiBase + path, opts).then(res => {
    if (res.ok) return res;
    // try fallback bases
    return fetch(FALLBACK_BASES[1] + path, opts);
  }).catch(() => {
    // last-resort fallback
    return fetch(FALLBACK_BASES[1] + path, opts);
  });
}

// Default dataset (East Africa) - used as a fallback when API isn't available
const PHARMACIES = [
  { name: "Jubilee Pharmacy", address: "Kampala Road, Kampala", city: "Kampala", country: "Uganda", phone_number: "+256 701 234567", services: "Prescription, OTC, Health Advice", image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80", latitude:0.3136, longitude:32.5811 },
  { name: "Goodlife Pharmacy", address: "Westlands, Nairobi", city: "Nairobi", country: "Kenya", phone_number: "+254 712 345678", services: "Prescription, Vaccines, Wellness", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", latitude:-1.286389, longitude:36.817223 },
  { name: "Dawa Pharmacy", address: "Samora Ave, Dar es Salaam", city: "Dar es Salaam", country: "Tanzania", phone_number: "+255 713 456789", services: "OTC, Health Advice, Cosmetics", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", latitude:-6.7924, longitude:39.2083 },
  { name: "La Bonne Santé Pharmacy", address: "Kigali City Tower, Kigali", city: "Kigali", country: "Rwanda", phone_number: "+250 788 123456", services: "Prescription, OTC, Health Advice", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", latitude:-1.9536, longitude:30.0605 },
  { name: "Burundi Meds Pharmacy", address: "Avenue de l'Indépendance, Bujumbura", city: "Bujumbura", country: "Burundi", phone_number: "+257 79 123456", services: "OTC, Health Advice, Cosmetics", image: "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=400&q=80", latitude:-3.3822, longitude:29.3644 },
  { name: "Juba Health Pharmacy", address: "Airport Road, Juba", city: "Juba", country: "South Sudan", phone_number: "+211 955 123456", services: "Prescription, OTC, Health Advice", image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3c5a?auto=format&fit=crop&w=400&q=80", latitude:4.8517, longitude:31.5825 },
  { name: "Addis Pharma", address: "Bole Road, Addis Ababa", city: "Addis Ababa", country: "Ethiopia", phone_number: "+251 911 123456", services: "Prescription, OTC, Wellness", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", latitude:9.03, longitude:38.74 }
];

let currentItems = PHARMACIES.slice();

async function loadAll() {
  // Try Google Places API for live pharmacies
  let items = [];
  try {
    const country = document.getElementById('country-filter').value || 'Uganda';
    const city = document.getElementById('search').value || '';
    const res = await fetch(`/places?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`);
    const data = await res.json();
    if (data && data.results) {
      items = data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address || place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        phone_number: place.formatted_phone_number || '',
        country,
        city,
        image: place.photos && place.photos.length ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=YOUR_GOOGLE_MAPS_API_KEY` : '',
        services: 'Prescription, OTC',
      }));
    }
  } catch (e) { /* fallback to static */ items = PHARMACIES.slice(); }
  currentItems = items;
  renderList(items);
  updateMap(items);
}

function renderList(items) {
  const listEl = document.getElementById('list');
  const nearbyEl = document.getElementById('nearby');
  const slideshowEl = document.getElementById('slideshow');
  const badge = document.getElementById('badge');
  listEl.innerHTML = '';
  nearbyEl.innerHTML = '';
  slideshowEl.innerHTML = '';
  badge.innerText = items.length;
  listEl.innerHTML = items.map((item, idx) => `
    <div class="item" data-idx="${idx}" style="animation-delay:${idx*0.04}s">
      <img src="${item.image}" alt="${escapeHtml(item.name)}" class="pharmacy-img" />
      <div class="pharmacy-meta">
        <div style="font-weight:700;font-size:1.05em">${escapeHtml(item.name)}</div>
        <div style="color:#666">${escapeHtml(item.address || '')}</div>
        <div style="color:#0b63a3;font-weight:700">${escapeHtml(item.phone_number || '')}</div>
        <div style="color:#1070c6;font-size:0.9em">${escapeHtml(item.country)}</div>
      </div>
      <div>
        <button class="btn ghost" data-id="${idx}">Details</button>
      </div>
    </div>
  `).join('');
  const first = items.slice(0,6);
  nearbyEl.innerHTML = first.map(i => `<div class="item"><img src="${i.image}" class="pharmacy-img" /><div class="pharmacy-meta"><div style="font-weight:700">${escapeHtml(i.name)}</div><div style="color:#666">${escapeHtml(i.address || '')}</div></div></div>`).join('');
  first.forEach((i, idx) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.style.opacity = idx === 0 ? '1' : '0';
    slide.style.transform = idx === 0 ? 'translateX(0)' : 'translateX(40px)';
    slide.innerHTML = `<div class="meta"><h3 style="margin:0">${escapeHtml(i.name)}</h3><p style="margin:6px 0;color:#444">${escapeHtml(i.address || '')}</p></div><img src="${i.image}" class="pharmacy-img" style="margin-left:18px" /><div class="overlay"></div>`;
    slideshowEl.appendChild(slide);
  });
  startSlideshow();
  // also update suggestion list if visible
  populateSuggestions('');
}

function updateMap(items) {
  if (!window.map) return;
  if (!window.markersLayer) window.markersLayer = L.layerGroup().addTo(window.map);
  window.markersLayer.clearLayers();
  const bounds = [];
  items.forEach(i => {
    const lat = i.latitude || i.lat || null;
    const lng = i.longitude || i.lng || i.lon || null;
    if (lat && lng) {
      const m = L.marker([lat, lng]).bindPopup(`<b>${escapeHtml(i.name)}</b><br/>${escapeHtml(i.address||'')}`);
      window.markersLayer.addLayer(m);
      bounds.push([lat, lng]);
    }
  });
  if (bounds.length) window.map.fitBounds(bounds, { padding: [40,40] });
}

let slideIndex = 0;
function startSlideshow() {
  const slides = document.querySelectorAll('.slideshow .slide');
  if (!slides.length) return;
  slideIndex = 0;
  setInterval(() => {
    slides.forEach((s, i) => {
      s.style.transition = 'transform .6s cubic-bezier(.22,.9,.2,1),opacity .6s';
      s.style.opacity = i === slideIndex ? '1' : '0';
      s.style.transform = i === slideIndex ? 'translateX(0)' : 'translateX(40px)';
    });
    slideIndex = (slideIndex + 1) % slides.length;
  }, 3500);
}

function escapeHtml(unsafe) {
  return String(unsafe || '').replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c));
}

// navigation
document.addEventListener('DOMContentLoaded', () => {
  // Testimonials slideshow
  const testimonials = document.querySelectorAll('#testimonials .testimonial');
  let tIndex = 0;
  setInterval(() => {
    testimonials.forEach((t, i) => t.classList.toggle('active', i === tIndex));
    tIndex = (tIndex + 1) % testimonials.length;
  }, 4000);
  const btnFind = document.getElementById('btn-find');
  const btnReg = document.getElementById('btn-register');
  const btnList = document.getElementById('btn-list');
  const sections = { find: document.getElementById('find-section'), register: document.getElementById('register-section'), list: document.getElementById('list-section') };
  const navBtns = document.querySelectorAll('.nav-btn');

  function activate(name) {
    // simple panel toggle
    Object.values(sections).forEach(s => s.classList.remove('active'));
    sections[name].classList.add('active');
    navBtns.forEach(b => b.classList.remove('active'));
    if (name === 'find') btnFind.classList.add('active');
    if (name === 'register') btnReg.classList.add('active');
    if (name === 'list') btnList.classList.add('active');
  }

  document.getElementById('reset-form').addEventListener('click', () => document.getElementById('register-form').reset());

  // register form submit - try POST to API, fall back to local update
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const form = ev.target;
      const fd = new FormData(form);
      const payload = {
        name: fd.get('name'),
        address: fd.get('address'),
        phone_number: fd.get('phone'),
        country: fd.get('country') || ''
      };
      // attempt to POST to API
      try {
        const res = await tryFetch('/pharmacies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res && res.ok) {
          const created = await res.json();
          // assume API returns created item or id
          if (created) currentItems.unshift(created);
          else currentItems.unshift(payload);
          renderList(currentItems);
          updateMap(currentItems);
          alert('Registered (synced to API)');
          form.reset();
          return;
        }
      } catch (e) {
        // ignore and fallback to local
      }
      // fallback local update
      currentItems.unshift({ ...payload, services: 'Prescription, OTC', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80' });
      renderList(currentItems);
      updateMap(currentItems);
      alert('Registered locally (no API connection)');
      form.reset();
    });
  }

  // search & filter behaviour
  const searchInput = document.getElementById('search');
  const countryFilter = document.getElementById('country-filter');
  const suggestionsEl = document.getElementById('suggestions');

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value;
    populateSuggestions(q);
    filterList();
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      const opt = suggestionsEl.querySelector('.option'); if (opt) opt.focus();
    }
  });
  countryFilter.addEventListener('change', () => filterList());

  // modal
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  document.getElementById('modal-close').addEventListener('click', () => modal.classList.add('hidden'));

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('.btn.ghost')) {
      const id = target.getAttribute('data-id');
      openDetails(id);
    }
  });

  async function openDetails(id) {
    if (id === null || id === undefined) return;
    const item = currentItems[id];
    if (!item) return;
    // Get user's location for directions
    let userLoc = null;
    if (navigator.geolocation) {
      try {
        userLoc = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            err => resolve(null),
            { enableHighAccuracy: true, timeout: 5000 }
          );
        });
      } catch(e){}
    }
    modalBody.innerHTML = `
      <div class="modal-details">
        <img src="${item.image}" alt="${escapeHtml(item.name)}" class="pharmacy-img" style="width:90px;height:90px;float:right;margin-left:18px;border-radius:16px;box-shadow:0 2px 12px #0b63a344" />
        <h2 style="margin-top:0">${escapeHtml(item.name)}</h2>
        <div style="color:#1070c6;font-weight:600">${escapeHtml(item.country)}${item.city ? ', '+escapeHtml(item.city) : ''}</div>
        <div style="margin:8px 0;color:#444">${escapeHtml(item.address||'')}</div>
        <div style="margin:8px 0;color:#0b63a3;font-weight:700"><a href="tel:${escapeHtml(item.phone_number||'')}">${escapeHtml(item.phone_number||'')}</a></div>
        <div style="margin:8px 0;color:#444">${escapeHtml(item.services||'')}</div>
        <button class="btn primary" id="modal-map-btn" aria-label="Show on map">Show on Map</button>
        <button class="btn accent" id="modal-directions-btn" aria-label="Get directions">Get Directions</button>
        <div id="directions-content"></div>
      </div>
    `;
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-content').style.opacity = '1';
      modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
    document.getElementById('modal-close').addEventListener('click', () => {
      modal.querySelector('.modal-content').style.opacity = '0';
      modal.querySelector('.modal-content').style.transform = 'scale(0.92)';
      setTimeout(() => modal.classList.add('hidden'), 320);
    });
    setTimeout(() => { document.getElementById('modal-close').focus(); }, 100);
    document.getElementById('modal-map-btn').onclick = () => {
      highlightOnMap(item);
      modal.classList.add('hidden');
    };
    document.getElementById('modal-directions-btn').onclick = async () => {
      if (!userLoc) {
        document.getElementById('directions-content').innerHTML = '<p>Could not get your location.</p>';
        return;
      }
      const destLat = item.latitude || item.lat;
      const destLng = item.longitude || item.lng;
      if (!destLat || !destLng) {
        document.getElementById('directions-content').innerHTML = '<p>No location for this pharmacy.</p>';
        return;
      }
      try {
        const res = await fetch(`/directions?origin=${userLoc.lat},${userLoc.lng}&destination=${destLat},${destLng}`);
        const data = await res.json();
        if (data && data.routes && data.routes.length) {
          const steps = data.routes[0].legs[0].steps.map(s => `<li>${s.html_instructions}</li>`).join('');
          document.getElementById('directions-content').innerHTML = `<h4>Directions</h4><ol>${steps}</ol>`;
          // Draw route on map
          const route = data.routes[0].overview_polyline.points;
          if (window.L && route) {
            if (window.routeLayer) { window.map.removeLayer(window.routeLayer); }
            const decoded = decodePolyline(route);
            window.routeLayer = L.polyline(decoded, { color: '#1070c6', weight: 5 }).addTo(window.map);
            window.map.fitBounds(window.routeLayer.getBounds());
          }
        } else {
          document.getElementById('directions-content').innerHTML = '<p>No directions found.</p>';
        }
      } catch(e) {
        document.getElementById('directions-content').innerHTML = '<p>Directions unavailable.</p>';
      }
    };

// Polyline decoder for Google overview_polyline
function decodePolyline(encoded) {
  let points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = 0; result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}
  }

  // Keyboard accessibility for modal
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('hidden')) {
      if (e.key === 'Escape') modal.classList.add('hidden');
      if (e.key === 'Tab') {
        // trap focus
        const focusables = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        if (focusables.length) {
          const first = focusables[0], last = focusables[focusables.length-1];
          if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
          else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
      }
    }
  });

  function highlightOnMap(item) {
    if (!item || !item.city) return;
    // Use city geocodes for demo (real app: use lat/lng)
    const cityCoords = {
      'Kampala': [0.3136,32.5811],
      'Nairobi': [-1.286389,36.817223],
      'Dar es Salaam': [-6.7924,39.2083],
      'Kigali': [-1.9536,30.0605],
      'Bujumbura': [-3.3822,29.3644],
      'Juba': [4.8517,31.5825],
      'Addis Ababa': [9.03,38.74]
    };
    const coords = cityCoords[item.city] || [0,0];
    if (window.map) {
      window.map.setView(coords, 13, { animate: true });
      if (window.markersLayer) {
        window.markersLayer.clearLayers();
        const marker = L.marker(coords).addTo(window.markersLayer).bindPopup(`<b>${escapeHtml(item.name)}</b><br/>${escapeHtml(item.address||'')}`).openPopup();
      }
    }
    // Switch to map view
    document.getElementById('btn-find').click();
  }
  loadAll();
  // map
  setTimeout(initMap, 200); // initialize map shortly after DOM ready
}); // <-- Add this closing brace for DOMContentLoaded event listener

// filter list based on currentItems
function filterList() {
  const q = (document.getElementById('search').value || '').toLowerCase();
  const country = document.getElementById('country-filter').value || '';
  document.querySelectorAll('#list .item').forEach(it => {
    const idx = parseInt(it.getAttribute('data-idx') || it.querySelector('button')?.getAttribute('data-id') || 0, 10);
    const item = currentItems[idx];
    if (!item) return;
    const txt = (item.name + ' ' + (item.address||'') + ' ' + (item.city||'') + ' ' + (item.country||'')).toLowerCase();
    const matchesQ = !q || txt.includes(q);
    const matchesCountry = !country || item.country === country;
    it.style.display = (matchesQ && matchesCountry) ? '' : 'none';
  });
}

// populate suggestion dropdown
function populateSuggestions(q) {
  const el = document.getElementById('suggestions');
  if (!q || q.trim().length < 1) { el.classList.add('hidden'); el.innerHTML = ''; return; }
  const lowered = q.toLowerCase();
  const matches = currentItems.filter(i => (i.name + ' ' + (i.city||'') + ' ' + (i.country||'')).toLowerCase().includes(lowered)).slice(0,8);
  if (!matches.length) { el.classList.add('hidden'); el.innerHTML = ''; return; }
  el.classList.remove('hidden');
  el.innerHTML = matches.map(m => `<div class="option" tabindex="0" data-idx="${currentItems.indexOf(m)}" role="option">${escapeHtml(m.name)} — ${escapeHtml(m.city || m.country || '')}</div>`).join('');
  el.querySelectorAll('.option').forEach(o => {
    o.addEventListener('click', () => {
      const idx = parseInt(o.getAttribute('data-idx'), 10);
      const item = currentItems[idx];
      document.getElementById('search').value = item.name;
      el.classList.add('hidden');
      filterList();
      openDetails(idx);
    });
    o.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') o.click();
      if (ev.key === 'ArrowDown') { const next = o.nextElementSibling; if (next) next.focus(); }
      if (ev.key === 'ArrowUp') { const prev = o.previousElementSibling; if (prev) prev.focus(); else document.getElementById('search').focus(); }
    });
  });
}

// hide suggestions on outside click
document.addEventListener('click', (e) => {
  const sug = document.getElementById('suggestions');
  const search = document.getElementById('search');
  if (!sug) return;
  if (e.target === search) return;
  if (!sug.contains(e.target)) sug.classList.add('hidden');
});

let map, markersLayer;
function initMap() {
  try {
    map = L.map('map').setView([1.2,33.1], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    // use marker cluster if available
    if (L.markerClusterGroup) {
      markersLayer = L.markerClusterGroup();
      map.addLayer(markersLayer);
    } else {
      markersLayer = L.layerGroup().addTo(map);
    }
    // draw current items immediately
    updateMap(currentItems);
    // try refresh from API and replace items if available
    tryFetch('/pharmacies').then(async r => {
      if (!r || !r.ok) return;
      const data = await r.json();
      const items = Array.isArray(data) ? data : (data.data || []);
      if (items && items.length) {
        currentItems = items;
        renderList(currentItems);
        updateMap(currentItems);
      }
    }).catch(()=>{});
  } catch (e) {
    console.warn('Map init failed', e);
  }
}
