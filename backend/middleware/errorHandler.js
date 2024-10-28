const errorHandler = (err, req, res, next) => {
  // Log error details to the console for debugging
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }

  // Set default status code and message if not provided
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send structured JSON response with conditionally included stack trace
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Include stack only in development mode for security
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
