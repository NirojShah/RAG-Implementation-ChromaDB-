class CustomError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);

    this.name = this.constructor.name; // "CustomError"
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace (V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = { CustomError };
