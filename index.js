import express from 'express';
import expressValidation from 'express-validation';
import httpStatus from 'http-status';
import dotenv from 'dotenv';
import config from './src/config/config.js';
import routes from './src/routes/index.js';
import APIError from './src/apiError.js';

dotenv.config('.env');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get API Version from .env (or else assume 1.0)
const PORT = process.env.PORT;
const baseUrl = '/api/v1';

// mount all routes on /api path
app.use(baseUrl, routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    let unifiedErrorMessage, error;
    if (Array.isArray(err) && err.length) {
      unifiedErrorMessage = err.errors.map((error) => error.messages.join('. ')).join(' and ');
      error = new APIError(unifiedErrorMessage, err.status, true);
    } else {
      unifiedErrorMessage = `${err.error} and ${err.message}`;
      error = new APIError(unifiedErrorMessage, err.statusCode, true);
    }
    return next(error);
  }
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status || err.statusCode, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) =>
  res.status(err.status).json({
    // eslint-disable-line no-unused-vars
    error: {
      success: false,
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: ['production'].includes(config.env) ? {} : err.stack,
    },
  })
);

app.listen(PORT, () => {
  console.log('App is now running at port', PORT);
});
