import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";

// Create Booking
export const createBooking = async (req, res) => {
  try {
    const { trip, seatsBooked, totalAmount } = req.body;

    // Fetch trip with bus details
    const tripData = await Trip.findById(trip).populate('bus');
    if (!tripData) return res.status(404).json({ message: 'Trip not found' });

    // Check if requested seats are available
    const bookedSeats = [];
    const bookings = await Booking.find({ trip });
    bookings.forEach(b => bookedSeats.push(...b.seatsBooked));

    for (const seat of seatsBooked) {
      if (bookedSeats.includes(seat)) {
        return res.status(400).json({ message: `Seat ${seat} is already booked` });
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      trip,
      seatsBooked,
      totalAmount,
      paymentStatus: 'pending',
      ticketStatus: 'confirmed'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Bookings (Passenger)
// Get My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'trip',
        populate: [
          { 
            path: 'bus', 
            populate: { path: 'operator', select: 'fullName' } // ✅ populate operator
          },
          { path: 'route' }
        ]
      });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Cancel Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('trip');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.ticketStatus = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Bookings (Admin / Operator)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate({
        path: 'trip',
        populate: { path: 'bus' }
      });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate({
        path: 'trip',
        populate: [
          { path: 'bus' },
          { path: 'route' } // <--- Populate route too
        ]
      });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Booked Seats for a Trip
export const getBookedSeats = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!tripId) return res.status(400).json({ message: 'Trip ID required' });

    // Fetch all bookings for the trip
    const bookings = await Booking.find({ trip: tripId });

    // Extract seats
    const bookedSeats = bookings.flatMap(b => b.seatsBooked);

    res.json({ bookedSeats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
