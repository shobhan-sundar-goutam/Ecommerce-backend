import cloudinary from 'cloudinary';
import app from './app.js';
import connectToDb from './config/database.js';
import config from './config/index.js';

const PORT = config.PORT;

connectToDb();

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
