// services/allocationService.js — AI Scoring Engine (v2)
//
// Score formula:
//   score = (DIST_WEIGHT * normDist) + (SEV_WEIGHT * normSev) + TYPE_PENALTY
//
// TYPE_PENALTY = 0 if resource type matches request type, else 0.5
// Lower score = better match. Type mismatch is heavily penalised.

const DIST_WEIGHT   = 0.4;   // distance contribution
const SEV_WEIGHT    = 0.3;   // severity contribution
const TYPE_PENALTY  = 0.5;   // added when type does NOT match (big penalty)
const SEVERITY_MAP  = { high: 3, medium: 2, low: 1 };

/** Haversine great-circle distance in km */
function haversine(lat1, lng1, lat2, lng2) {
  const R    = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * scoreAndRank(request, availableResources)
 *
 * Scores ALL available resources regardless of type.
 * A type mismatch adds a heavy penalty (TYPE_PENALTY = 0.5) to the score
 * so the correct type always ranks above a wrong type at similar distance.
 *
 * Each resource gets: _dist (km), _typeMatch (bool), _score
 */
function scoreAndRank(request, availableResources) {
  const sevNum  = SEVERITY_MAP[request.severity] || 1;
  const reqType = request.type && request.type !== 'any' ? request.type : null;

  // Pre-compute distances
  const withDist = availableResources.map(r => ({
    ...r,
    _dist: parseFloat(haversine(request.lat, request.lng, r.lat, r.lng).toFixed(2)),
  }));

  const maxDist = Math.max(...withDist.map(r => r._dist)) || 1;

  const scored = withDist.map(r => {
    const normDist    = r._dist / maxDist;
    const normSev     = (4 - sevNum) / 3;         // invert: high sev → lower normSev
    const typeMatch   = !reqType || r.type === reqType;
    const typePenalty = typeMatch ? 0 : TYPE_PENALTY;

    const score = parseFloat(
      (DIST_WEIGHT * normDist + SEV_WEIGHT * normSev + typePenalty).toFixed(4)
    );

    return { ...r, _typeMatch: typeMatch, _score: score };
  });

  // Sort ascending — lower score = better
  return scored.sort((a, b) => a._score - b._score);
}

module.exports = { scoreAndRank };