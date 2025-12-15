const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  getBookingById,
  getBookedSeats
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Passenger - book & view their bookings
router.post('/', protect, authorizeRoles('passenger'), createBooking);
router.get('/my', protect, authorizeRoles('passenger'), getMyBookings);
router.put('/cancel/:id', protect, authorizeRoles('passenger'), cancelBooking);

// Get booked seats for a trip
router.get("/booked-seats/:tripId", protect, authorizeRoles('passenger','operator','admin'), getBookedSeats);

// Admin & Operator - can view all bookings (their buses)
router.get('/', protect, authorizeRoles('admin', 'operator'), getAllBookings);
router.get('/:id', protect, getBookingById);

module.exports = router;
