const db = require('../config/db');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

// ✅ GET all users (excluding password)
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, username, email, role FROM users'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE user (with hashed password)
exports.createUser = async (req, res) => {
  const { name, username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (name, username, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      name,
      username,
      email,
      hashedPassword,
      role,
    ]);
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE user (optional password update)
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, username, email, password, role } = req.body;

  try {
    const values = [name, username, email, role];
    let sql = `
      UPDATE users SET name = ?, username = ?, email = ?, role = ?
    `;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += `, password = ?`;
      values.push(hashedPassword);
    }

    sql += ` WHERE id = ?`;
    values.push(userId);

    await db.query(sql, values);
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE user
exports.deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Authenticate user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}