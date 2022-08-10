import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log('App listening on port 3000!....')
);

export default server;
