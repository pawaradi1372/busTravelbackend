const express = require('express');
const router = express.Router();
const { createRoute, getRoutes, updateRoute, deleteRoute } = require('../controllers/routeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Only Admin can manage routes
router.post('/', protect, authorizeRoles('admin'), createRoute);
router.get('/', getRoutes);
router.put('/:id', protect, authorizeRoles('admin'), updateRoute);
router.delete('/:id', protect, authorizeRoles('admin'), deleteRoute);

module.exports = router;
