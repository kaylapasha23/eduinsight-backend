import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { Logger } from '../utils/logger.js';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export function formatZodError(error: ZodError): ValidationErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

/**
 * Middleware untuk validasi request body menggunakan Zod Schema
 */
export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = formatZodError(result.error);
      Logger.warn(`[VALIDATION FAILED] ${req.method} ${req.originalUrl}`, errors);
      return res.status(400).json({
        success: false,
        message: 'Validasi input gagal. Silakan periksa kembali data Anda.',
        errors,
      });
    }

    req.body = result.data as any;
    return next();
  };
}

/**
 * Middleware untuk validasi request query parameters menggunakan Zod Schema
 */
export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = formatZodError(result.error);
      Logger.warn(`[QUERY VALIDATION FAILED] ${req.method} ${req.originalUrl}`, errors);
      return res.status(400).json({
        success: false,
        message: 'Parameter query tidak valid.',
        errors,
      });
    }

    req.query = result.data;
    return next();
  };
}

/**
 * Middleware untuk validasi request path parameters menggunakan Zod Schema
 */
export function validateParams(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const errors = formatZodError(result.error);
      Logger.warn(`[PARAMS VALIDATION FAILED] ${req.method} ${req.originalUrl}`, errors);
      return res.status(400).json({
        success: false,
        message: 'Parameter URL tidak valid.',
        errors,
      });
    }

    req.params = result.data;
    return next();
  };
}

export default {
  validateBody,
  validateQuery,
  validateParams,
};
