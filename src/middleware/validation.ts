import { NextFunction, Request, Response } from 'express';
import { z, ZodType } from 'zod';

export function validateBody<T>(schema: ZodType<T>) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      response.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
      return;
    }
    request.body = result.data;
    next();
  };
}

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5).max(5000),
});

export const tripRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  nationality: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(40).optional(),
  arrivalDate: z.string().trim().max(30).optional(),
  duration: z.string().trim().max(30).optional(),
  travellers: z.string().trim().max(30).optional(),
  budget: z.string().trim().max(50).optional(),
  destination: z.string().trim().max(100).optional(),
  style: z.string().trim().max(50).optional(),
  message: z.string().trim().max(5000).optional(),
});

export const quoteRequestSchema = z.object({
  tourId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  travelDate: z.string().trim().max(30).optional(),
  travellers: z.string().trim().max(30).optional(),
  message: z.string().trim().max(5000).optional(),
});
