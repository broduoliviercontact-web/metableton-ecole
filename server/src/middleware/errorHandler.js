export function errorHandler(err, req, res, _next) {
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.path}:`,
    err.message,
    err.details ? `\nDetails: ${err.details}` : '',
    err.stack ? `\nStack: ${err.stack}` : ''
  );

  // Known HTTP status code (thrown intentionally from route/service)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: {
        code: mapStatusCodeToErrorCode(err.statusCode),
        message: err.message,
      },
    });
  }

  // Supabase / PostgREST errors
  if (err.code && err.code.startsWith('PGRST')) {
    return res.status(400).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'A database error occurred.',
      },
    });
  }

  // Supabase local / PostgREST unavailable
  if (
    err.message?.includes('fetch failed') ||
    err.details?.includes('ECONNREFUSED') ||
    err.cause?.code === 'ECONNREFUSED'
  ) {
    return res.status(503).json({
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Supabase local is not reachable. Start Supabase and try again.',
      },
    });
  }

  // Google API errors
  if (err.response && err.response.status) {
    return res.status(502).json({
      error: {
        code: 'CLASSROOM_API_ERROR',
        message: 'Google Classroom is temporarily unavailable. Try again in a few minutes.',
      },
    });
  }

  // Default — unhandled
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
}

function mapStatusCodeToErrorCode(statusCode) {
  const map = {
    400: 'VALIDATION_ERROR',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
  };
  return map[statusCode] || 'INTERNAL_ERROR';
}
