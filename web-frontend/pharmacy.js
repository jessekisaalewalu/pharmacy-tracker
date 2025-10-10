// pharmacy detail page script
const API_BASE = window.API_BASE || (new URLSearchParams(window.location.search).get('api')) || 'http://127.0.0.1:8000/api/v1';
const parts = window.location.pathname.split('/');
const id = new URLSearchParams(window.location.search).get('id') || parts[parts.length-1] || '';

async function load() {
  if (!id) return document.getElementById('card').innerText = 'Missing id';
  try {
    const res = await fetch(`${API_BASE.replace(/\/+$/,'')}/pharmacies/${id}`);
    if (!res.ok) throw new Error('Not found');
    const d = await res.json();
    const item = Array.isArray(d) ? d[0] : (d.data || d || {});
    document.getElementById('name').innerText = item.name || '—';
    document.getElementById('address').innerText = item.address || '';
    document.getElementById('phone').innerText = item.phone_number || '';

    document.getElementById('delete').addEventListener('click', async () => {
      if (!confirm('Delete this pharmacy?')) return;
      const r = await fetch(`${API_BASE.replace(/\/+$/,'')}/pharmacies/${id}`, { method: 'DELETE' });
      if (r.ok) { document.getElementById('message').innerText = 'Deleted'; setTimeout(()=>location.href='index.html',800); }
      else document.getElementById('message').innerText = 'Delete failed';
    });

    document.getElementById('edit').addEventListener('click', () => {
      const name = prompt('Name', item.name);
      const addr = prompt('Address', item.address);
      const phone = prompt('Phone', item.phone_number);
      fetch(`${API_BASE.replace(/\/+$/,'')}/pharmacies/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name, address: addr, phone_number: phone }) }).then(r => {
        if (r.ok) { document.getElementById('message').innerText = 'Updated'; load(); }
        else document.getElementById('message').innerText = 'Update failed';
      });
    });
  } catch (e) {
    document.getElementById('card').innerText = 'Failed to load';
  }
}

window.addEventListener('DOMContentLoaded', load);
