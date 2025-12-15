const express = require('express');
const router = express.Router();
const { makePayment, getPaymentByBooking } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Passenger makes payment
router.post('/', protect, authorizeRoles('passenger'), makePayment);

// Admin & Operator can check payment status
router.get('/:bookingId', protect, authorizeRoles('admin', 'operator', 'passenger'), getPaymentByBooking);

module.exports = router;
