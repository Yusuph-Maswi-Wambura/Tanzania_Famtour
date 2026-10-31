import { NextFunction, Request, Response } from 'express';

export function notFoundHandler(_request: Request, response: Response): void {
  response.status(404).json({ error: 'Route not found' });
}

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction): void {
  console.error(error);
  response.status(500).json({ error: 'An unexpected server error occurred' });
}
