// routes/requests.js
const express = require('express');
const router  = express.Router();
const { createRequest, getRequests } = require('../controllers/requestController');

router.post('/', createRequest);  // POST /request
router.get('/',  getRequests);    // GET  /request

module.exports = router;
