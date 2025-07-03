const Budget = require('../models/Budget');
const jwt = require('jsonwebtoken');

// Add/Update Budget for Category
exports.setBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, limit } = req.body;

    let budget = await Budget.findOne({ userId, category });

    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = new Budget({ userId, category, limit });
      await budget.save();
    }

    res.status(201).json({ message: 'Budget set', budget });
  } catch (err) {
    res.status(500).json({ error: 'Failed to set budget' });
  }
};

// Get All Budgets
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user._id;
    const budgets = await Budget.find({ userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

// Delete Budget
exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, userId });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });

    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
