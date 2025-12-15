const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    pricePerSeat: { type: Number, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
