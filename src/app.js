import express from 'express';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './documentation';
import globalErrorHandler from './controllers/errorController';
import AppError from './utils/appError';
import router from './routes';

const app = express();

// GLOBAL MIDDLEWARES

//Set security HTTP headers
app.use(helmet());

//logging requests in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

//Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against Nosql query injection
/*
example of NoSQL query injection
--------------------------------
{
  "email": {"$gt":""},
  password: "pass1234"
}
*/
app.use(mongoSanitize());

//Data sanitization against XSS attacks like HTML code injection
app.use(xss());

//Prevent parameter pollution
app.use(hpp());

// MAIN ROUTE
app.use('/api/v1', limiter, router);

// DOCUMENTATION ROUTE
app.use(
  '/api/v1/documentation',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
    },
  })
);

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
