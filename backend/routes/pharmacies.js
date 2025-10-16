const express = require('express');
const router = express.Router();
const { db } = require('../db');


// helper: compute haversine distance between two coords in kilometers
function haversine(lat1, lon1, lat2, lon2) {
function toRad(x) { return x * Math.PI / 180; }
const R = 6371; // km
const dLat = toRad(lat2 - lat1);
const dLon = toRad(lon2 - lon1);
const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
Math.sin(dLon/2) * Math.sin(dLon/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
return R * c;
}


// GET /api/pharmacies
// if lat & lng provided, returns nearest sorted by distance (adds distance field)
router.get('/', (req, res) => {
const { lat, lng, limit } = req.query;
db.all('SELECT * FROM pharmacies', [], (err, rows) => {
if (err) return res.status(500).json({ error: err.message });
if (lat && lng) {
const userLat = parseFloat(lat);
const userLng = parseFloat(lng);
const enriched = rows.map(r => ({ ...r, distance_km: haversine(userLat, userLng, r.latitude || 0, r.longitude || 0) }));
enriched.sort((a,b) => a.distance_km - b.distance_km);
let out = enriched;
if (limit) out = enriched.slice(0, parseInt(limit));
return res.json(out);
}
res.json(rows);
});
});


// GET one
router.get('/:id', (req, res) => {
const id = req.params.id;
db.get('SELECT * FROM pharmacies WHERE id = ?', [id], (err, row) => {
if (err) return res.status(500).json({ error: err.message });
if (!row) return res.status(404).json({ error: 'Not found' });
res.json(row);
});
});


// POST create
router.post('/', (req, res) => {
const { name, contact, address, latitude, longitude, description } = req.body;
if (!name) return res.status(400).json({ error: 'Name is required' });
const sql = `INSERT INTO pharmacies (name, contact, address, latitude, longitude, description) VALUES (?,?,?,?,?,?)`;
db.run(sql, [name, contact || '', address || '', latitude || null, longitude || null, description || ''], function(err) {
if (err) return res.status(500).json({ error: err.message });
db.get('SELECT * FROM pharmacies WHERE id = ?', [this.lastID], (err, row) => {
if (err) return res.status(500).json({ error: err.message });
res.status(201).json(row);
});
});
});


// PUT update
router.put('/:id', (req, res) => {
const id = req.params.id;
const { name, contact, address, latitude, longitude, description } = req.body;
const sql = `UPDATE pharmacies SET name = ?, contact = ?, address = ?, latitude = ?, longitude = ?, description = ? WHERE id = ?`;
db.run(sql, [name, contact, address, latitude, longitude, description, id], function(err) {
if (err) return res.status(500).json({ error: err.message });
db.get('SELECT * FROM pharmacies WHERE id = ?', [id], (err, row) => {
if (err) return res.status(500).json({ error: err.message });
res.json(row);
});
});
});


// DELETE
router.delete('/:id', (req, res) => {
const id = req.params.id;
db.run('DELETE FROM pharmacies WHERE id = ?', [id], function(err) {
if (err) return res.status(500).json({ error: err.message });
res.json({ deleted: this.changes });
});
});


module.exports = router;