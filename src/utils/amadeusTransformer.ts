
import { Flight } from "@/types/flight";
import { AmadeusFlightOffer, AmadeusSearchResponse } from "@/services/amadeusApi";

const airlineNames: Record<string, string> = {
  'AA': 'American Airlines',
  'DL': 'Delta Airlines',
  'UA': 'United Airlines',
  'BA': 'British Airways',
  'LH': 'Lufthansa',
  'AF': 'Air France',
  'KL': 'KLM',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
  'TK': 'Turkish Airlines',
  'SQ': 'Singapore Airlines',
  'CX': 'Cathay Pacific',
  'JL': 'Japan Airlines',
  'NH': 'ANA',
  'AC': 'Air Canada',
};

const cityNames: Record<string, string> = {
  'JFK': 'New York',
  'LAX': 'Los Angeles', 
  'LHR': 'London',
  'CDG': 'Paris',
  'DXB': 'Dubai',
  'NRT': 'Tokyo',
  'SYD': 'Sydney',
  'SIN': 'Singapore',
  'FRA': 'Frankfurt',
  'AMS': 'Amsterdam',
  'BOM': 'Mumbai',
  'DEL': 'Delhi',
  'BLR': 'Bangalore',
  'MAA': 'Chennai',
  'CCU': 'Kolkata',
  'HYD': 'Hyderabad',
};

function parseDuration(isoDuration: string): number {
  // Parse ISO 8601 duration (PT2H30M) to hours
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  return hours + minutes / 60;
}

function mapCabinToClass(cabin: string): 'economy' | 'premium' | 'business' | 'first' {
  switch (cabin.toLowerCase()) {
    case 'first':
      return 'first';
    case 'business':
      return 'business';
    case 'premium_economy':
      return 'premium';
    default:
      return 'economy';
  }
}

export function transformAmadeusToFlights(
  amadeusResponse: AmadeusSearchResponse
): Flight[] {
  return amadeusResponse.data.map((offer: AmadeusFlightOffer, index: number) => {
    const firstItinerary = offer.itineraries[0];
    const firstSegment = firstItinerary.segments[0];
    const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];
    
    // Calculate total stops
    const totalStops = firstItinerary.segments.reduce((sum, segment) => sum + segment.numberOfStops, 0);
    
    // Get airline info
    const airlineCode = firstSegment.carrierCode;
    const airlineName = amadeusResponse.dictionaries.carriers[airlineCode] || airlineNames[airlineCode] || airlineCode;
    
    // Get airport/city names
    const originCode = firstSegment.departure.iataCode;
    const destinationCode = lastSegment.arrival.iataCode;
    const originName = cityNames[originCode] || originCode;
    const destinationName = cityNames[destinationCode] || destinationCode;
    
    // Parse times
    const departureTime = new Date(firstSegment.departure.at).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const arrivalTime = new Date(lastSegment.arrival.at).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Get flight class from traveler pricing
    const cabin = offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY';
    const flightClass = mapCabinToClass(cabin);
    
    // Get aircraft info
    const aircraftCode = firstSegment.aircraft.code;
    const aircraftName = amadeusResponse.dictionaries.aircraft[aircraftCode] || aircraftCode;
    
    // Calculate stop cities
    const stopCities = firstItinerary.segments.length > 1 
      ? firstItinerary.segments.slice(0, -1).map(segment => 
          cityNames[segment.arrival.iataCode] || segment.arrival.iataCode
        )
      : undefined;

    return {
      id: offer.id || `flight-${index}`,
      airline: airlineName,
      airlineCode: airlineCode,
      airlineLogo: '✈️', // Default emoji, could be mapped to actual logos
      origin: originName,
      destination: destinationName,
      originCode: originCode,
      destinationCode: destinationCode,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      duration: parseDuration(firstItinerary.duration),
      stops: Math.max(0, firstItinerary.segments.length - 1),
      stopCities: stopCities,
      price: Math.round(parseFloat(offer.price.grandTotal)),
      currency: offer.price.currency,
      aircraft: aircraftName,
      flightNumber: `${airlineCode}${firstSegment.number}`,
      departureDate: firstSegment.departure.at,
      class: flightClass
    };
  });
}
