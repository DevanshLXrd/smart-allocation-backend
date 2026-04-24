// routes/resources.js
const express = require('express');
const router  = express.Router();
const { getResources, addResource, updateStatus } = require('../controllers/resourceController');

router.get('/',           getResources);   // GET  /resources
router.post('/',          addResource);    // POST /resources
router.patch('/:id/status', updateStatus); // PATCH /resources/:id/status

module.exports = router;
