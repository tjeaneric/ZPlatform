import express from 'express';
import welcome from './api/welcome';

const routes = express.Router();

routes.use('/', welcome);

export default routes;
