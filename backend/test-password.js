require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function testPassword() {
  const dbPassword = '$2b$10$UxQJbHDF7Nhj3Je1VOzrduCYjOtq4D60L433ZZuvDjk5N5rMVrV4a';
  const candidate = 'admin123';
  
  const isMatch = await bcrypt.compare(candidate, dbPassword);
  console.log('📡 Candidate:', candidate);
  console.log('📡 Matches DB hash:', isMatch ? '✅ YES' : '❌ NO');
  process.exit(0);
}

testPassword();
