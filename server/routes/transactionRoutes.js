const express = require('express');
const router = express.Router();
const {
  saveTransaction,
  getAllTransactions,
  getTransactionsWithItems 
} = require('../controllers/transactionController');

router.post('/', saveTransaction);
router.get('/', getAllTransactions); // optional
router.get('/details', getTransactionsWithItems );

module.exports = router;
