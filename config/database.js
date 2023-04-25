import mongoose from 'mongoose';
import config from './index.js';

const connectToDb = () => {
  mongoose
    .connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((conn) => {
      console.log(`Connected DB: ${conn.connection.host}`);
    })
    .catch((error) => {
      console.log('Database connection failed');
      console.log(error);
      process.exit(1);
    });
};

export default connectToDb;
