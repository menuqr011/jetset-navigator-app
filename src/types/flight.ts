
export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in hours
  stops: number;
  stopCities?: string[];
  price: number;
  currency: string;
  aircraft: string;
  flightNumber: string;
  departureDate: string;
  class: 'economy' | 'premium' | 'business' | 'first';
}

export interface SearchFilters {
  maxPrice: number;
  airlines: string[];
  maxStops: number;
  maxDuration: number;
  departureTimeRanges?: string[];
  travelClasses?: string[];
  directFlightsOnly?: boolean;
}

export interface SearchData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: string;
}
