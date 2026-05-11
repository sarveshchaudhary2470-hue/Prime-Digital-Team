require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function setup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const username = process.env.ADMIN_USERNAME || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const email = process.env.ADMIN_USERNAME || 'admin@example.com';

    const hashedPassword = await bcrypt.hash(password, 10);

    // Remove all previous users to ensure only the new admin exists
    await User.deleteMany({}); 
    
    const admin = new User({
      username,
      password: hashedPassword,
      email
    });

    await admin.save();
    console.log(`\nSUCCESS: Admin user updated!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Recovery Email: ${email}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err);
    process.exit(1);
  }
}

setup();
