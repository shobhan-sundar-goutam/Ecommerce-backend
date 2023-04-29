import express from 'express';
import home from './routes/home.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', home);

export default app;
