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
    Object.values(sections).forEach(s => s.classList.remove('active'));
    sections[name].classList.add('active');
    navBtns.forEach(b => b.classList.remove('active'));
    if (name === 'find') btnFind.classList.add('active');
    if (name === 'register') btnReg.classList.add('active');
    if (name === 'list') btnList.classList.add('active');
  }

  btnFind.addEventListener('click', () => activate('find'));
  btnReg.addEventListener('click', () => activate('register'));
  btnList.addEventListener('click', () => { activate('list'); loadAll(); });

  document.getElementById('search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#list .item').forEach(it => {
      const txt = it.innerText.toLowerCase();
      it.style.display = txt.includes(q) ? '' : 'none';
    });
  });

  // register form
  document.getElementById('register-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const formData = new FormData(form);
    const payload = { name: formData.get('name'), address: formData.get('address'), phone_number: formData.get('phone') };
    try {
      const res = await tryFetch('/pharmacies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed');
      alert('Registered');
      form.reset();
      loadAll();
    } catch (err) {
      alert('Failed to register');
    }
  });

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
    if (!id) return;
    modalBody.innerHTML = '<div>Loading…</div>';
    modal.classList.remove('hidden');
    tryFetch(`/pharmacies/${id}`).then(async res => {
      if (!res.ok) return modalBody.innerHTML = '<div>Failed to load</div>';
      const d = await res.json();
      const item = Array.isArray(d) ? d[0] : (d.data || d);
      modalBody.innerHTML = `<h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.address||'')}</p><p>${escapeHtml(item.phone_number||'')}</p>`;
    }).catch(err => modalBody.innerHTML = '<div>Network error</div>');
  }

  loadAll();
  // map
  setTimeout(initMap, 400); // wait a bit until DOM ready and layout
});

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
