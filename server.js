require('dotenv').config({ path: './config.env', override: true });
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! 💥 Shutting Down....');
  console.error({ err }, `${err.name}: ${err.message}`);

  process.exit(1);
});
// dotenv.config('./config.env');
// console.log(process.env.NODE_ENV);
const app = require('./app');

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/Natours').then(() => {
  console.log('MongoDB connected successfully!');
});
// .catch((err) => {
//   console.log(err);
// });

// START THE SERVER
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});

process.on('unhandleRejection', (err) => {
  console.error(`${err.name}: ${err.message}`);
  console.log('Unhandle Rejection! 💥 Shutting Down....');
  server.close(() => {
    process.exit(1);
  });
});
