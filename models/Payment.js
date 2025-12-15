import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  transactionId: String,
  amount: Number,
  paymentMethod: { type: String, enum: ["card", "upi", "netbanking", "cash"] },
  status: { type: String, enum: ["success", "failed", "pending"] },
  paymentDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
