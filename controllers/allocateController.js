// controllers/allocateController.js
const { resources, requests, allocations } = require('../models/store');
const { scoreAndRank } = require('../services/allocationService');

// POST /allocate — allocate best available resource to a request
// POST /allocate — allocate best resource to a request
function allocateResource(req, res) {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: 'requestId is required' });

  const request = requests.find(r => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  if (request.status !== 'pending') {
    return res.status(409).json({ error: 'Request is not in pending state' });
  }

  // Pass ALL available resources — scoring handles type preference
  const available = resources.filter(r => r.status === 'available');

  if (!available.length) {
    return res.status(503).json({ error: 'No available resources at this time' });
  }

  // AI scoring: type-matched resources score lower (better) automatically
  const ranked   = scoreAndRank(request, available);
  const best     = ranked[0];

  // Warn in response if no exact type match was available
  const exactMatchFound = ranked[0]._typeMatch;

  const resource = resources.find(r => r.id === best.id);
  resource.status = 'assigned';
  request.status  = 'assigned';

  const allocation = {
    id:              `AL-${Date.now().toString().slice(-5)}`,
    requestId:       request.id,
    resourceId:      resource.id,
    resourceName:    resource.name,
    resourceType:    resource.type,
    requestedType:   request.type || 'any',      // ← NEW: what was requested
    typeMatchFound:  exactMatchFound,              // ← NEW: was ideal type available?
    location:        request.location,
    severity:        request.severity,
    distance:        best._dist,
    score:           best._score,
    candidates:      ranked.map(r => ({
      id:        r.id,
      name:      r.name,
      type:      r.type,
      typeMatch: r._typeMatch,                    // ← NEW: show match in breakdown
      distance:  r._dist,
      score:     r._score,
    })),
    status:    'in-progress',
    createdAt: new Date().toISOString(),
  };
  allocations.push(allocation);

  res.status(201).json(allocation);
}

// PATCH /allocate/:id/complete — mark allocation as completed, free resource
function completeAllocation(req, res) {
  const alloc = allocations.find(a => a.id === req.params.id);
  if (!alloc) return res.status(404).json({ error: 'Allocation not found' });

  alloc.status = 'completed';

  const resource = resources.find(r => r.id === alloc.resourceId);
  if (resource) resource.status = 'available';

  const request = requests.find(r => r.id === alloc.requestId);
  if (request) request.status = 'completed';

  res.json(alloc);
}

// GET /allocate — list all allocations
function getAllocations(req, res) {
  res.json(allocations);
}

module.exports = { allocateResource, completeAllocation, getAllocations };
