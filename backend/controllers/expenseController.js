const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

exports.addExpense = async (req, res) => {
  try {
    const userId = req.user._id
    const { amount, category, date, paymentMethod, notes } = req.body;

    const expense = new Expense({ userId, amount, category: category.toLowerCase().trim(), date, paymentMethod, notes });
    await expense.save();

    res.status(201).json({ message: 'Expense added', expense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({ _id: id, userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

// controllers/expenseController.js
exports.updateExpense = async (req, res) => {
  const { amount, category, date, paymentMethod, notes } = req.body;
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) return res.status(404).json({ message: "Expense not found" });

  expense.amount = amount;
  expense.category = category;
  expense.date = date;
  expense.paymentMethod = paymentMethod;
  expense.notes = notes;

  await expense.save();
  res.json(expense);
};
