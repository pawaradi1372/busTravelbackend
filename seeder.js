// seedFullData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Import all models
import User from "./models/User.js";
import Bus from "./models/Bus.js";
import Route from "./models/Route.js";
import Trip from "./models/Trip.js";

dotenv.config();

// Operator Users (Travel Owners)
const operatorsData = [
  {
    fullName: "Khuran Travel",
    email: "khuran@travel.com",
    phone: "9876543210",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Sharma Travels",
    email: "sharma@travel.com",
    phone: "9876543211",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Patel Tours",
    email: "patel@travel.com",
    phone: "9876543212",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Raj Express",
    email: "raj@travel.com",
    phone: "9876543213",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Saini Travels",
    email: "saini@travel.com",
    phone: "9876543214",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Agarwal Bus Lines",
    email: "agarwal@travel.com",
    phone: "9876543215",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Vikram Tours",
    email: "vikram@travel.com",
    phone: "9876543216",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Kumar Travel Co",
    email: "kumar@travel.com",
    phone: "9876543217",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Elite Travels",
    email: "elite@travel.com",
    phone: "9876543218",
    password: "pass1234",
    role: "operator",
  },
  {
    fullName: "Sunrise Bus Services",
    email: "sunrise@travel.com",
    phone: "9876543219",
    password: "pass1234",
    role: "operator",
  },
];

// Bus seat layout generator
const generateSeats = (totalSeats = 30) => {
  return Array.from({ length: totalSeats }, (_, i) => ({
    seatNumber: `S${i + 1}`,
    isAvailable: true,
  }));
};

// Sample Routes
const routesData = [
  {
    startPoint: "Nagpur",
    endPoint: "Ch.Shambhaji Nagar",
    stops: ["Amravati"],
    distance: 550,
    duration: "6 hr",
  },
  {
    startPoint: "Pune",
    endPoint: "Mumbai",
    stops: ["Lonavala"],
    distance: 150,
    duration: "3 hr",
  },
  {
    startPoint: "Bangalore",
    endPoint: "Mysore",
    stops: [],
    distance: 140,
    duration: "3 hr",
  },
  {
    startPoint: "Delhi",
    endPoint: "Agra",
    stops: ["Mathura"],
    distance: 230,
    duration: "4 hr",
  },
  {
    startPoint: "Hyderabad",
    endPoint: "Vijayawada",
    stops: [],
    distance: 275,
    duration: "5 hr",
  },
  {
    startPoint: "Chennai",
    endPoint: "Bangalore",
    stops: ["Vellore", "Krishnagiri"],
    distance: 350,
    duration: "6 hr",
  },
  {
    startPoint: "Jaipur",
    endPoint: "Udaipur",
    stops: ["Ajmer", "Kishangarh"],
    distance: 400,
    duration: "7 hr",
  },
  {
    startPoint: "Kolkata",
    endPoint: "Durgapur",
    stops: ["Asansol"],
    distance: 180,
    duration: "4 hr",
  },
  {
    startPoint: "Ahmedabad",
    endPoint: "Surat",
    stops: ["Vadodara"],
    distance: 260,
    duration: "5 hr",
  },
  {
    startPoint: "Lucknow",
    endPoint: "Varanasi",
    stops: ["Prayagraj"],
    distance: 320,
    duration: "6 hr",
  },
  {
    startPoint: "Goa",
    endPoint: "Pune",
    stops: ["Ratnagiri"],
    distance: 450,
    duration: "8 hr",
  },
  {
    startPoint: "Indore",
    endPoint: "Bhopal",
    stops: [],
    distance: 200,
    duration: "4 hr",
  },
];

// Seed function
const seedFullData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");

    // Clear previous data
    await User.deleteMany({ role: "operator" });
    await Bus.deleteMany({});
    await Route.deleteMany({});
    await Trip.deleteMany({});

    // Hash operator passwords
    const operatorsWithHashedPasswords = await Promise.all(
      operatorsData.map(async (operator) => ({
        ...operator,
        password: await bcrypt.hash(operator.password, 10),
      }))
    );

    // Insert operators
    const createdOperators = await User.insertMany(
      operatorsWithHashedPasswords
    );
    console.log(`Inserted ${createdOperators.length} operator users.`);

    // Insert routes
    const createdRoutes = await Route.insertMany(routesData);
    console.log(`Inserted ${createdRoutes.length} routes.`);

    // Insert buses for each operator
    const buses = createdOperators.map((operator, index) => ({
      busNumber: `MH20OP${100 + index}`,
      operator: operator._id,
      totalSeats: 30,
      availableSeats: 30,
      seatLayout: generateSeats(30),
      amenities: ["wifi", "ac"],
      status: "active",
    }));
    const createdBuses = await Bus.insertMany(buses);
    console.log(`Inserted ${createdBuses.length} buses.`);

    // Insert trips for each bus and route
    // Number of trips you want per bus
    const tripsPerBus = 3;

    let trips = [];

    createdBuses.forEach((bus, i) => {
      for (let j = 0; j < tripsPerBus; j++) {
        const route = createdRoutes[(i + j) % createdRoutes.length]; // Assign routes cyclically
        const departure = new Date(Date.now() + (j + 1) * 3600 * 1000); // departure 1h, 2h, 3h from now
        const arrival = new Date(departure.getTime() + 5 * 3600 * 1000); // 5h trip duration

        trips.push({
          bus: bus._id,
          route: route._id,
          operator: bus.operator,
          departureTime: departure,
          arrivalTime: arrival,
          pricePerSeat: 700 + i * 50 + j * 20, // price variation
          status: "scheduled",
        });
      }
    });

    // Then insert into DB
    const createdTrips = await Trip.insertMany(trips);
    console.log(`${createdTrips.length} trips created`);

    mongoose.disconnect();
    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

seedFullData();
