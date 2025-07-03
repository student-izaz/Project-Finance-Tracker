const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  category: String,
  date: Date,
  paymentMethod: String,
  notes: String,
});

module.exports = mongoose.model('Expense', ExpenseSchema);
