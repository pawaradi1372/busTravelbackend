import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import Bus from "../models/Bus.js";
import User from "../models/User.js";

export const getAllOperatorsRevenue = async (req, res) => {
  try {
    const operators = await User.find({ role: "operator" })
      .select("_id fullName email phone");

    const operatorData = await Promise.all(
      operators.map(async (op) => {

        const buses = await Bus.find({ operator: op._id }).select("_id");
        const busIds = buses.map(b => b._id);

        const trips = await Trip.find({ bus: { $in: busIds } }).select("_id");
        const tripIds = trips.map(t => t._id);

        const bookings = await Booking.find({
          trip: { $in: tripIds },
          paymentStatus: "paid"
        }).select("totalAmount");

        const totalRevenue = bookings.reduce(
          (sum, b) => sum + (b.totalAmount || 0),
          0
        );

        return {
          operatorId: op._id,
          operatorName: op.fullName,
          email: op.email,
          phone: op.phone,
          totalTrips: trips.length,
          totalBookings: bookings.length,
          totalRevenue,
        };
      })
    );

    res.json(operatorData);
  } catch (error) {
    console.error("Admin Revenue Controller Error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getOperatorRevenue = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not found" });

    const operatorId = req.user._id;

    // Only fetch buses owned by this operator
    const buses = await Bus.find({ operator: operatorId }).select("_id busNumber busName");
    if (!buses.length) {
      return res.json({ totalOperatorRevenue: 0, totalOperatorBookings: 0, buses: [] });
    }

    const busIds = buses.map(b => b._id);

    // Only fetch trips of these buses
    const trips = await Trip.find({ bus: { $in: busIds } });
    const tripIds = trips.map(t => t._id);

    // Only fetch bookings for these trips
    const bookings = await Booking.find({ trip: { $in: tripIds }, paymentStatus: "paid" });

    const totalOperatorRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalOperatorBookings = bookings.length;

    const busesData = buses.map(bus => {
      const busTrips = trips.filter(t => t.bus.toString() === bus._id.toString());
      const busBookings = bookings.filter(b =>
        busTrips.some(t => t._id.toString() === b.trip.toString())
      );

      return {
        busId: bus._id,
        busNumber: bus.busNumber,
        busName: bus.busName,
        totalBusRevenue: busBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        totalBusBookings: busBookings.length,
        trips: busTrips.map(trip => {
          const tripBookings = bookings.filter(b => b.trip.toString() === trip._id.toString());
          return {
            tripId: trip._id,
            date: trip.date,
            revenue: tripBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
            bookings: tripBookings.length,
          };
        })
      };
    });

    return res.json({ totalOperatorRevenue, totalOperatorBookings, buses: busesData });
  } catch (error) {
    console.error("Revenue Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
