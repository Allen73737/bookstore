const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Admin = require('./models/Admin'); // Adjust path if needed

const mongoURI = process.env.MONGO_URI;

async function createAdmin(email, plainPassword) {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin with this email already exists.');
      process.exit(0);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

    const admin = new Admin({
      email,
      passwordHash,
    });

    await admin.save();
    console.log(`Admin created successfully with email: ${email}`);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    mongoose.disconnect();
  }
}

// Replace with your desired admin email and password here:
const adminEmail = 'admin@gmail.com';
const adminPassword = 'admin123';

createAdmin(adminEmail, adminPassword);
