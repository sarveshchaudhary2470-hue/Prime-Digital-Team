require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { Content, Client, Diary, Message, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in .env');
  process.exit(1);
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// --- RATE LIMITING ---

// Strict: Login route — max 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Moderate: Auth routes (forgot-password, reset, register) — 10 per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// General: All API routes — 100 per 15 min
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Rate limit exceeded. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Contact Form Limiter: max 6 messages per hour per IP to prevent spam
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 6,
  message: { message: 'Too many messages sent. Please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply general limiter to all /api routes
app.use('/api', apiLimiter);

// Apply strict limiter to login
app.use('/api/auth/login', loginLimiter);

// Apply moderate limiter to other auth routes
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/auth/register', authLimiter);

// Apply contact limiter specifically to the POST /api/messages route
app.post('/api/messages', contactLimiter);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prime_digital_cms',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0]
  }
});
const upload = multer({ storage });

// Email Transporter (Placeholder - user needs to provide SMTP details)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g., your-email@gmail.com
    pass: process.env.EMAIL_PASS  // e.g., app-specific password
  }
});

// Image Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = req.file.path;
  res.json({ url: imageUrl });
});

// --- CONTENT ROUTES ---
app.get('/api/content', async (req, res) => {
  try {
    const data = await Content.find({}).sort({ order: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error reading content', error });
  }
});

app.post('/api/content/update', async (req, res) => {
  try {
    const updatedData = req.body;
    for (const block of updatedData) {
      await Content.findOneAndUpdate({ id: block.id }, block, { upsert: true });
    }
    res.json({ message: 'Content updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving content', error });
  }
});

// --- CLIENTS ROUTES ---
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error reading clients', error });
  }
});

app.post('/api/clients/update', async (req, res) => {
  try {
    const updatedClients = req.body;
    await Client.deleteMany({});
    await Client.insertMany(updatedClients);
    res.json({ message: 'Clients updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving clients', error });
  }
});

// --- DIARY ROUTES ---
app.get('/api/diary', async (req, res) => {
  try {
    const diaryEntries = await Diary.find({});
    const diaryObj = {};
    diaryEntries.forEach(entry => {
      diaryObj[entry.date] = entry.data;
    });
    res.json(diaryObj);
  } catch (error) {
    res.status(500).json({ message: 'Error reading diary', error });
  }
});

app.post('/api/diary/update', async (req, res) => {
  try {
    const { date, data } = req.body;
    await Diary.findOneAndUpdate({ date }, { data }, { upsert: true });
    res.json({ message: 'Diary updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving diary', error });
  }
});

// --- AUTH ROUTES ---

// Real Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Forgot Password Route
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Prime Digital - Password Reset',
      text: `Aapne password reset karne ke liye request ki hai. Niche diye gaye link par click karein:\n\n${resetUrl}\n\nAgar aapne ye request nahi ki toh ise ignore karein.\n`
    };

    // Nodemailer call (will only work if SMTP is configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Recovery email sent!' });
    } else {
      console.log('--- RESET LINK (SMTP NOT CONFIGURED) ---');
      console.log(resetUrl);
      console.log('-----------------------------------------');
      res.json({ message: 'Recovery token generated (check server console as SMTP is not configured)' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error in forgot password', error });
  }
});

// Reset Password Route
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful! Please login.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
});

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// --- ADMIN MANAGEMENT ROUTES ---

// Get all admins
app.get('/api/auth/admins', authenticate, async (req, res) => {
  try {
    const admins = await User.find({}, '-password'); // Don't return passwords
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

// Create new admin
app.post('/api/auth/register', authenticate, async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    res.json({ message: 'New admin created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin' });
  }
});

// Delete admin
app.delete('/api/auth/admins/:id', authenticate, async (req, res) => {
  try {
    // Prevent deleting yourself (optional but recommended)
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin' });
  }
});

// --- MESSAGES API ---
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ date: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Message({
      id: 'm' + Date.now(),
      date: new Date().toLocaleString(),
      ...req.body
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error saving message' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' });
  }
});

// Serve static assets in production (Full-stack mode)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('(.*)', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

