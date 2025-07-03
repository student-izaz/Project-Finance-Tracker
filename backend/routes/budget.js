const express = require('express');
const {
  setBudget,
  getBudgets,
  deleteBudget,
} = require('../controllers/budgetController');

const router = express.Router();

router.post('/', setBudget);
router.get('/', getBudgets);
router.delete('/:id', deleteBudget);

module.exports = router;
