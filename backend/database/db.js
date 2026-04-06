// Database connection logic goes here.
// e.g., connecting to PostgreSQL or MongoDB

const connectDB = async () => {
  try {
    console.log('Database connected successfully.');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
