import Tour from '../models/tourModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      tour: newTour,
    },
  });
});

export const getAllTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: {
      tours,
    },
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new AppError(`No tour found for this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour,
    },
  });
});
