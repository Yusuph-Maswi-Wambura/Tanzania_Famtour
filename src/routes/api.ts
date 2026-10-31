import { NextFunction, Request, Response, Router } from 'express';

import { destinations, operators, tours } from '../data/catalog';
import { validateBody, contactSchema, quoteRequestSchema, tripRequestSchema } from '../middleware/validation';
import { requestStore } from '../store/request-store';

export const apiRouter = Router();

const asyncRoute = (handler: (request: Request, response: Response) => Promise<void>) =>
  (request: Request, response: Response, next: NextFunction): void => {
    handler(request, response).catch(next);
  };

apiRouter.get('/tours', (request, response) => {
  const destination = typeof request.query.destination === 'string' ? request.query.destination : undefined;
  const style = typeof request.query.style === 'string' ? request.query.style : undefined;
  const type = typeof request.query.type === 'string' ? request.query.type : undefined;
  const maxPrice = request.query.maxPrice ? Number(request.query.maxPrice) : undefined;
  const result = tours.filter((tour) =>
    (!destination || tour.destinations.includes(destination)) &&
    (!style || tour.style === style) &&
    (!type || tour.type === type) &&
    (maxPrice === undefined || (Number.isFinite(maxPrice) && tour.price <= maxPrice)),
  );
  response.json({ data: result, count: result.length });
});

apiRouter.get('/tours/:id', (request, response) => {
  const tour = tours.find((item) => item.id === Number(request.params.id));
  if (!tour) {
    response.status(404).json({ error: 'Tour not found' });
    return;
  }
  response.json({ data: tour });
});

apiRouter.get('/destinations', (_request, response) => response.json({ data: destinations }));
apiRouter.get('/operators', (_request, response) => response.json({ data: operators }));

apiRouter.post('/requests', validateBody(tripRequestSchema), asyncRoute(async (request, response) => {
  const created = await requestStore.addTripRequest(request.body);
  response.status(201).json({ message: 'Trip request received', data: created });
}));

apiRouter.post('/quotes', validateBody(quoteRequestSchema), asyncRoute(async (request, response) => {
  const tour = tours.find((item) => item.id === request.body.tourId);
  if (!tour) {
    response.status(404).json({ error: 'Tour not found' });
    return;
  }
  const created = await requestStore.addQuoteRequest(request.body);
  response.status(201).json({ message: 'Quotation request received', data: created });
}));

apiRouter.post('/contact', validateBody(contactSchema), asyncRoute(async (request, response) => {
  const created = await requestStore.addContactMessage(request.body);
  response.status(201).json({ message: 'Message received', data: created });
}));
