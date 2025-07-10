const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Get all products
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products');
  res.json(rows);
});

// Add product
router.post('/', async (req, res) => {
  const { id, name, unitPrice, price, category, description, image } = req.body;
  await db.query(
    'INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
    [id, name, unitPrice, price, category, description, image]
  );
  res.status(201).json({ message: 'Product added' });
});

module.exports = router;
