const errorHandler = (err, req, res, next) => {
  // Log full error details in terminal for debugging
  console.error("🔥 Error occurred:");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Create user-friendly error messages
  let userMessage = "Something went wrong. Please try again.";

  // Map common errors to friendly messages
  if (err.message.includes("foreign key constraint")) {
    userMessage = "Unable to complete the operation. Please refresh and try again.";
  } else if (err.message.includes("not found")) {
    userMessage = err.message; // These are usually safe to show
  } else if (err.message.includes("required") || err.message.includes("must be")) {
    userMessage = err.message; // Validation errors are safe
  } else if (err.message.includes("already exists")) {
    userMessage = err.message;
  } else if (statusCode === 401) {
    userMessage = "Please log in to continue.";
  } else if (statusCode === 403) {
    userMessage = "You don't have permission to perform this action.";
  } else if (statusCode === 404) {
    userMessage = "The requested resource was not found.";
  } else if (err.message && statusCode < 500) {
    // Client errors (4xx) can show the original message
    userMessage = err.message;
  }

  // Send response to client (no stack trace)
  res.status(statusCode).json({
    success: false,
    message: userMessage
  });
};

module.exports = errorHandler;