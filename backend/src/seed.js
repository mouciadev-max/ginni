require('dotenv').config();
const connectDB = require('./config/db');
const { User } = require('./models/user.model');
const mongoose = require('mongoose');

async function main() {
  await connectDB();
  
  let admin = await User.findOne({ email: 'admin@ginni.com' });
  
  if (!admin) {
    admin = await User.create({
      name: 'Super Admin',
      email: 'admin@ginni.com',
      password: 'admin123',
      phone: '0000000000',
      role: 'ADMIN',
    });
  }

  console.log('✅ Admin user created/verified:');
  console.log('Email:', admin.email);
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Failed to seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
