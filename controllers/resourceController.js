// controllers/resourceController.js
const { resources } = require('../models/store');

// GET /resources — list all resources (optionally filter by status)
function getResources(req, res) {
  const { status } = req.query;
  const result = status
    ? resources.filter(r => r.status === status)
    : resources;
  res.json(result);
}

// POST /resources — add a new resource (admin use)
function addResource(req, res) {
  const { name, type, lat, lng } = req.body;
  if (!name || !type || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'name, type, lat and lng are required' });
  }
  const resource = {
    id: `R${Date.now().toString().slice(-5)}`,
    name, type,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    status: 'available',
  };
  resources.push(resource);
  res.status(201).json(resource);
}

// PATCH /resources/:id/status — update resource status
function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['available', 'assigned', 'busy'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
  }
  const resource = resources.find(r => r.id === id);
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  resource.status = status;
  res.json(resource);
}

module.exports = { getResources, addResource, updateStatus };
