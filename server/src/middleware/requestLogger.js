// Request logger middleware - logs HTTP method, path, status, and duration
// Does NOT log: query string, body, cookies, session, tokens, secrets, headers

export default function requestLogger(req, res, next) {
  const startTime = Date.now();

  // Override res.end to capture final response
  const originalEnd = res.end.bind(res);
  let status = 200;

  res.on('finish', () => {
    status = res.statusCode;
  });

  res.end = function (chunk, encoding) {
    status = res.statusCode;
    return originalEnd(chunk, encoding);
  };

  // Capture status code if sent explicitly
  const originalWriteHead = res.writeHead.bind(res);
  res.writeHead = function (statusCode, ...args) {
    status = statusCode;
    return originalWriteHead(statusCode, ...args);
  };

  next();

  // Log after response is complete
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Log method + path only (no query string, no body, no headers)
    console.log(`${req.method} ${req.path} ${status} ${duration}ms`);
  });
}
