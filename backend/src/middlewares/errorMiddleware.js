const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err.message);
  console.error("Stack:", err.stack);

  const statusCode = err.statusCode || 500;

  let userMessage = "Something went wrong. Please try again.";

  if (err.message.includes("foreign key constraint")) {
    userMessage = "Unable to complete the operation. Please refresh and try again.";
  } else if (err.message.includes("not found")) {
    userMessage = err.message;
  } else if (err.message.includes("required") || err.message.includes("must be")) {
    userMessage = err.message;
  } else if (err.message.includes("already exists")) {
    userMessage = err.message;
  } else if (statusCode === 401) {
    userMessage = "Please log in to continue.";
  } else if (statusCode === 403) {
    userMessage = "You don't have permission to perform this action.";
  } else if (statusCode === 404) {
    userMessage = "The requested resource was not found.";
  } else if (err.message && statusCode < 500) {
    userMessage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: userMessage
  });
};

module.exports = errorHandler;