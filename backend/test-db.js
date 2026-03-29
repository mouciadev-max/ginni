require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('📡 Testing MongoDB connection...');
  console.log('URI:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
