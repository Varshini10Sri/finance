const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const TransactionsController = require('../controllers/TransactionsController');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

// Public Routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Dashboard Summary (Analysts and Admins)
router.get('/summary', authMiddleware(['Analyst', 'Admin']), TransactionsController.getSummary);
router.get('/trends', authMiddleware(['Analyst', 'Admin']), TransactionsController.getMonthlyTrends);

// Transactions CRUD (Viewer can only VIEW - getAll)
router.get('/transactions', authMiddleware(['Viewer', 'Analyst', 'Admin']), TransactionsController.getAll);

// Create/Update/Delete (Reserved for Admin or User who owns record - Analyst can also create/edit their own)
router.post('/transactions', authMiddleware(['Analyst', 'Admin']), TransactionsController.create);
router.put('/transactions/:id', authMiddleware(['Analyst', 'Admin']), TransactionsController.update);
router.delete('/transactions/:id', authMiddleware(['Admin']), TransactionsController.delete); // Delete reserved for Admin

// 3. User Management (Admin Only)
router.get('/users', authMiddleware(['Admin']), UserController.getAll);
router.post('/users', authMiddleware(['Admin']), UserController.create);
router.put('/users/:id', authMiddleware(['Admin']), UserController.update);
router.delete('/users/:id', authMiddleware(['Admin']), UserController.delete);

module.exports = router;
