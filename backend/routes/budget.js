const express = require('express');
const {
  setBudget,
  getBudgets,
  deleteBudget,
} = require('../controllers/budgetController');

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

router.post('/',authMiddleware, setBudget);
router.get('/',authMiddleware, getBudgets);
router.delete('/:id',authMiddleware, deleteBudget);

module.exports = router;
