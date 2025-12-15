const Bus = require('../models/Bus');

// Create Bus
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Buses
exports.getBuses = async (req, res) => {
  try {
    const filter = {};
    if (req.query.operator) filter.operator = req.query.operator; // <-- filter by operator
    const buses = await Bus.find(filter);
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Bus
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Bus
exports.deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
