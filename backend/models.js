const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  id: String,
  type: String,
  order: Number,
  content: Object
}, { collection: 'content' });

const clientSchema = new mongoose.Schema({
  id: String,
  name: String,
  contactPerson: String,
  email: String,
  phone: String,
  servicePlan: String,
  startDate: String,
  renewalDate: String,
  status: String
}, { collection: 'clients' });

const diarySchema = new mongoose.Schema({
  date: String,
  data: Object
}, { collection: 'diary' });

const messageSchema = new mongoose.Schema({
  id: String,
  date: String,
  name: String,
  email: String,
  message: String
}, { collection: 'messages' });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { collection: 'users' });

module.exports = {
  Content: mongoose.model('Content', contentSchema),
  Client: mongoose.model('Client', clientSchema),
  Diary: mongoose.model('Diary', diarySchema),
  Message: mongoose.model('Message', messageSchema),
  User: mongoose.model('User', userSchema)
};
