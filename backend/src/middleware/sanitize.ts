import { Request, Response, NextFunction } from 'express';

/**
 * Input sanitization middleware.
 * Trims whitespace from all string body fields and normalizes email to lowercase.
 * Prevents accidental whitespace injection and case-sensitivity bugs.
 */
export const sanitizeInputs = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
        // Normalize email fields to lowercase
        if (key === 'email') {
          req.body[key] = req.body[key].toLowerCase();
        }
      }
    }
  }
  next();
};

/**
 * Validates that required fields are present and non-empty.
 * Returns 400 if any required field is missing.
 */
export const requireFields = (...fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = fields.filter(f => !req.body[f] || req.body[f] === '');
    if (missing.length > 0) {
      res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`
      });
      return;
    }
    next();
  };
};
