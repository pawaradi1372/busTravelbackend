import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

// Make Payment
export const makePayment = async (req, res) => {
  try {
    const { bookingId, transactionId, amount, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const payment = await Payment.create({
      booking: bookingId,
      transactionId,
      amount,
      paymentMethod,
      status: "success"
    });

    booking.paymentStatus = "paid";
    await booking.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Payment by Booking ID
export const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId });
    if (!payment) return res.status(404).json({ message: "No payment found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
