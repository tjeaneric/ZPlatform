import express from 'express';
import welcome from './api/welcome';
import users from './api/users';

const routes = express.Router();

routes.use('/', welcome);
routes.use('/users', users);

export default routes;
