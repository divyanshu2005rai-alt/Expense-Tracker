const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

const createTrip = async (req, res) => {
  try {
    const { name, members } = req.body;
    const trip = await Trip.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id],
      pendingMembers: members
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrips = async (req, res) => {
  try {
    const userId = req.user._id;
    const allTrips = await Trip.find({}).populate("createdBy", "name");
    const activeTrips = [];
    const pendingTrips = [];

    allTrips.forEach(t => {
      const isMember = t.members && t.members.some(id => id && id.toString() === userId.toString());
      const isPending = t.pendingMembers && t.pendingMembers.some(id => id && id.toString() === userId.toString());

      if (isPending) pendingTrips.push(t);
      else if (isMember) activeTrips.push(t);
    });

    res.json({ activeTrips, pendingTrips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTripActivity = async (req, res) => {
  try {
    const { tripId } = req.params;
    const expenses = await Expense.find({ trip: tripId }).populate("paidBy", "name").sort({ createdAt: -1 });
    const userId = req.user._id.toString();

    const activity = expenses.map(exp => {
      let message = "";
      const paidBy = exp.paidBy._id.toString();

      if (paidBy === userId) {
        message = `You paid ₹${exp.amount} for ${exp.description || "an expense"}`;
      } else if (exp.splitBetween && exp.splitBetween.map(u => u.toString()).includes(userId)) {
        const share = exp.amount / exp.splitBetween.length;
        message = `You owe ₹${share.toFixed(2)} for ${exp.description || "an expense"} to ${exp.paidBy.name}`;
      } else if (exp.splits && exp.splits.length > 0) {
        const yourSplit = exp.splits.find(s => s.user.toString() === userId);
        if (yourSplit) {
          message = `You owe ₹${yourSplit.amount.toFixed(2)} for ${exp.description || "an expense"} to ${exp.paidBy.name}`;
        } else {
          message = `${exp.paidBy.name} added ₹${exp.amount} for ${exp.description || "an expense"}`;
        }
      } else {
        message = `${exp.paidBy.name} added ₹${exp.amount} for ${exp.description || "an expense"}`;
      }

      return { type: "expense", message, createdAt: exp.createdAt };
    });

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const endTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status === 'completed') return res.status(400).json({ message: "Trip is already completed" });

    trip.status = 'completed';
    await trip.save();
    res.json({ message: "Trip completed", trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user._id;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const isPending = trip.pendingMembers.some(id => id && id.toString() === userId.toString());
    if (!isPending) return res.status(400).json({ message: "No invitation found for this trip" });

    await Trip.findByIdAndUpdate(tripId, { $pull: { pendingMembers: userId }, $push: { members: userId } });
    res.json({ message: "Trip invitation accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user._id;
    await Trip.findByIdAndUpdate(tripId, { $pull: { pendingMembers: userId } });
    res.json({ message: "Trip invitation rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    await Trip.findByIdAndDelete(tripId);
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTrip, getTrips, getTripActivity, endTrip, acceptTrip, rejectTrip, deleteTrip };
