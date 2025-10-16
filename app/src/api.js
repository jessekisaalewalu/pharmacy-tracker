// app/src/api.js
// Change BACKEND to your machine's LAN IP when testing on a physical device
// e.g. const BACKEND = 'http://192.168.1.100:4000';
const BACKEND = 'http://localhost:4000';

async function safeFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(`Request failed ${res.status} ${res.statusText} ${text ? '- ' + text : ''}`);
  }
  return res.json().catch(() => ({}));
}

export async function fetchNearest(lat, lng, limit = 5) {
  const url = `${BACKEND}/api/pharmacies?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&limit=${encodeURIComponent(limit)}`;
  return safeFetch(url);
}

export async function fetchAll() {
  const url = `${BACKEND}/api/pharmacies`;
  return safeFetch(url);
}

export async function createPharmacy(payload) {
  return safeFetch(`${BACKEND}/api/pharmacies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export async function updatePharmacy(id, payload) {
  return safeFetch(`${BACKEND}/api/pharmacies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export async function deletePharmacy(id) {
  return safeFetch(`${BACKEND}/api/pharmacies/${id}`, { method: 'DELETE' });
}
