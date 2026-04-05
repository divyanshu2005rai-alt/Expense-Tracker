const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      default: "Other"
    },
    splitType: {
      type: String,
      enum: ["EQUAL", "EXACT", "PERCENTAGE"],
      default: "EQUAL"
    },
    splitBetween: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    splits: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        amount: {
          type: Number,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);