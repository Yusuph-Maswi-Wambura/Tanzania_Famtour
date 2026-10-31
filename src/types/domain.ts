export interface Tour {
  id: number;
  title: string;
  duration: number;
  price: number;
  style: 'Luxury' | 'Budget' | 'Mid-range';
  type: 'Private' | 'Shared';
  destinations: string[];
  operator: string;
  rating: number;
  reviews: number;
  tag: string;
  image: string;
  description: string;
  itinerary: string[];
}

export interface Destination {
  name: string;
  tagline: string;
  image: string;
  slug: string;
}

export interface Operator {
  name: string;
  speciality: string;
  initials: string;
  rating: number;
}

export interface TripRequest {
  id: string;
  name: string;
  email: string;
  nationality?: string;
  phone?: string;
  arrivalDate?: string;
  duration?: string;
  travellers?: string;
  budget?: string;
  destination?: string;
  style?: string;
  message?: string;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  tourId: number;
  name: string;
  email: string;
  travelDate?: string;
  travellers?: string;
  message?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}
