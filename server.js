import app from './app.js';
import config from './config/index.js';
import connectToDb from './config/database.js';

const PORT = config.PORT;

connectToDb();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
