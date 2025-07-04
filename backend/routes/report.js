const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const pool = require('../config/mysql');
const authMiddleware = require("../middleware/authMiddleware")

// Mongoose Models
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // assuming you're using JWT middleware
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-07"

    // Fetch user expenses and budgets from MongoDB
    const expenses = await Expense.find({
      user: userId,
      date: { $regex: `^${currentMonth}` }
    });

    const budgets = await Budget.find({ user: userId });

    // Total spent this month
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // Category totals
    const categoryTotals = {};
    expenses.forEach(e => {
      const cat = e.category.toLowerCase();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
    });

    // Top category
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0]?.[0] || "N/A";

    // Overbudget categories
    const overbudgetCategories = [];
    budgets.forEach(b => {
      const cat = b.category.toLowerCase();
      const spent = categoryTotals[cat] || 0;
      if (spent >= 0.8 * b.limit) {
        overbudgetCategories.push(cat);
      }
    });

    // Insert report into MySQL
    const [result] = await pool.execute(
      `INSERT INTO monthly_reports (user_id, month, total_spent, top_category, overbudget_categories)
       VALUES (?, ?, ?, ?, ?)`,
      [userId.toString(), currentMonth, totalSpent, topCategory,  overbudgetCategories.join(', ')]
    );

    res.json({ message: 'Monthly report generated!', reportId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
