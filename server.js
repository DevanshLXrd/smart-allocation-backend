// ============================================================
// Smart Resource Allocation System — Backend Entry Point
// Stack: Node.js + Express, in-memory JSON (no DB needed for MVP)
// Run: node server.js
// ============================================================

const express = require('express');
const cors    = require('cors');

const resourceRoutes   = require('./routes/resources');
const requestRoutes    = require('./routes/requests');
const allocateRoutes   = require('./routes/allocate');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors());                    // allow frontend calls
app.use(express.json());            // parse JSON bodies

// ── Routes ────────────────────────────────────────────────
app.use('/resources', resourceRoutes);
app.use('/request',   requestRoutes);
app.use('/allocate',  allocateRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Resource Allocation API running' }));

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
