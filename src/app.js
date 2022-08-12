import express from 'express';
import morgan from 'morgan';
import globalErrorHandler from './controllers/errorController';
import AppError from './utils/appError';
import router from './routes';

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// MAIN ROUTE
app.use('/api/v1', router);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server, try again!`,
      404
    )
  );
});

// GLOBAL ERROE MIDDLEWARE
app.use(globalErrorHandler);

export default app;
