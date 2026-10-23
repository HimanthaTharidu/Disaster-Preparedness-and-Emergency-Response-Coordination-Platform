export function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// Express 5 passes errors from async handlers here too.
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
}
