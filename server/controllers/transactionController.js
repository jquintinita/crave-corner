const db = require('../config/db');

// Save a new transaction with items
exports.saveTransaction = async (req, res) => {
  const { user_id, total, cash, change, payment_method, items } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into `transactions` table
   const [result] = await db.query(
    'INSERT INTO transactions (user_id, total, cash, change_amount, payment_method) VALUES (?, ?, ?, ?, ?)',
    [user_id, total, cash, change, payment_method]
  );

    const transactionId = result.insertId;

    // 2. Insert all transaction items
    for (const item of items) {
      await connection.query(
        `INSERT INTO transaction_items (transaction_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)`,
        [transactionId, item.id, item.name, item.price, item.quantity]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Transaction saved', transaction_id: transactionId });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error saving transaction:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  } finally {
    connection.release();
  }
};

// Get all transactions (basic)
exports.getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM transactions ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    console.error('❌ Failed to fetch transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all transactions with item details
exports.getTransactionsWithItems = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id AS transaction_id,
        t.user_id,
        t.total,
        t.cash,
        t.payment_method,
        t.created_at,
        ti.product_id,
        ti.name,
        ti.price,
        ti.quantity
      FROM transactions t
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      ORDER BY t.created_at DESC
    `);

    const grouped = [];
    const map = new Map();

    for (const row of rows) {
      const id = row.transaction_id;

      if (!map.has(id)) {
        const transaction = {
          id,
          user_id: row.user_id,
          total: row.total,
          cash: row.cash,
          change: row.change,
          payment_method: row.payment_method,
          created_at: row.created_at,
          items: [],
        };
        map.set(id, transaction);
        grouped.push(transaction);
      }

      if (row.product_id) {
        map.get(id).items.push({
          id: row.product_id,
          name: row.name,
          price: row.price,
          quantity: row.quantity,
        });
      }
    }

    res.json(grouped);
  } catch (error) {
    console.error('❌ Failed to fetch transactions with items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
