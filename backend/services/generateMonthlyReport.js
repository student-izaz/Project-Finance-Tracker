const mongoose = require("mongoose");
const pool = require("./mysql"); // import mysql pool
const Expense = require("./models/Expense"); // Your MongoDB model
const Budget = require("./models/Budget");   // Your MongoDB model

async function generateMonthlyReport(userId, month) {
  const start = new Date(`${month}-01`);
  const end = new Date(`${month}-31`);

  // Fetch expenses for user and month
  const expenses = await Expense.find({
    userId,
    date: { $gte: start, $lte: end }
  });

  // Fetch user budgets
  const budgets = await Budget.find({ userId });

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // Calculate total per category
  const categoryTotals = {};
  expenses.forEach(e => {
    const cat = e.category.toLowerCase();
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
  });

  // Find top category
  let topCategory = "";
  let maxAmount = 0;
  for (const [cat, amount] of Object.entries(categoryTotals)) {
    if (amount > maxAmount) {
      topCategory = cat;
      maxAmount = amount;
    }
  }

  // Find overbudget categories
  const overbudget = [];
  budgets.forEach(budget => {
    const cat = budget.category.toLowerCase();
    const spent = categoryTotals[cat] || 0;
    if (spent >= 0.8 * budget.limit) {
      overbudget.push(cat);
    }
  });

  // Insert into MySQL
  await pool.query(`
    INSERT INTO monthly_reports (user_id, month, total_spent, top_category, overbudget_categories)
    VALUES (?, ?, ?, ?, ?)
  `, [userId, month, totalSpent, topCategory, JSON.stringify(overbudget)]);

  console.log("✅ Monthly report inserted for", userId);
}
