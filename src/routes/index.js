import express from 'express';
import welcome from './api/welcome';
import users from './api/users';
import tours from './api/tours';

const routes = express.Router();

routes.use('/', welcome);
routes.use('/users', users);
routes.use('/tours', tours);

export default routes;
