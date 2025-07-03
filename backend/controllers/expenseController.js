const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

// Middleware to get user ID from token
const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, 'secret');
  return decoded.id;
};

exports.addExpense = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { amount, category, date, paymentMethod, notes } = req.body;

    const expense = new Expense({ userId, amount, category, date, paymentMethod, notes });
    await expense.save();

    res.status(201).json({ message: 'Expense added', expense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = getUserId(req);
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({ _id: id, userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const update = req.body;

    const expense = await Expense.findOneAndUpdate({ _id: id, userId }, update, { new: true });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    res.json({ message: 'Expense updated', expense });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};
