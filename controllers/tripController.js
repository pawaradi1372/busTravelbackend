const Trip = require('../models/Trip');

// Create Trip
exports.createTrip = async (req, res) => {
  try {
    // Assume req.user is set by auth middleware
    const operatorId = req.user?._id; 
    if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

    const trip = await Trip.create({
      ...req.body,
      operator: operatorId, // assign logged-in operator
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTrips = async (req, res) => {
  try {
    const { startPoint, endPoint, journeyDate } = req.query;

    // Step 1: Filter by trip fields (departureTime)
    const tripFilter = {};
    if (journeyDate) {
      const date = new Date(journeyDate);
      date.setHours(0,0,0,0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      tripFilter.departureTime = { $gte: date, $lt: nextDay };
    }

    // Step 2: Fetch trips and populate route & bus
    let trips = await Trip.find(tripFilter)
      .populate({
        path: "bus",
        populate: { path: "operator", select: "fullName" }
      })
      .populate("route");

    // Step 3: Filter by route fields in JS
    if (startPoint) {
      trips = trips.filter(t => 
        t.route.startPoint.toLowerCase().includes(startPoint.toLowerCase())
      );
    }
    if (endPoint) {
      trips = trips.filter(t => 
        t.route.endPoint.toLowerCase().includes(endPoint.toLowerCase())
      );
    }

    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};




// Get Trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('bus route');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Trip
exports.deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suggestion API
exports.getTripSuggestions = async (req, res) => {
  try {
    const { field, query } = req.query;
    if (!field || !query) return res.json([]);

    // Only allow startPoint or endPoint
    if (!['startPoint', 'endPoint'].includes(field)) return res.json([]);

    // Use aggregation to get unique route values matching query
    const suggestions = await Trip.aggregate([
      { $lookup: {
          from: "routes",
          localField: "route",
          foreignField: "_id",
          as: "route"
        }
      },
      { $unwind: "$route" },
      { $match: { [`route.${field}`]: { $regex: query, $options: "i" } } },
      { $group: { _id: `$route.${field}` } },
      { $limit: 10 }
    ]);

    res.json(suggestions.map(s => s._id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
