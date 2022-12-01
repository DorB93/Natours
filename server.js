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
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri =
//   'mongodb+srv://Dor2081:MFJYELuH7q31yo45@cluster0.sqnvj.mongodb.net/?retryWrites=true&w=majority';
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client.connect((err) => {
//   const collection = client.db('test').collection('devices');
//   // perform actions on the collection object
//   client.close();
// });
mongoose
  .connect(
    'mongodb+srv://Dor2081:MFJYELuH7q31yo45@cluster0.sqnvj.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => {
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

process.on('SIGTERM', () => {
  console.log('🔱 sigterm received! Shutting down gracefully');
  server.close(() => {
    console.log('Process Terminated!');
  });
});
