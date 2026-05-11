require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrateImagesInObject(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = await migrateImagesInObject(obj[i]);
    }
  } else if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].startsWith('https://images.unsplash.com')) {
        console.log(`Migrating: ${obj[key]}`);
        try {
          const result = await cloudinary.uploader.upload(obj[key], {
            folder: 'prime_digital_cms'
          });
          console.log(`Success: ${result.secure_url}`);
          obj[key] = result.secure_url;
        } catch (error) {
          console.error(`Failed to migrate ${obj[key]}:`, error.message);
        }
      } else {
        obj[key] = await migrateImagesInObject(obj[key]);
      }
    }
  }
  return obj;
}

async function runMigration() {
  const dataPath = path.join(__dirname, 'data.json');
  
  if (fs.existsSync(dataPath)) {
    console.log('--- Starting Migration for data.json ---');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const updatedData = await migrateImagesInObject(data);
    fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
    console.log('--- Migration Complete for data.json ---');
  } else {
    console.log('data.json not found');
  }
}

runMigration().catch(console.error);
