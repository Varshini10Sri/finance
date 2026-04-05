const db = require('../config/db');

const UserController = {
  // Get all users with their roles (Admin only)
  getAll: async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT u.id, u.username, u.email, u.status, u.created_at, r.role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id
        ORDER BY u.created_at DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  },

  // Create new user (Admin only)
  create: async (req, res) => {
    try {
      const { username, email, password, role_id } = req.body;
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password || 'fintech_default_2026', 10);
      
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, role_id || 3, 'Active']
      );

      res.status(201).json({ message: 'User provisioned successfully', userId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Provisioning failed', error: error.message });
    }
  },

  // Update user role or status (Admin only)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { role_id, status } = req.body;

      // Allow updating role_id, status, or both
      let query = 'UPDATE users SET ';
      const params = [];
      const updates = [];

      if (role_id) {
        updates.push('role_id = ?');
        params.push(role_id);
      }
      if (status) {
        updates.push('status = ?');
        params.push(status);
      }

      if (updates.length === 0) {
        return res.status(400).json({ message: 'No updates provided' });
      }

      query += updates.join(', ') + ' WHERE id = ?';
      params.push(id);

      const [result] = await db.execute(query, params);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  },

  // Delete user (Admin only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Prevent admin from deleting themselves (safety check)
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'You cannot delete your own admin account' });
      }

      const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
};

module.exports = UserController;
