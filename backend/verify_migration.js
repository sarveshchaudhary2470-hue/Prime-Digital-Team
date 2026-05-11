require('dotenv').config();
const mongoose = require('mongoose');
const { Content, Client, Diary, Message } = require('./models');

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- MongoDB Migration Verification ---');

    const contentCount = await Content.countDocuments();
    console.log(`Content blocks: ${contentCount}`);

    const clientCount = await Client.countDocuments();
    console.log(`Clients: ${clientCount}`);

    const diaryCount = await Diary.countDocuments();
    console.log(`Diary entries: ${diaryCount}`);

    const messageCount = await Message.countDocuments();
    console.log(`Messages: ${messageCount}`);

    if (contentCount > 0 && clientCount > 0) {
      console.log('\nVERIFICATION SUCCESS: Data is present in cloud collections.');
    } else {
      console.error('\nVERIFICATION WARNING: Some collections are empty!');
    }

    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
}
verify();
