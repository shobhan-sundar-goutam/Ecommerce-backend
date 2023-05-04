import express from 'express';
import cookieParser from 'cookie-parser';

// Routes
import home from './routes/home.route.js';
import user from './routes/user.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', user);
app.use('/api/v1', home);

export default app;
