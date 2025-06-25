const MAX_BUFFER_SIZE = 1024; // 1KB

function safeBufferConversion(input, encoding = 'hex') {
  if (input.length > MAX_BUFFER_SIZE * 2 && encoding === 'hex') {
    throw new SecurityError('Input exceeds maximum allowed size');
  }
  return Buffer.from(input, encoding);
}

class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SecurityError';
    // Remove stack trace for production
    if (process.env.NODE_ENV === 'production') {
      this.stack = undefined;
    }
  }
}
