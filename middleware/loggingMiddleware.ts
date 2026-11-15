import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = diff[0] * 1e3 + diff[1] * 1e-6;
    Logger.http(req.method, req.originalUrl || req.url, res.statusCode, durationMs);
  });

  next();
}

export default requestLogger;
