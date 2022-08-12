import express from 'express';
import {
  getAllTours,
  createTour,
  getTour,
} from '../../controllers/tourController';

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour);

export default router;
