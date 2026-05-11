# Prime Digital Team - Award-Winning Digital Agency

A premium, full-stack digital agency website with a built-in custom CMS, secure admin management, and automated password recovery.

## 🚀 Features

- **Modern UI/UX**: Built with React, Framer Motion, and Glassmorphism aesthetics.
- **Custom CMS**: Admin can manage services, portfolio, clients, and team members without touching code.
- **Secure Authentication**: JWT-based auth with bcrypt password hashing.
- **Multi-Admin Management**: Primary admin can create and manage additional administrators.
- **Automated Password Recovery**: Real-time email reset links using Nodemailer and Gmail SMTP.
- **Spam Protection**: Tiered rate limiting on login, auth routes, and contact forms.
- **Cloud Database**: Fully persistent data stored in MongoDB Atlas.
- **Media Management**: Cloudinary integration for lightning-fast image delivery.
- **SEO Optimized**: Pre-configured meta tags, OG tags, sitemap, and robots.txt.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Framer Motion, CSS3 (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Security**: JWT, BcryptJS, Express-Rate-Limit
- **Services**: Cloudinary (Images), Nodemailer (Emails)

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/prime-digital-team.git
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` folder (use `.env.example` as a template).
   - Add your MongoDB URI, Cloudinary keys, and Gmail App Password.

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application**:
   - Start Backend: `cd backend && npm run dev` (or `node server.js`)
   - Start Frontend: `cd frontend && npm run dev`

## 🛡️ Security Note

The `.env` file is included in `.gitignore` to prevent sensitive keys from being leaked. Never share your actual `.env` file publicly.

## 🌐 Deployment (Render)

This project is configured for **Unified Deployment** (Frontend + Backend in one service).

1. **Create a new "Web Service"** on Render.
2. **Connect your GitHub Repository**.
3. **Build Command**: `npm run build-all`
4. **Start Command**: `npm start`
5. **Add Environment Variables**:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `NODE_ENV`: `production`

Render will automatically build your frontend and serve it through your Node.js backend.

---
Built with ❤️ by Prime Digital Team
