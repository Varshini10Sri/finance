const app = require('./app');
const db = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check Database connection
    await db.getConnection();
    console.log('Connected to MySQL Database.');
    
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database: ', err.message);
    process.exit(1);
  }
};

startServer();
