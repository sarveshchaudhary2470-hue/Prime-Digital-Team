require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Content, Client, Diary, Message } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // 1. Migrate Content
    const dataPath = path.join(__dirname, 'data.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      await Content.deleteMany({});
      await Content.insertMany(data);
      console.log('Content migrated');
    }

    // 2. Migrate Clients
    const clientsPath = path.join(__dirname, 'clients.json');
    if (fs.existsSync(clientsPath)) {
      const clients = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));
      await Client.deleteMany({});
      await Client.insertMany(clients);
      console.log('Clients migrated');
    }

    // 3. Migrate Diary
    const diaryPath = path.join(__dirname, 'diary.json');
    if (fs.existsSync(diaryPath)) {
      const diary = JSON.parse(fs.readFileSync(diaryPath, 'utf8'));
      await Diary.deleteMany({});
      const diaryEntries = Object.entries(diary).map(([date, data]) => ({ date, data }));
      await Diary.insertMany(diaryEntries);
      console.log('Diary migrated');
    }

    // 4. Migrate Messages
    const messagesPath = path.join(__dirname, 'messages.json');
    if (fs.existsSync(messagesPath)) {
      const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
      await Message.deleteMany({});
      await Message.insertMany(messages);
      console.log('Messages migrated');
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
