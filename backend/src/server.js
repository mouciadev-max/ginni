require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5001;
console.log(`Starting backend. Environment Port detected as: ${PORT}`);

async function startServer() {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database', error);
    process.exit(1);
  }
}

startServer();
