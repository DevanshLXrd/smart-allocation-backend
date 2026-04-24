// controllers/requestController.js
const { requests } = require('../models/store');

// POST /request — create a new request
function createRequest(req, res) {
  const { location, lat, lng, severity, description, type } = req.body;
  if (!location || lat === undefined || lng === undefined || !severity) {
    return res.status(400).json({ error: 'location, lat, lng and severity are required' });
  }
  const allowed = ['low', 'medium', 'high'];
  if (!allowed.includes(severity)) {
    return res.status(400).json({ error: `severity must be one of: ${allowed.join(', ')}` });
  }
  const request = {
    id: `REQ-${Date.now().toString().slice(-5)}`,
    location,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    severity,
    description: description || '',
    type: type || 'any',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  requests.push(request);
  res.status(201).json(request);
}

// GET /request — list all requests
function getRequests(req, res) {
  res.json(requests);
}

module.exports = { createRequest, getRequests };
