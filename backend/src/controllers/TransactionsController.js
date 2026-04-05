const db = require('../config/db');

const TransactionsController = {
  // 1. Transaction CRUD
  create: async (req, res) => {
    try {
      const { amount, type, category, transaction_date, notes } = req.body;
      const user_id = req.user.id;

      const [result] = await db.execute(
        'INSERT INTO transactions (user_id, amount, type, category, transaction_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, amount, type, category, transaction_date, notes]
      );

      res.status(201).json({ message: 'Transaction created', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const { category, type, startDate, endDate } = req.query;
      const isAdminOrAnalyst = ['Admin', 'Analyst'].includes(req.user.role);
      
      let query = 'SELECT t.*, u.username FROM transactions t JOIN users u ON t.user_id = u.id';
      const params = [];

      if (!isAdminOrAnalyst) {
        query += ' WHERE t.user_id = ?';
        params.push(req.user.id);
      } else {
        query += ' WHERE 1=1';
      }

      if (category) {
        query += ' AND t.category = ?';
        params.push(category);
      }
      if (type) {
        query += ' AND t.type = ?';
        params.push(type);
      }
      if (startDate && endDate) {
        query += ' AND t.transaction_date BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }

      query += ' ORDER BY t.transaction_date DESC';

      const [rows] = await db.execute(query, params);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, type, category, transaction_date, notes } = req.body;
      
      // Admin can update any record, others only their own
      let query = 'UPDATE transactions SET amount=?, type=?, category=?, transaction_date=?, notes=? WHERE id=?';
      const params = [amount, type, category, transaction_date, notes, id];

      if (req.user.role !== 'Admin') {
        query += ' AND user_id=?';
        params.push(req.user.id);
      }

      const [result] = await db.execute(query, params);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Transaction not found or unauthorized' });
      }

      res.json({ message: 'Transaction updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Admin delete anything, Analyst delete own? (Requirement says Admin manage, Analyst view insights)
      let query = 'DELETE FROM transactions WHERE id=?';
      const params = [id];

      if (req.user.role !== 'Admin') {
        query += ' AND user_id=?';
        params.push(req.user.id);
      }

      const [result] = await db.execute(query, params);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Transaction not found or unauthorized' });
      }

      res.json({ message: 'Transaction deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 2. Summary & Analytics
  getSummary: async (req, res) => {
    try {
      const isAdminOrAnalyst = ['Admin', 'Analyst'].includes(req.user.role);
      const user_id = req.user.id;
      
      const filterSql = isAdminOrAnalyst ? '' : 'WHERE user_id = ' + user_id;

      const [summary] = await db.execute(`
        SELECT 
          SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as totalIncome,
          SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as totalExpense
        FROM transactions 
        ${filterSql}
      `);

      const [categoryTotals] = await db.execute(`
        SELECT category, SUM(amount) as total, type
        FROM transactions 
        ${filterSql}
        GROUP BY category, type
      `);

      const [recentActivity] = await db.execute(`
        SELECT t.*, u.username FROM transactions t 
        JOIN users u ON t.user_id = u.id
        ${isAdminOrAnalyst ? '' : 'WHERE t.user_id = ' + user_id}
        ORDER BY t.created_at DESC 
        LIMIT 5
      `);

      const totalIncome = parseFloat(summary[0].totalIncome || 0);
      const totalExpense = parseFloat(summary[0].totalExpense || 0);
      const netBalance = totalIncome - totalExpense;

      res.json({
        totalIncome,
        totalExpense,
        netBalance,
        categoryTotals,
        recentActivity
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMonthlyTrends: async (req, res) => {
    try {
      const isAdminOrAnalyst = ['Admin', 'Analyst'].includes(req.user.role);
      
      const [trends] = await db.execute(`
        SELECT 
          DATE_FORMAT(transaction_date, '%Y-%m') as month,
          SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as expenses
        FROM transactions
        ${isAdminOrAnalyst ? '' : 'WHERE user_id = ' + req.user.id}
        GROUP BY month
        ORDER BY month ASC
      `);

      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = TransactionsController;
