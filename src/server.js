import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION, Shutting down.....');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connected succesfully!'));

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`App listening on port ${port}!....`)
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, Shutting down.....');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

export default server;
