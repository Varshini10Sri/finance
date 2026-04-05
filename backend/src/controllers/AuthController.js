const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const AuthController = {
  login: async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const [users] = await db.execute(
        'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
        [validatedData.email]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = users[0];

      if (user.status !== 'Active') {
        return res.status(403).json({ message: 'User account is inactive' });
      }

      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role_name },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role_name,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  register: async (req, res) => {
    try {
      const { username, email, password, role_id } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Default role Viewer (id=3) if not provided
      const finalRoleId = role_id || 3;

      const [result] = await db.execute(
        'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, finalRoleId]
      );

      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email or Username already exists' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = AuthController;
