const express = require('express');
const router = express.Router();
const { createTrip, getTrips, getTripById, updateTrip, deleteTrip,getTripSuggestions } = require('../controllers/tripController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Admin & Operator can create/update/delete
router.post('/', protect, authorizeRoles('admin', 'operator'), createTrip);
router.get('/', getTrips);
router.get('/suggestions', getTripSuggestions);
router.get('/:id', getTripById);
router.put('/:id', protect, authorizeRoles('admin', 'operator'), updateTrip);
router.delete('/:id', protect, authorizeRoles('admin', 'operator'), deleteTrip);
//
module.exports = router;
