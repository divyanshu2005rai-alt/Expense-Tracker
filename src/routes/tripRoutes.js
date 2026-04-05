const express = require("express");
const router = express.Router();

const { createTrip, getTrips, getTripActivity, endTrip, acceptTrip, rejectTrip, deleteTrip } = require("../controllers/tripController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, getTrips);
router.get("/:tripId/activity", protect, getTripActivity);
router.post("/", protect, createTrip);
router.put("/:tripId/end", protect, endTrip);
router.post("/:tripId/accept", protect, acceptTrip);
router.post("/:tripId/reject", protect, rejectTrip);
router.delete("/:tripId", protect, deleteTrip);

router.get("/debug/dump", async (req, res) => {
  const Trip = require("../models/Trip");
  const User = require("../models/Users");
  const trips = await Trip.find({});
  const users = await User.find({});
  res.json({ trips, users });
});

module.exports = router;