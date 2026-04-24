// ============================================================
// models/store.js — In-memory data store (replaces MongoDB for MVP)
// Swap this file with a real DB adapter when you're ready to scale.
// ============================================================

// Seed resources — preloaded at startup
const resources = [
  { id: 'R1', name: 'Ambulance Alpha',  type: 'Ambulance',  lat: 28.6100, lng: 77.2100, status: 'available' },
  { id: 'R2', name: 'Ambulance Bravo',  type: 'Ambulance',  lat: 28.6500, lng: 77.2400, status: 'available' },
  { id: 'R3', name: 'Responder Delta',  type: 'Responder',  lat: 28.5800, lng: 77.1900, status: 'available' },
  { id: 'R4', name: 'Responder Echo',   type: 'Responder',  lat: 28.6300, lng: 77.2800, status: 'available' },
  { id: 'R5', name: 'Delivery Unit-1',  type: 'Delivery',   lat: 28.6000, lng: 77.2200, status: 'available' },
  { id: 'R6', name: 'Delivery Unit-2',  type: 'Delivery',   lat: 28.6700, lng: 77.2000, status: 'available' },
];

// Requests submitted by users
const requests = [];

// Allocation records (one per successful allocation)
const allocations = [];

module.exports = { resources, requests, allocations };
