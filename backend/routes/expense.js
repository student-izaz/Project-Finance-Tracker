const express = require('express');
const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} = require('../controllers/expenseController');

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

router.post('/', authMiddleware, addExpense);  
router.get('/', authMiddleware, getExpenses);       
router.delete('/:id', authMiddleware, deleteExpense);
router.put('/:id', authMiddleware, updateExpense);

module.exports = router;
