// Body is replaced with the parsed value. Query is parsed into res.locals.query
// because Express 5 makes req.query read-only.
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(source === 'query' ? req.query : req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid request', issues: result.error.issues });
  }
  if (source === 'query') res.locals.query = result.data;
  else req.body = result.data;
  next();
};
