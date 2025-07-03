const express = require('express');
const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} = require('../controllers/expenseController');

const router = express.Router();

router.post('/', addExpense);  
router.get('/', getExpenses);       
router.delete('/:id', deleteExpense);
router.put('/:id', updateExpense);

module.exports = router;
