const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  category: String,
  limit: Number,
});

module.exports = mongoose.model('Budget', BudgetSchema);
