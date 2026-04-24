// routes/allocate.js
const express = require('express');
const router  = express.Router();
const { allocateResource, completeAllocation, getAllocations } = require('../controllers/allocateController');

router.post('/',               allocateResource);    // POST  /allocate
router.patch('/:id/complete',  completeAllocation);  // PATCH /allocate/:id/complete
router.get('/',                getAllocations);       // GET   /allocate

module.exports = router;
