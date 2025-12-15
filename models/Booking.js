import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  seatsBooked: [String],
  totalAmount: Number,
  bookingDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  ticketStatus: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
});

export default mongoose.model("Booking", bookingSchema);
