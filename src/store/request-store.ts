import { randomUUID } from 'node:crypto';

import { pool } from '../db/pool';
import { ContactMessage, QuoteRequest, TripRequest } from '../types/domain';

export class RequestStore {
  async addTripRequest(input: Omit<TripRequest, 'id' | 'createdAt'>): Promise<TripRequest> {
    const request = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    await pool.query(
      `INSERT INTO trip_requests
       (id, name, email, nationality, phone, arrival_date, duration, travellers, budget, destination, style, message, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [request.id, request.name, request.email, request.nationality, request.phone, request.arrivalDate, request.duration, request.travellers, request.budget, request.destination, request.style, request.message, request.createdAt],
    );
    return request;
  }

  async addQuoteRequest(input: Omit<QuoteRequest, 'id' | 'createdAt'>): Promise<QuoteRequest> {
    const request = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    await pool.query(
      `INSERT INTO quote_requests (id, tour_id, name, email, travel_date, travellers, message, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [request.id, request.tourId, request.name, request.email, request.travelDate, request.travellers, request.message, request.createdAt],
    );
    return request;
  }

  async addContactMessage(input: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
    const message = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    await pool.query(
      `INSERT INTO contact_messages (id, name, email, subject, message, created_at)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [message.id, message.name, message.email, message.subject, message.message, message.createdAt],
    );
    return message;
  }
}

export const requestStore = new RequestStore();
