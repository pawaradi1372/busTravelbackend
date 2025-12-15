const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema({
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  stops: [String], // e.g., ['Pune', 'Lonavala', 'Mumbai']
  distance: Number,
  duration: String
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
