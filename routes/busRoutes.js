const express = require('express');
const router = express.Router();
const { createBus, getBuses, updateBus, deleteBus } = require('../controllers/busController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Admin & Operator
router.post('/', protect, authorizeRoles('admin', 'operator'), createBus);
router.get('/', protect, getBuses);
router.put('/:id', protect, authorizeRoles('admin', 'operator'), updateBus);
router.delete('/:id', protect, authorizeRoles('admin', 'operator'), deleteBus);

module.exports = router;
