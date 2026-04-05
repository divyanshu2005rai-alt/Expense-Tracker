const express = require("express");
const router = express.Router();

const { addExpense, getSettlement, getTripSummary } = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");

router.get("/summary/:tripId", protect, getTripSummary);
router.post("/", protect, addExpense);
router.get("/settlement/:tripId", protect, getSettlement);

module.exports = router;