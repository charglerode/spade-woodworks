const mongoose = require('mongoose');
const env = require('dotenv');
const app = require('./app');

env.config({ path: './.env' });

const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASS);
mongoose.connect(db).then(() => console.log('Connected to database!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
