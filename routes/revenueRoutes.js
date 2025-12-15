const express = require('express');
const { getOperatorRevenue,getAllOperatorsRevenue } = require('../controllers/revenueController');
const { protect,admin } = require('../middlewares/authMiddleware');
// ensure path is correct

const router = express.Router();

// Protect route with middleware
router.get('/my',protect, getOperatorRevenue);
// Only admin can access all operators revenue
router.get("/", protect, admin, getAllOperatorsRevenue);

module.exports = router;
