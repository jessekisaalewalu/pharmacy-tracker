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

async function loadAll() {
  const listEl = document.getElementById('list');
  const nearbyEl = document.getElementById('nearby');
  const slideshowEl = document.getElementById('slideshow');
  const badge = document.getElementById('badge');
  listEl.innerHTML = '<div class="loading">Loading…</div>';
  nearbyEl.innerHTML = '';
  slideshowEl.innerHTML = '';
  try {
    const res = await tryFetch('/pharmacies');
    if (!res.ok) throw new Error('Network');
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.data || []);
    badge.innerText = items.length;
    // build list
    listEl.innerHTML = items.map(item => `\n      <div class="item">\n        <div style=\"flex:1\">\n          <div style=\"font-weight:700\">${escapeHtml(item.name)}</div>\n          <div style=\"color:#666\">${escapeHtml(item.address || '')}</div>\n          <div style=\"color:#0b63a3;font-weight:700\">${escapeHtml(item.phone_number || '')}</div>\n        </div>\n        <div>\n          <button class=\"btn ghost\" data-id=\"${item.id}\">Details</button>\n        </div>\n      </div>\n    `).join('');

    // nearby and slideshow use first 5
    const first = items.slice(0, 6);
    nearbyEl.innerHTML = first.map(i => `<div class="item"><div style="flex:1"><div style="font-weight:700">${escapeHtml(i.name)}</div><div style="color:#666">${escapeHtml(i.address || '')}</div></div></div>`).join('');

    // slideshow
    first.forEach((i, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.style.opacity = idx === 0 ? '1' : '0';
      slide.style.transform = idx === 0 ? 'translateX(0)' : 'translateX(40px)';
      slide.innerHTML = `<div class="meta"><h3 style="margin:0">${escapeHtml(i.name)}</h3><p style="margin:6px 0;color:#444">${escapeHtml(i.address || '')}</p></div><div class="overlay"></div>`;
      slideshowEl.appendChild(slide);
    });
    startSlideshow();
  } catch (err) {
    listEl.innerHTML = '<div style="color:red">Failed to load pharmacies</div>';
  }
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
  const btnFind = document.getElementById('btn-find');
  const btnReg = document.getElementById('btn-register');
  const btnList = document.getElementById('btn-list');
  const sections = { find: document.getElementById('find-section'), register: document.getElementById('register-section'), list: document.getElementById('list-section') };
  const navBtns = document.querySelectorAll('.nav-btn');

  function activate(name) {
    setTimeout(() => {
      badge.innerText = PHARMACIES.length;
      // build list
      listEl.innerHTML = PHARMACIES.map((item, idx) => `
        <div class="item" style="animation-delay:${idx*0.08}s">
          <img src="${item.image}" alt="${escapeHtml(item.name)}" class="pharmacy-img" />
          <div class="pharmacy-meta">
            <div style="font-weight:700;font-size:1.1em">${escapeHtml(item.name)}</div>
            <div style="color:#666">${escapeHtml(item.address || '')}</div>
            <div style="color:#0b63a3;font-weight:700">${escapeHtml(item.phone_number || '')}</div>
            <div style="color:#1070c6;font-size:0.95em">${escapeHtml(item.country)}</div>
            <div style="color:#444;font-size:0.95em">${escapeHtml(item.services)}</div>
          </div>
          <div>
            <button class="btn ghost" data-id="${idx}">Details</button>
          </div>
        </div>
      `).join('');

      // nearby and slideshow use first 5
      const first = PHARMACIES.slice(0, 6);
      nearbyEl.innerHTML = first.map(i => `<div class="item"><img src="${i.image}" class="pharmacy-img" /><div class="pharmacy-meta"><div style="font-weight:700">${escapeHtml(i.name)}</div><div style="color:#666">${escapeHtml(i.address || '')}</div></div></div>`).join('');

      // slideshow
      first.forEach((i, idx) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.opacity = idx === 0 ? '1' : '0';
        slide.style.transform = idx === 0 ? 'translateX(0)' : 'translateX(40px)';
        slide.innerHTML = `<div class="meta"><h3 style="margin:0">${escapeHtml(i.name)}</h3><p style="margin:6px 0;color:#444">${escapeHtml(i.address || '')}</p></div><img src="${i.image}" class="pharmacy-img" style="margin-left:18px" /><div class="overlay"></div>`;
        slideshowEl.appendChild(slide);
      });
      startSlideshow();
    }, 400);
  document.getElementById('reset-form').addEventListener('click', () => document.getElementById('register-form').reset());

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

  function openDetails(id) {
    if (id === null || id === undefined) return;
    const item = PHARMACIES[id];
    if (!item) return;
    modalBody.innerHTML = `
      <div class="modal-details">
        <img src="${item.image}" alt="${escapeHtml(item.name)}" class="pharmacy-img" style="width:90px;height:90px;float:right;margin-left:18px;border-radius:16px;box-shadow:0 2px 12px #0b63a344" />
        <h2 style="margin-top:0">${escapeHtml(item.name)}</h2>
        <div style="color:#1070c6;font-weight:600">${escapeHtml(item.country)}${item.city ? ', '+escapeHtml(item.city) : ''}</div>
        <div style="margin:8px 0;color:#444">${escapeHtml(item.address||'')}</div>
        <div style="margin:8px 0;color:#0b63a3;font-weight:700">${escapeHtml(item.phone_number||'')}</div>
        <div style="margin:8px 0;color:#444">${escapeHtml(item.services||'')}</div>
        <button class="btn primary" id="modal-map-btn" aria-label="Show on map">Show on Map</button>
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
    // Focus for accessibility
    setTimeout(() => { document.getElementById('modal-close').focus(); }, 100);
    // Map button
    document.getElementById('modal-map-btn').onclick = () => {
      highlightOnMap(item);
      modal.classList.add('hidden');
    };
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
setTimeout(initMap, 400); // wait a bit until DOM ready and layout

let map, markersLayer;
function initMap() {
  try {
    map = L.map('map').setView([0,0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
    // load markers
    tryFetch('/pharmacies').then(r => r.json()).then(data => {
      const items = Array.isArray(data) ? data : data.data || [];
      if (!items.length) return;
      markersLayer.clearLayers();
      const bounds = [];
      items.forEach(i => {
        if (i.latitude && i.longitude) {
          const m = L.marker([i.latitude, i.longitude]).bindPopup(`<b>${escapeHtml(i.name)}</b><br/>${escapeHtml(i.address||'')}`);
          markersLayer.addLayer(m);
          bounds.push([i.latitude, i.longitude]);
        }
      });
      if (bounds.length) map.fitBounds(bounds, { padding: [40,40] });
    }).catch(()=>{});
  } catch(e){}
}
