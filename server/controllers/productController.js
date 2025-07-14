const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// ✅ GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST new product with image
exports.addProduct = async (req, res) => {
  try {
    const { name, category, unitPrice, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const sql = 'INSERT INTO products (name, category, unitPrice, price, description, image) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [name, category, unitPrice, price, description, image]);

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update product and its image (clean async version)
exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, category, unitPrice, price, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  let sql = `
    UPDATE products SET name = ?, category = ?, unitPrice = ?, price = ?, description = ?
  `;
  const values = [name, category, unitPrice, price, description];

  if (image) {
    sql += `, image = ?`;
    values.push(image);
  }

  sql += ` WHERE id = ?`;
  values.push(productId);

  try {
    const [result] = await db.query(sql, values);
    console.log("✅ Product updated:", result);
    res.status(200).json({ success: true, message: 'Product updated' });
  } catch (err) {
    console.error("❌ DB error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE product and its image
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const [rows] = await db.query('SELECT image FROM products WHERE id = ?', [productId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const imagePath = rows[0].image ? path.join(__dirname, '..', rows[0].image) : null;

    await db.query('DELETE FROM products WHERE id = ?', [productId]);

    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('⚠️ Failed to delete image file:', imagePath);
      });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
