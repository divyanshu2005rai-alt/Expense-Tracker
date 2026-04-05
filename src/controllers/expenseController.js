const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

const addExpense = async (req, res) => {
  try {
    const { tripId, amount, description, category, splitType, splitBetween, splits } = req.body;

    let finalSplitBetween = splitBetween || [];
    if (!splitType || splitType === "EQUAL") {
      if (!finalSplitBetween.includes(req.user._id.toString())) {
        finalSplitBetween.push(req.user._id.toString());
      }
    }

    const expense = await Expense.create({
      trip: tripId,
      paidBy: req.user._id,
      amount,
      description,
      category: category || "Other",
      splitType: splitType || "EQUAL",
      splitBetween: finalSplitBetween,
      splits
    });

    await Trip.findByIdAndUpdate(tripId, {
      $push: { expenses: expense._id }
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSettlement = async (req, res) => {
  try {
    const { tripId } = req.params;
    const expenses = await Expense.find({ trip: tripId });
    const balances = {};

    expenses.forEach(expense => {
      if (!balances[expense.paidBy]) balances[expense.paidBy] = 0;
      balances[expense.paidBy] += expense.amount;

      if (expense.splitBetween && expense.splitBetween.length > 0) {
        const splitCount = expense.splitBetween.length;
        const share = expense.amount / splitCount;
        expense.splitBetween.forEach(userId => {
          if (!balances[userId]) balances[userId] = 0;
          balances[userId] -= share;
        });
      }

      if (expense.splits && expense.splits.length > 0) {
        expense.splits.forEach(split => {
          if (!balances[split.user]) balances[split.user] = 0;
          balances[split.user] -= split.amount;
        });
      }
    });

    const creditors = [];
    const debtors = [];

    for (let user in balances) {
      if (balances[user] > 0) creditors.push({ user, amount: balances[user] });
      else if (balances[user] < 0) debtors.push({ user, amount: -balances[user] });
    }

    const transactions = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settleAmount = Math.min(debtor.amount, creditor.amount);

      transactions.push({ from: debtor.user, to: creditor.user, amount: settleAmount });

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }

    res.json({ balances, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTripSummary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user._id.toString();
    const expenses = await Expense.find({ trip: tripId });
    const trip = await Trip.findById(tripId).populate("members", "name email");

    const userMap = {};
    trip.members.forEach(user => {
      userMap[user._id.toString()] = { _id: user._id, name: user.name, email: user.email };
    });

    const balances = {};
    expenses.forEach(expense => {
      const payer = expense.paidBy.toString();
      if (!balances[payer]) balances[payer] = 0;
      balances[payer] += expense.amount;

      if (expense.splitBetween && expense.splitBetween.length > 0) {
        const share = expense.amount / expense.splitBetween.length;
        expense.splitBetween.forEach(user => {
          const uid = user.toString();
          if (!balances[uid]) balances[uid] = 0;
          balances[uid] -= share;
        });
      }

      if (expense.splits && expense.splits.length > 0) {
        expense.splits.forEach(split => {
          const uid = split.user.toString();
          if (!balances[uid]) balances[uid] = 0;
          balances[uid] -= split.amount;
        });
      }
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = balances[userId] || 0;
    const youOwe = netBalance < 0 ? Math.abs(netBalance) : 0;
    const youAreOwed = netBalance > 0 ? netBalance : 0;

    const creditors = [];
    const debtors = [];
    for (let user in balances) {
      if (balances[user] > 0) creditors.push({ user, amount: balances[user] });
      else if (balances[user] < 0) debtors.push({ user, amount: -balances[user] });
    }

    const transactions = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settleAmount = Math.min(debtor.amount, creditor.amount);

      if (debtor.user === userId) {
        transactions.push({ to: { id: creditor.user, name: userMap[creditor.user]?.name || "Unknown" }, amount: settleAmount });
      } else if (creditor.user === userId) {
        transactions.push({ from: { id: debtor.user, name: userMap[debtor.user]?.name || "Unknown" }, amount: settleAmount });
      }

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;
      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }

    res.json({
      status: trip.status,
      members: Object.values(userMap),
      totalExpenses,
      youOwe,
      youAreOwed,
      netBalance,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addExpense, getSettlement, getTripSummary };
