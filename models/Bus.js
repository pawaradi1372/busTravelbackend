const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },

 operator: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  
  seatLayout: [{ 
    seatNumber: String, 
    isAvailable: Boolean 
  }],
  
  amenities: [String],
  
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
