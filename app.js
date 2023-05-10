import cookieParser from 'cookie-parser';
import express from 'express';
import fileUpload from 'express-fileupload';

// Routes
import category from './routes/category.route.js';
import home from './routes/home.route.js';
import user from './routes/user.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

app.use('/api/v1', category);
app.use('/api/v1', user);
app.use('/api/v1', home);

export default app;
